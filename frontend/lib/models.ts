export const MODEL_STORAGE_KEY = "selectedModelId";
export const DEFAULT_MODEL_ID = "gemma3:4b-it-qat";

export type TutorModel = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  badge: string;
};

export const AVAILABLE_MODELS: TutorModel[] = [
  {
    id: "gemma3:4b-it-qat",
    name: "gemma3:4b-it-qat",
    shortName: "gemma3:4b-it-qat",
    description: "Gemma3 4b quantized",
    badge: "",
  },
  {
    id: "gemma3",
    name: "gemma3",
    shortName: "gemma3",
    description: "Gemma3 4b",
    badge: "",
  },
  {
    id: "gemma3:1b",
    name: "gemma3:1b",
    shortName: "gemma3:1b",
    description: "Gemma3 1b",
    badge: "",
  },
  {
    id: "gemma3:1b-it-qat",
    name: "gemma3:1b-it-qat",
    shortName: "gemma3:1b-it-qat",
    description: "Gemma3 1b quantized",
    badge: "",
  },
  {
    id: "qwen3-1.7-custom",
    name: "qwen3-1.7-custom",
    shortName: "qwen3-1.7-custom",
    description: "Qwen 1.7b quantized",
    badge: "",
  }
];

export function getModelById(id: string) {
  return (
    AVAILABLE_MODELS.find((model) => model.id === id) ??
    AVAILABLE_MODELS.find((model) => model.id === DEFAULT_MODEL_ID) ??
    AVAILABLE_MODELS[0]
  );
}