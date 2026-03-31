"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AVAILABLE_MODELS,
  DEFAULT_MODEL_ID,
  MODEL_STORAGE_KEY,
} from "../../lib/models";

export default function SettingsPage() {
  const [selectedModelId, setSelectedModelId] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_MODEL_ID;
    }

    return window.localStorage.getItem(MODEL_STORAGE_KEY) ?? DEFAULT_MODEL_ID;
  });

  function handleModelChange(modelId: string) {
    setSelectedModelId(modelId);
    window.localStorage.setItem(MODEL_STORAGE_KEY, modelId);
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] p-4 md:p-8">
      <div className="app-shell mx-auto flex min-h-[calc(60vh-2rem)] max-w-7xl overflow-hidden rounded-[28px] md:min-h-[calc(100vh-3rem)]">

        <section className="settings-card overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--ink)] px-6 py-6 md:px-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl leading-none">⚙</div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Settings
              </h1>
            </div>

            <Link href="/" className="close-button px-8 py-4 text-2xl font-bold">
              <span className="text-4xl leading-none">×</span>
              <span className="text-xl">Close</span>
            </Link>
          </header>

          <div className="space-y-8 px-6 py-10 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="w-full max-w-[180px] pt-3 text-2xl font-bold">
                Model Choice:
              </div>

              <div className="flex-1 space-y-4">
                {AVAILABLE_MODELS.map((model) => {
                  const isActive = model.id === selectedModelId;

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleModelChange(model.id)}
                      className={`model-option ${
                        isActive ? "model-option-active" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl leading-none">▼</span>
                          <div>
                            <div className="text-2xl font-extrabold">
                              {model.name}
                            </div>
                            <div className="mt-1 text-sm text-black/65">
                              {model.description}
                            </div>
                          </div>
                        </div>

                        <span className="rounded-full border border-black/15 bg-white/70 px-3 py-1 text-sm font-semibold">
                          {model.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
