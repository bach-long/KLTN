import owncloud

oc = owncloud.Client('https://cloud.bachnguyencoder.id.vn/')
oc.login('kltn1912', 'bach19122002')

def upload_file(userId, fileName, content):
  print(f'/Documents/{userId}/{fileName}')
  check = oc.put_file_contents(f'/Documents/{userId}/{fileName}', content)
  return check

def getUrl(path):
  url = oc.share_file_with_link(path).get_link()
  return url.replace('http://', 'https://') + "/download"

def moveFile(userId, oldName, newName):
  print(f'/Documents/{userId}/{oldName}')
  print(f'/Documents/{userId}/{newName}')
  check = oc.move(f'/Documents/{userId}/{oldName}', f'/Documents/{userId}/{newName}')
  return check

def delete(userId, name):
  print(f'/Documents/{userId}/{name}')
  check = oc.delete(f'/Documents/{userId}/{name}')
  return check
