def generateCustomQuery(query, filters, username) :
  custom_query = {
      "size": 50,
      "query": {
          "bool": {
              "should": [
                  {
                      "multi_match": {
                          "query": query,
                          "type": "most_fields",
                          "fields": ["content", "title"]
                      }
                  }
              ],
              "filter": [filters, {"bool": {"must_not": {"exists": {"field": "deleted_at"}}}}, {"term":{"author": username}}, {"term": {"type": "file"}}] if filters
              else [{"bool": {"must_not": {"exists": {"field": "deleted_at"}}}}, {"term":{"author": username}}, {"term": {"type": "file"}}]
          }
      },
      "sort": [
          { "_score": { "order": "desc" } },
          { "updated_at": { "order": "desc" } }
      ],
      "collapse": {
          "field": "id"
      }
  }
  print(custom_query)
  return custom_query
