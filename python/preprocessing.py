from haystack.nodes import PDFToTextConverter, PreProcessor, TikaConverter, TextConverter
from haystack.document_stores import ElasticsearchDocumentStore
from pathlib import Path
import requests
from tika import parser
from services.nextCloud import getUrl
from const.dateTime import elasticsearchDatetime
from services.googleLens import post_image
import json
# converter = ImageToTextConverter(remove_numeric_tables=True, valid_languages=["eng"])
# ocr = converter.convert(file_path="data/image_ocr.png", meta=None)[0]
# print(ocr)

tika_server_url = 'http://tika:9998/tika'
document_store = ElasticsearchDocumentStore(host="elasticsearch", port=9200, index="document")
endpoint_url = 'https://lens.google.com/v3/upload'

class DataLoader():
  def __init__(self, name, user, parent_id, id, url, method = 'auto'):
        self.method = method
        self.name = name
        self.user = user
        self.parent_id = parent_id
        self.id = id
        self.url = url

  def parse_text_from_pdf(self):
    ocr_option = None
    if self.method == 'ocr':
        ocr_option = 'full'
    elif self.method == 'auto':
        ocr_option = 'auto'
    current_time = elasticsearchDatetime()
    file_path = f"./static/{self.user['id']}/{self.name}"
    print(file_path)
    print(self.method)
    parsed = post_image(file_path, endpoint_url) if self.method == "handWriten" else parser.from_file(filename=file_path, serverEndpoint=tika_server_url)
    document = {"content": parsed['content'],
                "meta": {
                    "url": self.url,
                    "id": self.id,
                    "parent_id": self.parent_id,
                    "marked": 0,
                    "title": self.name,
                    "created_at": current_time, "updated_at": current_time,
                    "author": self.user['username'],
                    "deleted_at": None,
                    "type": "file"
                }}
    print(parsed['content'])
    return document

  def preprocessing(self):
    text = self.parse_text_from_pdf()
    preprocessor = PreProcessor(
        clean_empty_lines=True,
        clean_whitespace=True,
        clean_header_footer=False,
        split_by="word",
        split_length=150,
        split_overlap=30,
        split_respect_sentence_boundary=True,
        id_hash_keys=["content", "meta"]
    )

    result = preprocessor.process([text])
    result[0].content = result[0].content + result[0].meta['title']
    return result

  def storeDocument(self):
    documents = self.preprocessing()
    print(len(documents))
    document_store.write_documents(documents, batch_size=len(documents) / 3)
    return documents

  async def addFolderInfo(self):
      current_time = elasticsearchDatetime()
      document_store.write_documents([{
          'content': self.name,
          'meta': {
            "url": None,
            "id": self.id,
            "parent_id": self.parent_id,
            "marked": 0,
            "title": self.name,
            "created_at": current_time, "updated_at": current_time,
            "author": self.user['username'],
            "deleted_at": None,
            "type": "folder"
          }
      }])
