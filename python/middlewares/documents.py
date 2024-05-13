from services.nextCloud import checkExist
from database.models import Document

def checkBelongsToUser(userId, documentUserId):
  return userId == documentUserId

def checkExistDocument(userId, name):
  return checkExist(userId, name)

def checkExistFolder(db, parent_id, name):
  return db.query(Document).filter(Document.parent_id == parent_id).filter(Document.name == name).first() is not None

def checkNotDelete(data):
  return data.deleted_at is None
