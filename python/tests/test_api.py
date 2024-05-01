from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from main import app
from database.config import get_db
from fastapi.testclient import TestClient
import pytest
from const.environment import changeToTest
from database.models import User, Document
from const.dateTime import mysqlDatetime
from dotenv import load_dotenv
from jose import jwt
from database.config import Base
import os
from httpx import AsyncClient

load_dotenv()

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
HASH_ALGORITHM = os.getenv('HASH_ALGORITHM')

mysqlConnection = f"mysql+mysqlconnector://root:bach1912@mysql-db:3306/kltn_test"

engine = create_engine(mysqlConnection)

Conn = engine.connect()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

client = TestClient(app)

encodeData = {
    "username": "bachtest",
    "password": "12345678",
    "email": "1234@gmail.com",
    "activated_at": mysqlDatetime(),
    "active_sent_at": mysqlDatetime(),
}

def getRandomUser(id):
    user = User(
        id = id,
        username = "bachtest",
        password = "12345678",
        email = "1234@gmail.com",
        activated_at = mysqlDatetime(),
        active_sent_at = mysqlDatetime()
    )
    return user

def getRandomDocument(id, docType, user_id, parent_id):
    document = Document(
        id = id,
        parent_id = parent_id,
        name = f"{parent_id}_document",
        type = docType,
        user_id = user_id,
        url = "abcdefgh" if docType == "file" else None
    )
    return document

changeToTest()

def get_test_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def setup() -> None:
    # Create the tables in the test database
    Base.metadata.create_all(bind=engine)

def teardown() -> None:
    # Drop the tables in the test database
    Base.metadata.drop_all(bind=engine)

def truncate() -> None:
    Conn.execute("DELETE FROM users;")
    Conn.execute("DELETE FROM documents;")

app.dependency_overrides[get_db] = get_test_db

setup()

def test_store_document_fail_authentication():
    # Assume valid credentials
    db = SessionLocal()
    headers = {"Authorization": None}
    data = {"parent_id": 1, "type": "file", "method": "auto"}
    files = {"file": ("test.txt", "file content")}
    response = client.post("/api/store", headers=headers, data=data, files=files)
    truncate()
    assert response.json()['success'] == 0

def test_store_document_fail_no_file():
    # Assume valid credentials
    user = getRandomUser(1)
    db = SessionLocal()
    db.begin()
    db.add(user)
    db.commit()
    insertedUser = db.query(User.id, User.username, User.activated_at).filter(User.username == user.username).first()
    user_dict = {
        'id': insertedUser[0],
        'username': insertedUser[1],
        'activated_at': insertedUser[2].strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(user_dict)
    token = jwt.encode(user_dict, ACCESS_TOKEN_SECRET, algorithm=HASH_ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}
    data = {"parent_id": None, "type": "file", "method": "auto"}
    files = {"file": None}
    response = client.post("/api/store", headers=headers, data=data, files=files)
    print(response.json())
    db.close()
    truncate()
    assert response.json()['success'] == 0

def test_store_document_fail_no_attribute():
    # Assume valid credentials
    user = getRandomUser(1)
    db = SessionLocal()
    db.begin()
    db.add(user)
    db.commit()
    insertedUser = db.query(User.id, User.username, User.activated_at).filter(User.username == user.username).first()
    user_dict = {
        'id': insertedUser[0],
        'username': insertedUser[1],
        'activated_at': insertedUser[2].strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(user_dict)
    token = jwt.encode(user_dict, ACCESS_TOKEN_SECRET, algorithm=HASH_ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}
    data = {"parent_id": None, "method": "auto"}
    files = {"file": None}
    response = client.post("/api/store", headers=headers, data=data, files=files)
    db.close()
    print(response.json())
    truncate()
    assert response.status_code != 200

def test_get_all_documents_success():
    user = getRandomUser(1)
    db = SessionLocal()
    db.begin()
    db.add(user)
    db.commit()

    db.begin()
    db.bulk_save_objects([getRandomDocument(1, "folder", 1, None), getRandomDocument(2, 'file', 1, 1), getRandomDocument(3, 'file', 1, 1)])
    db.commit()
    insertedUser = db.query(User.id, User.username, User.activated_at).filter(User.username == user.username).first()
    user_dict = {
        'id': insertedUser[0],
        'username': insertedUser[1],
        'activated_at': insertedUser[2].strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(user_dict)
    token = jwt.encode(user_dict, ACCESS_TOKEN_SECRET, algorithm=HASH_ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/documents", headers=headers)
    db.close()
    print(response.json())
    truncate()
    realData = response.json()
    assert realData['success'] == 1
    assert isinstance(realData['data'], dict)
    assert len(realData['data']['folders']) == 1
    assert len(realData['data']['files']) == 0

def test_get_all_documents_success_with_parent():
    user = getRandomUser(1)
    db = SessionLocal()
    db.begin()
    db.add(user)
    db.commit()

    db.begin()
    db.bulk_save_objects([getRandomDocument(1, "folder", 1, None), getRandomDocument(2, 'file', 1, 1), getRandomDocument(3, 'file', 1, 1)])
    db.commit()
    insertedUser = db.query(User.id, User.username, User.activated_at).filter(User.username == user.username).first()
    user_dict = {
        'id': insertedUser[0],
        'username': insertedUser[1],
        'activated_at': insertedUser[2].strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(user_dict)
    token = jwt.encode(user_dict, ACCESS_TOKEN_SECRET, algorithm=HASH_ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/documents?parent_id=1", headers=headers)
    db.close()
    print(response.json())
    truncate()
    realData = response.json()
    assert realData['success'] == 1
    assert isinstance(realData['data'], dict)
    assert len(realData['data']['folders']) == 0
    assert len(realData['data']['files']) == 2

def test_get_all_documents_success_with_type():
    user = getRandomUser(1)
    db = SessionLocal()
    db.begin()
    db.add(user)
    db.commit()

    db.begin()
    db.bulk_save_objects([getRandomDocument(1, "folder", 1, None), getRandomDocument(2, 'file', 1, 1), getRandomDocument(3, 'file', 1, 1)])
    db.commit()
    insertedUser = db.query(User.id, User.username, User.activated_at).filter(User.username == user.username).first()
    user_dict = {
        'id': insertedUser[0],
        'username': insertedUser[1],
        'activated_at': insertedUser[2].strftime('%Y-%m-%d %H:%M:%S'),
    }
    print(user_dict)
    token = jwt.encode(user_dict, ACCESS_TOKEN_SECRET, algorithm=HASH_ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/documents?parent_id=1&type=1", headers=headers)
    db.close()
    print(response.json())
    truncate()
    realData = response.json()
    assert realData['success'] == 1
    assert isinstance(realData['data'], dict)
    assert len(realData['data']['folders']) == 0
    assert len(realData['data']['files']) == 0
