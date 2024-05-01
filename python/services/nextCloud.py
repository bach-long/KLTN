import owncloud
from const.environment import returnEnvironment

oc = owncloud.Client('https://cloud.bachnguyencoder.id.vn/')
env = returnEnvironment()
if env == "dev":
  oc.login('kltn1912', 'bach19122002')
elif env == "test":
  oc.login('kltn1912test', 'test19122002')

def upload_file(userId, fileName, content):
  print(f'/Documents/{userId}/{fileName}')
  check = oc.put_file_contents(f'/Documents/{userId}/{fileName}', content)
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

def delete(userId, name):
  print(f'/Documents/{userId}/{name}')
  check = oc.delete(f'/Documents/{userId}/{name}')
  return check
