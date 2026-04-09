export const MODEL_STORAGE_KEY = "selectedModelId";
export const DEFAULT_MODEL_ID = "gemma3";

export type TutorModel = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  badge: string;
};

export const AVAILABLE_MODELS: TutorModel[] = [
  {
    id: "gemma3",
    name: "Gemma 3",
    shortName: "Gemma 3",
    description: "A balanced choice for everyday schoolwork, short explanations, and calm study support.",
    badge: "Default",
  },
  {
    id: "qwen:1.8b",
    name: "Qwen 1.8B",
    shortName: "Qwen 1.8B",
    description: "A very lightweight model — great for quick lookups and simple questions on slower hardware.",
    badge: "Lightest",
  },
  {
    id: "llama3.2:3b",
    name: "Llama 3.2 3B",
    shortName: "Llama 3.2",
    description: "Better for step-by-step reasoning, worked examples, and deeper practice questions.",
    badge: "Detailed help",
  },
  {
    id: "deepseek-r1:7b",
    name: "DeepSeek R1 7B",
    shortName: "DeepSeek R1",
    description: "A strong reasoning model — well suited for tricky maths problems and multi-step explanations.",
    badge: "Best reasoning",
  },
];

export function getModelById(id: string) {
  return (
    AVAILABLE_MODELS.find((model) => model.id === id) ??
    AVAILABLE_MODELS.find((model) => model.id === DEFAULT_MODEL_ID) ??
    AVAILABLE_MODELS[0]
  );
}