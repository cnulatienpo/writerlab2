import os
import json
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load .env key
load_dotenv()
api_key = os.getenv("DEEPSEEK_API_KEY")

def load_elements():
    path = "elements"
    files = [f for f in os.listdir(path) if f.endswith(".json")]
    elements = []
    for file in files:
        with open(os.path.join(path, file), "r", encoding="utf-8") as f:
            elements.append(json.load(f))
    return elements

def display_element_menu(elements):
    print("\n📘 WRITING ROOM — ELEMENTS\n")
    for i, el in enumerate(elements):
        category = el.get("category", "Uncategorized")
        print(f"{i + 1}. {el['title']}  —  🗂 {category}")
    print("\nType the number of the element you want to explore:")

def choose_prompt(element):
    prompts = element.get("prompts", [])
    if not prompts:
        print("No prompts available.")
        return

    print(f"\n✍️ Prompts for {element['title']}\n")
    for i, prompt in enumerate(prompts):
        print(f"{i + 1}. {prompt['label']}")
        print(f"   {prompt['description']}\n")

    choice = input("Choose a prompt:\n> ")
    if not choice.isdigit() or int(choice) < 1 or int(choice) > len(prompts):
        print("Invalid prompt choice.")
        return

    selected = prompts[int(choice) - 1]
    run_deepseek_prompt(selected)

def run_deepseek_prompt(prompt):
    print("\n🔁 Sending your prompt to DeepSeek...")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": prompt["system"]},
            {"role": "user", "content": prompt["user"]}
        ]
    }

    response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        message = data["choices"][0]["message"]["content"]
        print("\n🧠 DeepSeek's Brainstorm:\n")
        print(message)

        save_choice = input("\n💾 Do you want to save this brainstorm? (y/n): ").strip().lower()
        if save_choice == "y":
            user_input = ""
            write_back = input("✍️ Do you want to add your own writing? (y/n): ").strip().lower()
            if write_back == "y":
                print("\n📝 Type your response below. Press Enter twice to finish.\n")
                lines = []
                while True:
                    line = input()
                    if line.strip() == "":
                        break
                    lines.append(line)
                user_input = "\n".join(lines)
            save_brainstorm(prompt["label"], message, user_input)
    else:
        print(f"Error {response.status_code}:\n{response.text}")

def save_brainstorm(prompt_label, message, player_text=""):
    if not os.path.exists("sessions"):
        os.makedirs("sessions")

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
    safe_label = "".join(c for c in prompt_label if c.isalnum() or c in (" ", "_", "-")).rstrip()
    filename = f"sessions/{timestamp}_{safe_label}.txt"

    with open(filename, "w", encoding="utf-8") as f:
        f.write("🧠 Brainstorm Response\n\n")
        f.write(message)
        if player_text.strip():
            f.write("\n\n✍️ Player Response\n\n")
            f.write(player_text)

    print(f"\n✅ Saved to {filename}")

def display_element(element):
    print(f"\n🧪 {element['title']}")
    print(f"\n🔤 {element['definition']}\n")

    for part in element["lesson_parts"]:
        print(f"📘 {part['title']}\n{part['body']}\n")

    print("\n🕵️‍♀️ How to Spot It In the Wild (Passages):")
    for i, p in enumerate(element["passages"]):
        print(f"\n— Passage {i + 1} ({p['source']}) —")
        print(p["scene"])
        print(f"\nWho wants something? {p['analysis']['who']}")
        print(f"How do we know? {p['analysis']['how_do_we_know']}")
        print(f"Do they say it, show it, or hide it? {p['analysis']['say_show_hide']}")

    choose_prompt(element)

def run():
    elements = load_elements()
    display_element_menu(elements)

    choice = input("> ")
    if choice.isdigit() and 1 <= int(choice) <= len(elements):
        selected = elements[int(choice) - 1]
        display_element(selected)
    else:
        print("❌ Invalid choice.")

if __name__ == "__main__":
    run()
