import requests

auth_url = "http://4.224.186.213/evaluation-service/auth"

payload = {
    "email": "aayushi.srivastava2023@glbajajgroup.org",
    "name": "Aayushi Srivastava",
    "rollNo": "2305111520002",
    "accessCode": "xxkJnk",
    "clientID": "b3b31e11-1ab2-4db3-a261-5c09c0fdd2cd",
    "clientSecret": "kXByFPXvSXEUMQZD"
}

response = requests.post(auth_url, json=payload)
print(response.status_code)
data = response.json()
print(data)


with open("token.txt", "w") as f:
    f.write(data["access_token"])

print("\nToken saved: token.txt")