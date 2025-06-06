import os
import requests
from dotenv import load_dotenv
import json

# Load the API key from .env
load_dotenv()
api_key = os.getenv("DEEPSEEK_API_KEY")

# Just testing one prompt for now
system_message = "You are a creative writing coach. You help players brainstorm by asking open-ended questions and suggesting story ideas. You never write for them."
user_message = "The player wants to write a scene about hidden desire but doesn’t know what the character wants yet. Help them brainstorm by asking 2–3 questions and offering ideas for how that desire could be shown indirectly."

# Prepare request
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "deepseek-chat",
    "messages": [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
    ]
}

# Send request to DeepSeek
response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload)

# Handle response
if response.status_code == 200:
    data = response.json()
    message = data["choices"][0]["message"]["content"]
    print("\n🧠 DeepSeek's Brainstorm:\n")
    print(message)
else:
    print(f"Error {response.status_code}:")
    print(response.text)
