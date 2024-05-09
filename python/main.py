from preprocessing import DataLoader
from qa import QA
from typing import Optional
from fastapi import Body, FastAPI, HTTPException, status, Header, File, UploadFile, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from database.config import get_db
from sqlalchemy.orm import Session
from database.models import User, Document
import os.path
from services.nextCloud import upload_file, getUrl, moveFile, delete
from dotenv import load_dotenv;
import os
import tensorflow as tf
from jobs.handleWriteDocument import bulkInsertDocuments
from sqlalchemy import or_, text
from elasticsearch import Elasticsearch
from const.dateTime import mysqlDatetime, elasticsearchDatetime
from const.customQuery import generateCustomQuery
from middlewares.documents import checkBelongsToUser, checkExistDocument, checkExistFolder

es = Elasticsearch(["elasticsearch:9200"])

app = FastAPI(debug=True)
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail={"success": 0, "message": "Could not validate credentials"},
    headers={"Authorization": "Bearer"},
)

print(tf.config.list_physical_devices('GPU'))

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
HASH_ALGORITHM = os.getenv('HASH_ALGORITHM')

async def get_current_user(token):
    try:
        user = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=[HASH_ALGORITHM])
        if user is None or user.get('activated_at') is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    return user


@app.get('/api/search')
async def search_document(Authorization: str = Header("Authorization"),
                          page: int = 1,
                          per_page: int = 20,
                          query: str = '',
                          filter: dict = {},
                          type : int = None,
                          start: str = None,
                          end: str = None):
  if Authorization is None:
      raise credentials_exception
  token = Authorization.split(' ')[1]
  user = await get_current_user(token)
  print(filter, type, start, end)
  filters = None
  if start != '' and end != '':
      filters = {"range" : {"updated_at": {"gte": start[0:10], "lte": end[0:10]}}}
  elif start != '':
      filters = {"range" : {"updated_at": {"gte": start[0:10]}}}
  elif end != '':
      filters = {"range" : {"updated_at": {"lte": end[0:10]}}}

  custom_query = generateCustomQuery(query, filters, user['username'])
  result = es.search(index="document", body=custom_query)

  data_array = list(map(lambda hit: hit['_source'], result['hits']['hits']))
  if type == 1:
      data_array = [doc for doc in data_array if doc['type'] == 'folder']
  elif type == 2:
      print("file pdf")
      data_array = [doc for doc in data_array if doc['type'] == 'file' and doc['title'].endswith(".pdf")]
  elif type == 3:
      data_array = [doc for doc in data_array if doc['type'] == 'file' and (doc['title'].endswith(".doc") or doc['title'].endswith(".docx"))]
  elif type == 4:
      data_array = [doc for doc in data_array if doc['type'] == 'file' and (doc['title'].endswith(".xls") or doc['title'].endswith(".xlsx"))]
  return {"success": 1, "data": {"success": 1, "documents": data_array}, "message": "search successfully"}

@app.post('/api/store')
async def store_document(parent_id = Body(None),
                         type : str = Body(...),
                         folder_name = Body(None),
                         file: UploadFile = File('file'),
                         Authorization: str = Header("Authorization"),
                         method = Body('auto'),
                         db: Session = Depends(get_db)):
    check = False
    print(type)
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        if type == 'file':
            if checkExistDocument(user['id'], f'{parent_id}_{file.filename}'):
                raise Exception("Tài liệu trùng tên")
            content = file.file.read()
            print('start upload')
            db.begin()
            check = upload_file(user['id'], f'{parent_id}_{file.filename}', content)
            if not check:
                raise Exception("Tải file thất bại")
            url = getUrl(f"/Documents/{user['id']}/{parent_id}_{file.filename}")
            print(method)
            document = Document(
                name=file.filename,
                type="file",
                user_id=user["id"],
                parent_id=parent_id,
                url=url
            )
            db.add(document)
            db.commit()
            db.refresh(document)
            bulkInsertDocuments.apply_async((file.filename, user, parent_id, method, content, document.id, url), countdown=5)
            await file.close()
        elif type == 'folder':
            document = Document(name=folder_name, type="folder", user_id=user["id"], parent_id=parent_id, url = None)
            db.begin()
            if checkExistFolder(db, parent_id, folder_name):
                raise Exception("Folder trùng tên")
            db.add(document)
            db.commit()
            db.refresh(document)
            data_storage = DataLoader(folder_name, user, parent_id, document.id, None, method)
            result = await data_storage.addFolderInfo()
        return {"success": 1, "message": "create successfully"}
    except Exception as e:
        print(e)
        if check:
            delete(user['id'], f"{parent_id}_{file.filename}")
        db.rollback()
        return {"success": 0, "message": "Khởi tạo tài liệu thất bại"}

@app.get('/api/documents')
async def myDocuments(Authorization: str = Header("Authorization"),
                      db: Session = Depends(get_db),
                      parent_id = None,
                      marked = None,
                      deleted = None,
                      type = None,
                      start = None,
                      end = None):
    try:
        print(parent_id)
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        documents = None
        query = db.query(Document).filter(Document.user_id == user['id']).order_by(Document.updated_at.desc())
        if parent_id:
            query = query \
                .filter(Document.parent_id == parent_id).filter(Document.deleted_at.is_(None))
        elif not marked and not deleted:
            query = query \
                .filter(Document.parent_id.is_(None)).filter(Document.deleted_at.is_(None))
        if marked and not parent_id:
            query = query.filter(Document.marked)
        if deleted and not parent_id:
            query = query.filter(Document.deleted_at.isnot(None))
        if start:
            query = query.filter(Document.updated_at >= start)
        if end:
            query = query.filter(Document.updated_at <= end)
        documents = query
        folders = []
        files = []
        print(type, start, end)
        if type == '1':
            folders = [doc for doc in documents if doc.type == 'folder']
        elif type == '2':
            print("file pdf")
            files = [doc for doc in documents if doc.type == 'file' and doc.name.endswith(".pdf")]
        elif type == '3':
            files = [doc for doc in documents if doc.type == 'file' and (doc.name.endswith(".doc") or doc.name.endswith(".docx"))]
        elif type == '4':
            files = [doc for doc in documents if doc.type == 'file' and (doc.name.endswith(".xls") or doc.name.endswith(".xlsx"))]
        else:
            folders = [doc for doc in documents if doc.type == 'folder']
            files = [doc for doc in documents if doc.type == 'file']
        result = {"folders": folders, "files": files}
        return {"success": 1, "data": result, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}

@app.put('/api/documents/{id}')
async def updateDocument(request: Request, id: int, Authorization: str = Header("Authorization"), db: Session = Depends(get_db)):
    check = False
    oldName = None
    newName = None
    user = None
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        data = await request.json()
        db.begin()
        current =  db.query(Document).filter(Document.id == id).first()
        if not current:
            raise Exception("Không tồn tại tài liệu")
        if not checkBelongsToUser(user['id'], current.user_id):
            raise Exception("Tài liệu không thuộc quyền sở hữu")
        if current.type == "file":
            oldName = f"{current.parent_id}_{current.name}"
        if not oldName and current.type == "file":
            raise Exception("Lỗi thông tin file")
        if 'parent_id' in data:
            if current.type == "file":
                newName = f"{data['parent_id']}_{current.name}"
                if checkExistDocument(user["id"], newName):
                    raise Exception("Tài liệu trùng tên")
            elif current.type =="folder":
                if checkExistFolder(db, data['parent_id'], current.name):
                    raise Exception("Folder trùng tên")
        elif 'name' in data:
            if current.type == "file":
                newName = f"{current.parent_id}_{data['name']}"
                if checkExistDocument(user["id"], newName):
                    raise Exception("Tài liệu trùng tên")
                data['title'] = data['name']
            elif current.type == "folder":
                print(data['name'])
                if checkExistFolder(db, current.parent_id, data['name']):
                    raise Exception("Folder trùng tên")
        if newName:
            check = moveFile(user['id'], oldName, newName)
            if not check:
                raise Exception("Thay đổi thất bại")
            url = getUrl(f"/Documents/{user['id']}/{newName}")
            data['url'] = url

        data['updated_at'] = elasticsearchDatetime()
        temp_updated_at = mysqlDatetime()
        update_query = {
            "query": {
                "term": {
                    "id": id
                }
            },
            "script": {
                "source": "",
                "params": {}
            }
        }
        source_script = ""
        params_script = {}
        for key, value in data.items():
            source_script += f"ctx._source['{key}'] = params.{key};"
            params_script[key] = value
        update_query["script"]["source"] = source_script
        update_query["script"]["params"] = params_script
        data.pop('title', None)
        data['updated_at'] = temp_updated_at
        db.query(Document).filter(Document.id == id).update(data)
        es.update_by_query(index="document", body=update_query)
        db.commit()
        return {"success": 1, "message": "Cập nhật tài liệu thành công"}
    except Exception as e:
        # Nếu có lỗi, rollback giao dịch
        if check:
            moveFile(user['id'], newName, oldName)
        db.rollback()
        print("Error occurred during database transaction:", e)
        return {"success": 0, "message": "Error occurred during database transaction"}

@app.put('/api/trash/{id}')
async def toggleTrash(request: Request, id: int, Authorization: str = Header("Authorization"), db: Session = Depends(get_db)):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        data = await request.json()
        print(data)
        db.begin()
        current =  db.query(Document).filter(Document.id == id).first()
        if not current:
            raise Exception("Không tồn tại tài liệu")
        if not checkBelongsToUser(user['id'], current.user_id):
            raise Exception("Tài liệu không thuộc quyền sở hữu")
        recursiveQuery = f"""WITH RECURSIVE child_documents AS (
                            SELECT *
                            FROM documents
                            WHERE parent_id = {id} and type = "folder"
                            UNION ALL
                            SELECT f.*
                            FROM documents f
                            JOIN child_documents cd ON f.parent_id = cd.id and f.type = "folder"
                        )
                        SELECT * FROM child_documents ORDER BY parent_id;"""
        childFolders = db.execute(recursiveQuery)
        childFolders = [dict(row)['id'] for row in childFolders]
        childFolders.append(id)
        mysql_deleted_at = mysqlDatetime()
        elastic_deleted_at = elasticsearchDatetime()

        if data["type"] == "delete":
            data['deleted_at'] = elastic_deleted_at
        elif data["type"] == "restore":
            if current.parent and current.parent.deleted_at:
                data['parent_id'] = None
                if current.type == "file":
                    oldName = f"{current.parent_id}_{current.name}"
                    newName = f"None_{current.name}"
                    moveFile(user['id'], oldName, newName)
                    url = getUrl(f"/Documents/{user['id']}/{newName}")
                    data['url'] = url
            data['deleted_at'] = None
        data.pop("type", None)
        print(data)
        update_query = {
            "query": {
                "bool": {
                    "should": [
                        {
                            "term": {
                                "id": id
                            }
                        },
                        {
                            "terms": {
                                "parent_id": childFolders
                            }
                        }
                    ]
                }
            },
            "script": {
                "source": "",
                "params": {}
            }
        }
        source_script = ""
        params_script = {}
        for key, value in data.items():
            source_script += f"ctx._source['{key}'] = params.{key};"
            params_script[key] = value
        update_query["script"]["source"] = source_script
        update_query["script"]["params"] = params_script
        if data.get("deleted_at"):
            data['deleted_at'] = mysql_deleted_at
        db.query(Document).filter(Document.id == id).update(data)
        es.update_by_query(index="document", body=update_query)
        db.commit()
        db.refresh(current)
        return {"success": 1, "data": current,  "message": "toggle trash successfully"}
    except Exception as e:
        # Nếu có lỗi, rollback giao dịch
        db.rollback()
        print("Error occurred during database transaction:", e)
        return {"success": 0, "message": "Error occurred during database transaction"}

@app.delete('/api/delete/{id}')
async def deleteDocument(id: int, Authorization: str = Header("Authorization"), db: Session = Depends(get_db)):
    check = False
    name = None
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        db.begin()
        current =  db.query(Document).filter(Document.id == id).first()
        if not current:
            raise Exception("Không tồn tại tài liệu")
        if not checkBelongsToUser(user['id'], current.user_id):
            raise Exception("Tài liệu không thuộc quyền sở hữu")
        recursiveQuery = f"""WITH RECURSIVE child_documents AS (
                            SELECT *
                            FROM documents
                            WHERE parent_id = {id} and type = "folder"
                            UNION ALL
                            SELECT f.*
                            FROM documents f
                            JOIN child_documents cd ON f.parent_id = cd.id and f.type = "folder"
                        )
                        SELECT * FROM child_documents ORDER BY parent_id;"""
        childFolders = db.execute(recursiveQuery)
        childFolders = [dict(row)['id'] for row in childFolders]
        childFolders.append(id)
        name = f"{current.parent_id}_{current.name}"
        if name is None:
            raise Exception("Thông tin sai")
        delete_query = {
            "query": {
                "bool": {
                    "should": [
                        {
                            "term": {
                                "id": id
                            }
                        },
                        {
                            "terms": {
                                "parent_id": childFolders
                            }
                        }
                    ]
                }
            }
        }
        db.query(Document).filter(or_(Document.id == id, Document.parent_id.in_(childFolders))).delete()
        es.delete_by_query(index="document", body=delete_query)
        if current.type == "file":
            check = delete(user['id'], name)
            if not check:
                raise Exception("Thay đổi thất bại")
        db.commit()
        return {"success": 1, "message": "delete successfully"}
    except Exception as e:
        # Nếu có lỗi, rollback giao dịch
        db.rollback()
        print("Error occurred during database transaction:", e)
        return {"success": 0, "message": "Error occurred during database transaction"}

@app.get('/api/documents/{id}')
async def getMetadata(id: int, Authorization: str = Header("Authorization"), db: Session = Depends(get_db)):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        sql = text(f"""WITH RECURSIVE parent_directories AS (
                        SELECT *
                        FROM documents
                        WHERE id = {id}
                        UNION ALL
                        SELECT f.*
                        FROM documents f
                        JOIN parent_directories pd ON f.id = pd.parent_id
                    )
                    SELECT * FROM parent_directories ORDER BY parent_id;""")
        result = db.execute(sql)
        documents = [dict(row) for row in result]
        if not checkBelongsToUser(user['id'], documents[0]['user_id']):
            raise Exception("Tài liệu không thuộc quyền sở hữu")
        print(documents)
        return {"success": 1, "data": documents, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}

@app.get('/api/content/{id}')
async def getMetadata(id: int, Authorization: str = Header("Authorization"), db: Session = Depends(get_db)):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        document = db.query(Document).filter(Document.id == id).first()
        if not document:
            raise Exception("Không tồn tại tài liệu")
        if not checkBelongsToUser(user['id'], document.user_id):
            raise Exception("Tài liệu không thuộc quyền sở hữu")
        return {"success": 1, "data": document, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}

@app.get('/api/move')
async def moveMenu(Authorization: str = Header("Authorization"), db: Session = Depends(get_db), parent_id = None):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        documents = None
        parentFolder = None
        query = db.query(Document).filter(Document.type == "folder").order_by(Document.updated_at.desc())
        if parent_id:
            documents = query.filter(Document.parent_id == parent_id).all()
            parentFolder = query.filter(Document.id == parent_id).first()
        else:
            documents = query.filter(Document.parent_id.is_(None)).all()
            parentFolder = None
        return {"success": 1, "data": {"documents": documents, "parentFolder": parentFolder}, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}

@app.post('/api/save/{id}')
async def store_document(id: int,
                         file: UploadFile = File(...),
                         Authorization: str = Header("Authorization"),
                         method: str = 'auto',
                         db: Session = Depends(get_db)):
    try:
        if Authorization is None:
                raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        content = file.file.read()
        print(file.content_type)
        db.begin()
        current =  db.query(Document).filter(Document.id == id).first()
        if not current:
            raise Exception("Không tồn tại tài liệu")
        if not checkBelongsToUser(user['id'], current.user_id):
            raise Exception("Tài liệu không thuộc quyền sở hữu")
        db.query(Document).filter(Document.id == id).update({"updated_at": mysqlDatetime()})
        check = upload_file(user['id'], f'{current.parent_id}_{file.filename}', content)
        if not check:
            raise Exception("Tải file thất bại")
        delete_query = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "id": id
                            }
                        }
                    ]
                }
            }
        }
        es.delete_by_query(index="document", body=delete_query)
        db.commit()
        bulkInsertDocuments.apply_async((file.filename, user, current.parent_id, 'auto', content, id, current.url), countdown=5)
        return {"success": 1,  "message": "save documents successfully"}
    except Exception as err:
        db.rollback()
        return {"success": 0, "message": str(err)}
