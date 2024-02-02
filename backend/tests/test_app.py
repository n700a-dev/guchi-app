from fastapi.testclient import TestClient
import json
from main import app

client = TestClient(app)  # appはgraphqlのrouteを含めているapp object

query = """
mutation ($name: String!, $age: Int!){
  addUser(name: $name, age: $age) {
  	__typename
  	name
    age
	}
}
"""
variables = {"name": "Bob", "age": 10}


# https://testdriven.io/blog/fastapi-graphql/
# https://www.magata.net/memo/index.php?pytest%C6%FE%CC%E7#y2046859
def test_add_user():
    response = client.post("/graphql", json={"query": query, "variables": variables})
    result = response.json()

    assert response.status_code == 200
    assert result["data"]["addUser"]["name"] == "Bob"
    assert result["data"]["addUser"]["age"] == 10
