from celery import Celery
from preprocessing import DataLoader
import os

app = Celery('jobs', broker='redis://localhost:6379/0', include=['jobs.handleWriteDocument'])

@app.task
def bulkInsertDocuments(filename, user, parent_id, method, content):
  try:
    os.makedirs("static", exist_ok=True)
    destination_path = os.path.join("static", filename)
    if not os.path.exists(destination_path):
      with open(destination_path, "wb") as dest_file:
        dest_file.write(content)
    dataStorage = DataLoader(filename, user, parent_id, method)
    dataStorage.storeDocument()
  finally:
    os.remove(destination_path)
