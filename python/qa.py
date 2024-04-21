from haystack.utils import print_answers
import json

custom_query = '''{"query": {
                    "bool": {
                        "must": [
                            {"bool": {
                                "should": [
                                    {
                                        "multi_match": {
                                            "query": {query},
                                            "type": "most_fields",
                                            "fields": ["content", "title"]
                                        }
                                    }
                                ]
                            }
                        }],
                        "filter": [{filters}, {"bool": {"must_not": {"exists": {"field": "deleted_at"}}}}]
                    }
                }, "sort": [
                    { "_score": { "order": "desc" }},
                    { "updated_at": { "order": "desc" }}
                ], "collapse": {
                    "field": "id"
                }
            }'''

class QA():
  def __init__(self, query, filter, customQuery = None):
        self.query = query
        self.filter = filter
        self.customQuery = customQuery

  def generateAnswer(self):
      print(self.filter)
      prediction = querying_pipeline.run(query=self.query, params={"Retriever": {"filters": self.filter, "top_k": 20}})
      return prediction
