export const MODEL_STORAGE_KEY = "selectedModelId";
export const DEFAULT_MODEL_ID = "gemma-4b";

export type TutorModel = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  badge: string;
};

export const AVAILABLE_MODELS: TutorModel[] = [
  {
    id: "gemma-4b",
    name: "Gemma 4B Helper",
    shortName: "Gemma 4B",
    description:
      "A balanced choice for everyday schoolwork, short explanations, and calm study support.",
    badge: "Best overall",
  },
  {
    id: "llama-8b",
    name: "Llama 8B Thinker",
    shortName: "Llama 8B",
    description:
      "Better for step-by-step reasoning, worked examples, and deeper practice questions.",
    badge: "Detailed help",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B Quick Help",
    shortName: "Mistral 7B",
    description:
      "Good for fast answers, quick checks, and short revision sessions before class or homework.",
    badge: "Fast replies",
  },
];

export function getModelById(id: string) {
  return (
    AVAILABLE_MODELS.find((model) => model.id === id) ??
    AVAILABLE_MODELS.find((model) => model.id === DEFAULT_MODEL_ID) ??
    AVAILABLE_MODELS[0]
  );
}
