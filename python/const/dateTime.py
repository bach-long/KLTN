from datetime import datetime

def mysqlDatetime() :
  return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
def elasticsearchDatetime() :
  return datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
