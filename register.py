import requests

reg_url = "http://4.224.186.213/evaluation-service/register"

payload = {
    "email": "aayushi.srivastava2023@glbajajgroup.org",
    "name": "Aayushi Srivastava",
    "mobileNo": "8896561443",
    "githubUsername": "AayushiSrivastava07",
    "rollNo": "2305111520002",
    "accessCode": "xxkJnk"
}

response = requests.post(reg_url, json=payload)
print(response.status_code)
print(response.json())
