import owncloud

oc = owncloud.Client('https://cloud.bachnguyencoder.id.vn/')
oc.login('kltn1912', 'bach19122002')
# oc.login('kltn1912test', 'test19122002')

def upload_file(userId, fileName, content):
  print(f'/Documents/{userId}/{fileName}')
  check = oc.put_file_contents(f'/Documents/{userId}/{fileName}', content)
  return check

def createFolder(userId, folderId):
  check = oc.mkdir(f'/Documents/{userId}/{folderId}/')
  return check

def getUrl(path):
  url = oc.share_file_with_link(path)
  print(url)
  return url.get_link().replace('http://', 'https://') + "/download"

def moveFile(userId, oldName, newName):
  print(f'/Documents/{userId}/{oldName}')
  print(f'/Documents/{userId}/{newName}')
  check = oc.move(f'/Documents/{userId}/{oldName}', f'/Documents/{userId}/{newName}')
  return check

def delete(userId, name, childFolders = None):
  print(f'/Documents/{userId}/{name}')
  check = False
  if childFolders is not None and len(childFolders) > 0:
    for folder in childFolders:
      check = oc.delete(f'/Documents/{userId}/{folder}')
  else:
    check = oc.delete(f'/Documents/{userId}/{name}')
  return check

def checkExist(userId, name):
  try:
    print("check exists")
    info = oc.file_info(f'/Documents/{userId}/{name}')
    return info is not None
  except Exception as e:
    print("ngoại lệ check file")
    print("Error:", e)
    return False
