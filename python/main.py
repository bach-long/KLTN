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
from services.storage import upload_file, list_folder_contents, cors_configuration, bucket_metadata;
from services.handWrittenRecognization import detect_document;
from dotenv import load_dotenv;
import os
import tensorflow as tf

# dataLoader = DataLoader('auto', 'image_based.pdf', "thử ocr trên pdf")
# document = dataLoader.storeDocument()

# pprint(answer)
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
BUCKET_NAME = os.getenv('BUCKET_NAME')

cors_configuration(BUCKET_NAME)

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
  search = QA(query, filter)
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
    os.makedirs("static", exist_ok=True)
    destination_path = os.path.join("static", file.filename)
    content = file.file.read()
    if not os.path.exists(destination_path):
        with open(destination_path, "wb") as dest_file:
            dest_file.write(content)
    data_storage = DataLoader(file.filename, user, parent_id, method)
    upload_file('kltn-1912', content, file.content_type ,f'{user["id"]}/{parent_id}_{file.filename}')
    result = await data_storage.storeDocument()
    document = Document(name=file.filename, type="file", user_id=user["id"], parent_id=parent_id, url=f'https://storage.googleapis.com/{BUCKET_NAME}/{user["id"]}/{parent_id}_{file.filename}')
    db.add(document)
    db.commit()
    db.refresh(document)
    await file.close()
    os.remove(destination_path)
  elif type == 'folder':
    data_storage = DataLoader(folder_name, user, parent_id, method)
    result = await data_storage.addFolderInfo()
    document = Document(name=folder_name, type="folder", user_id=user["id"])
    db.add(document)
    db.commit()
    db.refresh(document)

  return {"success": 1, "message": "create successfully"}

@app.get('/api/documents')
async def myDocuments(Authorization: str = Header("Authorization"), db: Session = Depends(get_db), parent_id = None):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        print(user)
        documents = None
        if parent_id:
            documents = db.query(Document).filter(Document.parent_id == parent_id).order_by(Document.updated_at.desc()).all()
        else:
            documents = db.query(Document).filter(Document.parent_id.is_(None)).order_by(Document.updated_at.desc()).all()
        folders = [doc for doc in documents if doc.type == 'folder']
        files = [doc for doc in documents if doc.type == 'file']

        result = {"folders": folders, "files": files}
        return {"success": 1, "data": result, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "message": str(err)}
