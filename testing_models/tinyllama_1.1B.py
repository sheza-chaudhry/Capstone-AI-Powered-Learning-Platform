from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load model and tokenizer
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

# Set up the tutoring persona
messages = [
    {"role": "system", "content": (
        "You are a friendly math tutor teaching a young student how to do addition. "
        "Always explain clearly, use simple examples, and encourage the student to try problems. "
        "If the student makes a mistake, gently correct them and explain why."
    )},
]

# Start interactive tutoring loop
print("🧮 TinyLlama Math Tutor (type 'quit' to stop)\n")
while True:
    user_input = input("Student: ")
    if user_input.lower().strip() in ["quit", "exit"]:
        print("Tutor: Great job today! See you next time. 👋")
        break

    # Add user input to conversation
    messages.append({"role": "user", "content": user_input})

    # Prepare input for the model
    prompt_text = tokenizer.apply_chat_template(messages, add_generation_prompt=True, tokenize=False)
    inputs = tokenizer(prompt_text, return_tensors="pt").to(model.device)

    # Generate response
    outputs = model.generate(
        **inputs,
        max_new_tokens=180,
        temperature=0.6,
        top_p=0.9,
        repetition_penalty=1.1
    )

    # Decode and display response
    reply = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)
    print(f"Tutor: {reply.strip()}\n")

    # Add model's reply to conversation
    messages.append({"role": "assistant", "content": reply.strip()})
