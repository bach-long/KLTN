from haystack.nodes import BM25Retriever
from preprocessing import document_store
from haystack.nodes import FARMReader
from haystack import Pipeline
from haystack.utils import print_answers
import json

custom_query = '''{"size": 1,
                "query": {
                    "bool": {
                        "should": [
                            {"multi_match": {
                                "query": ${query},
                                "type": "most_fields",
                                "fields": ["content", "title"]
                            }
                        }],
                        "filter": ${filters}
                    }
                },
                "sort": [
                    { "_score": { "order": "desc" }},
                    { "created_at": { "order": "desc" }}
                ],
                "collapse": {
                    "field": "link"
                }}'''
retriever = BM25Retriever(document_store=document_store,
                          scale_score=True,
                          custom_query=custom_query)
reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=True, num_processes=1)

querying_pipeline = Pipeline()
querying_pipeline.add_node(component=retriever, name="Retriever", inputs=["Query"])
querying_pipeline.add_node(component=reader, name="Reader", inputs=["Retriever"])

class QA():
  def __init__(self, query, filter):
        self.query = query
        self.filter = filter

  def generateAnswer(self):
      print(self.filter)
      prediction = querying_pipeline.run(query=self.query, params={"Retriever": {"filters": self.filter, "top_k": 100}})
      return prediction
