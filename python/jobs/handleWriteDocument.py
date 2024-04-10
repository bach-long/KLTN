from celery import Celery
from preprocessing import DataLoader
import os
import shutil

app = Celery('jobs', broker='redis://localhost:6379/0', include=['jobs.handleWriteDocument'])

@app.task
def bulkInsertDocuments(filename, user, parent_id, method, content, id, url):
  try:
    path = f"static/{user['id']}/"
    os.makedirs(path, exist_ok=True)
    destination_path = os.path.join(path, filename)
    if not os.path.exists(destination_path):
      with open(destination_path, "wb") as dest_file:
        dest_file.write(content)
    dataStorage = DataLoader(filename, user, parent_id, id, url, method)
    dataStorage.storeDocument()
  finally:
    print("done")
    shutil.rmtree(path)
