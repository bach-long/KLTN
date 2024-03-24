from preprocessing import DataLoader
from qa import QA
from typing import Optional
from fastapi import Body, FastAPI, HTTPException, status, Header, File, UploadFile, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from database.config import get_db
from sqlalchemy.orm import Session
from database.models import User, Document
import os.path
from services.nextCloud import upload_file, getUrl
from services.handWrittenRecognization import detect_document;
from dotenv import load_dotenv;
import os
import tensorflow as tf
from jobs.handleWriteDocument import bulkInsertDocuments
from sqlalchemy import text

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
        if user is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    return user


@app.get('/api/search')
async def search_document(Authorization: str = Header("Authorization"), page: int = 1, per_page: int = 20, query: str = '', filter: dict = {}):
  if Authorization is None:
      raise credentials_exception
  token = Authorization.split(' ')[1]
  user = await get_current_user(token)
  search = QA(query, {"author": user['username']})
  answer = search.generateAnswer()
  return {"success": 1, "data": answer, "message": "search successfully"}

@app.post('/api/store')
async def store_document(parent_id = Body(None),
                         type = Body(None),
                         folder_name = Body(None),
                         file: UploadFile = File('file'),
                         Authorization: str = Header("Authorization"),
                         method: str = 'auto',
                         db: Session = Depends(get_db)):
  if Authorization is None:
      raise credentials_exception
  token = Authorization.split(' ')[1]
  user = await get_current_user(token)

  if type == 'file':
    content = file.file.read()
    print('start upload')
    upload_file(user['id'], f'{parent_id}_{file.filename}', content)
    print("upload xong")
    url = getUrl(f"/Documents/{user['id']}/{parent_id}_{file.filename}")
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
    data_storage = DataLoader(folder_name, user, parent_id, method)
    result = await data_storage.addFolderInfo()
    document = Document(name=folder_name, type="folder", user_id=user["id"], parent_id=parent_id)
    db.add(document)
    db.commit()
    db.refresh(document)
  return {"success": 1, "message": "create successfully"}

@app.get('/api/documents')
async def myDocuments(Authorization: str = Header("Authorization"), db: Session = Depends(get_db), parent_id = None, marked = None, deleted = None):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        print(not parent_id)
        documents = None
        query = db.query(Document).filter(Document.user_id == user['id']).order_by(Document.updated_at.desc())
        if parent_id:
            query = query \
                .filter(Document.parent_id == parent_id)
        elif not marked and not deleted:
            query = query \
                .filter(Document.parent_id.is_(None))
        if marked and not parent_id:
            query = query.filter(Document.marked)
        if deleted and not parent_id:
            query = query.filter(Document.deleted_at.isnot(None))
        documents = query
        folders = [doc for doc in documents if doc.type == 'folder']
        files = [doc for doc in documents if doc.type == 'file']

        result = {"folders": folders, "files": files}
        print(len(result["folders"]))
        return {"success": 1, "data": result, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}

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
        print(documents)
        return {"success": 1, "data": documents, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}
