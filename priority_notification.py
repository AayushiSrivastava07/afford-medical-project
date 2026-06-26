import requests
from datetime import datetime
import heapq

AUTH_URL = "http://4.224.186.213/evaluation-service/auth"
API_URL = "http://4.224.186.213/evaluation-service/notifications"

auth_payload = {
    "email": "aayushi.srivastava2023@glbajajgroup.org",
    "name": "Aayushi Srivastava",
    "rollNo": "2305111520002",
    "accessCode": "xxkJnk",
    "clientID": "b3b31e11-1ab2-4db3-a261-5c09c0fdd2cd",
    "clientSecret": "kXByFPXvSXEUMQZD"
}

auth_response = requests.post(AUTH_URL, json=auth_payload)
auth_response.raise_for_status()
token = auth_response.json()["access_token"]

headers = {"Authorization": "Bearer " + token}

response = requests.get(API_URL, headers=headers)
response.raise_for_status()
data = response.json()["notifications"]

priority = {"Placement": 3, "Result": 2, "Event": 1}

heap = []
for idx, item in enumerate(data):
    score = priority.get(item["Type"], 0)
    t = datetime.strptime(item["Timestamp"], "%Y-%m-%d %H:%M:%S").timestamp()
    entry = (score, t, idx, item)
    if len(heap) < 10:
        heapq.heappush(heap, entry)
    elif entry > heap[0]:
        heapq.heappushpop(heap, entry)

result = sorted(heap, reverse=True)

with open("output.txt", "w") as f:
    for x in result:
        f.write(str(x[3]) + "\n")

print("DONE - check output.txt")