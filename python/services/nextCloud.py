import owncloud

oc = owncloud.Client('https://cloud.bachnguyencoder.id.vn/')

def upload_file(userId, fileName, content):
  if not oc._session:
    oc.login('kltn1912', 'bach19122002')
  print(f'/Documents/{userId}/{fileName}')
  oc.put_file_contents(f'/Documents/{userId}/{fileName}', content)

def getUrl(path):
  if not oc._session:
    oc.login('kltn1912', 'bach19122002')
  url = oc.share_file_with_link(path).get_link()
  return url.replace('http://', 'https://') + "/download"
