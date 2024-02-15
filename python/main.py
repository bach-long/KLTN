from preprocessing import DataLoader
from qa import QA
from fastapi import FastAPI, HTTPException, status, Header, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import Annotated
from jose import JWTError, jwt
from typing import Union
import os.path
from services.storage import upload_file, list_folder_contents, cors_configuration, bucket_metadata;
from services.handWrittenRecognization import detect_document;
from dotenv import load_dotenv;
import os

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

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
HASH_ALGORITHM = os.getenv('HASH_ALGORITHM')
BUCKET_NAME = os.getenv('BUCKET_NAME')
print(BUCKET_NAME)

cors_configuration(BUCKET_NAME)

bucket_metadata(BUCKET_NAME)

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
async def store_document(file: UploadFile = File('file'), Authorization: str = Header("Authorization"), method: str = 'auto'):
  if Authorization is None:
      raise credentials_exception
  token = Authorization.split(' ')[1]
  user = await get_current_user(token)
  print(file.content_type)
  data_storage = DataLoader(file.filename, user, method)
  upload_file('kltn-1912', file.file.read(), file.content_type ,file.filename)
  await file.close()
  result = data_storage.storeDocument()
  return {"success": 1, "data": result, "message": "search successfully"}

@app.get('/api/documents')
async def myDocuments(Authorization: str = Header("Authorization")):
    try:
        if Authorization is None:
            raise credentials_exception
        token = Authorization.split(' ')[1]
        user = await get_current_user(token)
        print(user)
        result = list_folder_contents(BUCKET_NAME, f'{user["id"]}/')
        return {"success": 1, "data": result, "message": "get documents successfully"}
    except Exception as err:
        return {"success": 0, "data": result, "message": str(err)}
