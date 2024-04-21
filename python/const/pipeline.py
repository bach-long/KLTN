from haystack.nodes import BM25Retriever
from preprocessing import document_store
from haystack.nodes import FARMReader
from haystack import Pipeline
def generateCustomQuery(custom_query) :
  retriever = BM25Retriever(document_store=document_store,
                          scale_score=True,
                          custom_query=custom_query)
  reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=True, num_processes=1)

  querying_pipeline = Pipeline()
  querying_pipeline.add_node(component=retriever, name="Retriever", inputs=["Query"])
  querying_pipeline.add_node(component=reader, name="Reader", inputs=["Retriever"])

  return querying_pipeline
