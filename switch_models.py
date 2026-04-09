import json
import ollama

MODELS = {
    "1": ("gemma3", "Gemma 3 (default)"),
    "2": ("qwen:1.8b", "Qwen 1.7B"),
    "3": ("llama3.2:3b", "Llama 3.2 3B"),
    "4": ("deepseek-r1:7b", "DeepSeek 7B"),
}

def select_model() -> str:
    print("Select a model:")
    for key, (model_id, label) in MODELS.items():
        print(f"  {key}. {label}")
    
    choice = input("\nEnter choice (1-4) [default: 1]: ").strip() or "1"
    
    if choice not in MODELS:
        print(f"Invalid choice '{choice}', defaulting to Gemma 3.")
        choice = "1"
    
    model_id, label = MODELS[choice]
    print(f"\nUsing model: {label} ({model_id})\n")
    return model_id

# Load dataset
def load_dataset(filepath):
    data = []
    with open(filepath) as f:
        for line in f:
            data.append(json.loads(line))
    return data

# Ask model a question
def ask_model(question: str, model: str) -> str:
    response = ollama.chat(
        model=model,
        messages=[{"role": "user", "content": question}]
    )
    return response["message"]["content"]

def get_response(question: str, model: str) -> str:
    return ask_model(question, model)

if __name__ == "__main__":
    selected_model = select_model()
    dataset = load_dataset("grade6_worked_examples.jsonl")
    results = []

    for i, item in enumerate(dataset):
        question = item["question"]
        expected_answer = item.get("answer", "")
        expected_explanation = item.get("explanation", "")

        print(f"\n{'='*60}")
        print(f"Question {i+1}/{len(dataset)}")
        print(f"Q: {question}")
        print(f"Expected Answer: {expected_answer}")

        model_response = get_response(question, selected_model)
        print(f"Model Response: {model_response}")

        results.append({
            "index": i + 1,
            "question": question,
            "expected_answer": expected_answer,
            "expected_explanation": expected_explanation,
            "model_response": model_response,
            "model_used": selected_model      # <-- tracks which model was used
        })

    # Save results filename includes model name for easy comparison
    output_file = f"baseline_results_{selected_model.replace(':', '_')}.json"
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Done! {len(results)} results saved to {output_file}")