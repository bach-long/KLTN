from haystack.nodes import PDFToTextConverter, PreProcessor
from haystack.document_stores import ElasticsearchDocumentStore
from datetime import datetime

# converter = ImageToTextConverter(remove_numeric_tables=True, valid_languages=["eng"])
# ocr = converter.convert(file_path="data/image_ocr.png", meta=None)[0]
# print(ocr)

document_store = ElasticsearchDocumentStore(host="localhost", port=9200, index="document")

class DataLoader():
  def __init__(self, filename, user, method = 'auto'):
        self.method = method
        self.filename = filename
        self.user = user

  def parse_text_from_pdf(self):
      ocr_option = None
      if self.method == 'ocr':
          ocr_option = 'full'
      elif self.method == 'auto':
          ocr_option = 'auto'

      converter = PDFToTextConverter(remove_numeric_tables=True, valid_languages=["en","vie"], ocr=ocr_option, ocr_language="eng+vie")
      doc_pdf = converter.convert('./static/' + self.filename, meta=None)[0]
      return doc_pdf

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
      )

      result = preprocessor.process([text])
      return result

  def storeDocument(self):
      documents = self.preprocessing()
      current_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
      for doc in documents:
          doc.content = f"author: {self.user['username']}\n" + doc.content
          doc.meta = {"link": self.filename, "title": self.filename, "created_at": current_time, "updated_at": current_time, "author": self.user['username']}
      document_store.write_documents(documents)
      return documents
