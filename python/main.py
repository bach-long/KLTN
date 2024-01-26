from preprocessing import DataLoader
from qa import QA
from fastapi import FastAPI, HTTPException, status, Header, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import Annotated
from jose import JWTError, jwt
from typing import Union
import os.path
from services.storage import upload_file;

# dataLoader = DataLoader('auto', 'image_based.pdf', "thử ocr trên pdf")
# document = dataLoader.storeDocument()

# pprint(answer)
app = FastAPI(debug=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ACCESS_TOKEN_SECRET="kltn_secret_token"
ALGORITHM = "HS256"

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail={"success": 0, "message": "Could not validate credentials"},
    headers={"Authorization": "Bearer"},
)

async def get_current_user(token):
    try:
        user = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=[ALGORITHM])
        if user is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    return user



@app.get('/api/search')
async def search_document(Authorization: str = Header("Authorization"), page: int = 1, per_page: int = 20, query: str = '', filter: dict = {}):
  if Authorization is None:
      raise credentials_exception
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
  static_folder = "static"
  os.makedirs(static_folder, exist_ok=True)
  destination_path = os.path.join(static_folder, file.filename)
  if not os.path.exists(destination_path):
      with open(destination_path, "wb") as dest_file:
         dest_file.write(file.file.read())
  data_storage = DataLoader(file.filename, user, method)
  upload_file('kltn-1912', file.file.read(), file.content_type ,file.filename)
  await file.close()
  result = data_storage.storeDocument()
  return {"success": 1, "data": result, "message": "search successfully"}
