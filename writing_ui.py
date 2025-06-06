import os
import json
import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("DEEPSEEK_API_KEY")

# Load element files
def load_elements():
    path = "elements"
    files = [f for f in os.listdir(path) if f.endswith(".json")]
    elements = []
    for file in files:
        with open(os.path.join(path, file), "r", encoding="utf-8") as f:
            elements.append(json.load(f))
    return elements

elements = load_elements()

# Build the UI
root = tk.Tk()
root.title("Writing Room")

# Frames
top_frame = ttk.Frame(root, padding="10")
top_frame.pack(fill="x")

middle_frame = ttk.Frame(root, padding="10")
middle_frame.pack(fill="both", expand=True)

bottom_frame = ttk.Frame(root, padding="10")
bottom_frame.pack(fill="x")

# Dropdown to choose element
element_var = tk.StringVar()
element_dropdown = ttk.Combobox(top_frame, textvariable=element_var, state="readonly")
element_dropdown["values"] = [el["title"] for el in elements]
element_dropdown.grid(row=0, column=0, padx=5)
element_dropdown.set("Select an Element")

lesson_text = tk.Text(middle_frame, wrap="word", height=20)
lesson_text.pack(fill="both", expand=True)

# Prompt selector
prompt_var = tk.StringVar()
prompt_dropdown = ttk.Combobox(bottom_frame, textvariable=prompt_var, state="readonly", width=50)
prompt_dropdown.grid(row=0, column=0, padx=5)

def display_element(event=None):
    lesson_text.delete(1.0, tk.END)
    selected_title = element_var.get()
    selected = next((el for el in elements if el["title"] == selected_title), None)
    if not selected:
        return

    lesson_text.insert(tk.END, f"{selected['title']} — {selected['definition']}\n\n")

    for part in selected["lesson_parts"]:
        lesson_text.insert(tk.END, f"📘 {part['title']}\n{part['body']}\n\n")

    lesson_text.insert(tk.END, "🕵️‍♀️ How to Spot It In the Wild:\n")
    for p in selected["passages"]:
        lesson_text.insert(tk.END, f"\n— {p['source']} —\n{p['scene']}\n")
        lesson_text.insert(tk.END, f"Who wants something? {p['analysis']['who']}\n")
        lesson_text.insert(tk.END, f"How do we know? {p['analysis']['how_do_we_know']}\n")
        lesson_text.insert(tk.END, f"Do they say it, show it, or hide it? {p['analysis']['say_show_hide']}\n")

    # Load prompts into dropdown
    prompt_list = [p["label"] for p in selected["prompts"]]
    prompt_dropdown["values"] = prompt_list
    prompt_dropdown.set("Choose a Prompt")

element_dropdown.bind("<<ComboboxSelected>>", display_element)

# AI Response + writing box
output_box = tk.Text(root, wrap="word", height=10)
output_box.pack(fill="both", expand=True, padx=10, pady=(0, 10))
output_box.insert(tk.END, "🧠 DeepSeek response will show here.\n\n✍️ Your writing can go below that.\n")

# Run prompt + get AI brainstorm
def run_prompt():
    element_title = element_var.get()
    prompt_label = prompt_var.get()

    el = next((e for e in elements if e["title"] == element_title), None)
    if not el:
        messagebox.showerror("Error", "Select an element first.")
        return

    prompt = next((p for p in el["prompts"] if p["label"] == prompt_label), None)
    if not prompt:
        messagebox.showerror("Error", "Choose a prompt.")
        return

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

    output_box.delete(1.0, tk.END)
    output_box.insert(tk.END, "Thinking...\n")

    try:
        response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()["choices"][0]["message"]["content"]
            output_box.delete(1.0, tk.END)
            output_box.insert(tk.END, "🧠 DeepSeek's Brainstorm:\n\n" + result + "\n\n✍️ Your Writing:\n\n")
        else:
            output_box.delete(1.0, tk.END)
            output_box.insert(tk.END, f"Error: {response.status_code}\n{response.text}")
    except Exception as e:
        output_box.delete(1.0, tk.END)
        output_box.insert(tk.END, f"Failed to connect:\n{e}")

# Save brainstorm + writing
def save_all():
    brainstorm_text = output_box.get("1.0", tk.END).strip()
    if not brainstorm_text:
        messagebox.showinfo("Empty", "Nothing to save yet.")
        return

    element = element_var.get()
    prompt = prompt_var.get()
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
    safe_label = "".join(c for c in prompt if c.isalnum() or c in (" ", "_", "-")).rstrip()

    if not os.path.exists("sessions"):
        os.makedirs("sessions")

    filename = f"sessions/{timestamp}_{safe_label}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"{element} — {prompt}\n\n")
        f.write(brainstorm_text)

    messagebox.showinfo("Saved", f"Saved to {filename}")

# Buttons
run_button = ttk.Button(bottom_frame, text="Generate Brainstorm", command=run_prompt)
run_button.grid(row=0, column=1, padx=5)

save_button = ttk.Button(bottom_frame, text="Save Session", command=save_all)
save_button.grid(row=0, column=2, padx=5)

# Start the loop
root.mainloop()
