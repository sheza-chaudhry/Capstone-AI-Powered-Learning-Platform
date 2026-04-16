#!/usr/bin/env python3
"""
Benchmark script to test embedding model speed.
Run this inside the backend container or with Ollama running locally.
"""

import time
import ollama
from app.core.config import settings

# Sample texts to embed (mix of short and long)
SAMPLE_TEXTS = [
    "What is 2 + 2?",
    "Solve for x: 3x + 5 = 17",
    "Explain fractions with an example from daily life in Nepal.",
    "A farmer has 120 rupees and buys 3 kg of rice at 25 rupees per kg. How much change does he get?",
    "Derive the quadratic formula step by step.",
]

def benchmark_model(model_name: str, texts: list[str]) -> float:
    """Embed all texts with the given model and return average time per embedding."""
    client = ollama.Client(host=settings.OLLAMA_HOST)

    # Warm-up (first embed might be slower)
    client.embed(model=model_name, input="warmup text")

    total_time = 0.0
    for text in texts:
        start = time.time()
        response = client.embed(model=model_name, input=text)
        elapsed = time.time() - start
        total_time += elapsed
        print(f"  '{text[:30]}...' -> {len(response['embeddings'][0])} dims in {elapsed:.3f}s")

    avg_time = total_time / len(texts)
    print(f"\n{model_name}: Average {avg_time:.3f}s per embedding\n")
    return avg_time

if __name__ == "__main__":
    models_to_test = ["nomic-embed-text", "snowflake-arctic-embed:22m"]  # Add more as needed

    results = {}
    for model in models_to_test:
        try:
            print(f"Testing {model}...")
            results[model] = benchmark_model(model, SAMPLE_TEXTS)
        except Exception as e:
            print(f"Error with {model}: {e}\n")

    # Summary
    print("=== SUMMARY ===")
    for model, avg_time in results.items():
        print(f"{model}: {avg_time:.3f}s avg")
    if len(results) > 1:
        fastest = min(results, key=results.get)
        slowest = max(results, key=results.get)
        speedup = results[slowest] / results[fastest]
        print(f"\n{fastest} is {speedup:.1f}x faster than {slowest}")
