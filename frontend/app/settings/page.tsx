"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import landingImage from "../OLE_Nepal_front_PAGE.png";
import {
  AVAILABLE_MODELS,
  DEFAULT_MODEL_ID,
  MODEL_STORAGE_KEY,
} from "../../lib/models";

export default function SettingsPage() {
  const router = useRouter();
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
    <main
      className="relative min-h-screen overflow-hidden px-3 py-3 md:px-4 md:py-4"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(16, 55, 71, 0.9), rgba(12, 36, 48, 0.62)), url(${landingImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,247,223,0.24),transparent_30%)]" />

      <div className="app-shell relative z-10 mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[30px] border-white/20 bg-[#fff8ec]/86 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <section className="w-full overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[rgba(23,56,69,0.14)] bg-[#103747]/88 px-6 py-6 text-white md:px-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl leading-none">⚙</div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Settings
              </h1>
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-3 rounded-full border border-white/24 bg-white/12 px-7 py-3 text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-white/18"
            >
              <span className="text-3xl leading-none font-bold">×</span>
              <span className="text-xl font-bold leading-none">Close</span>
            </button>
          </header>

          <div className="relative space-y-8 bg-[linear-gradient(180deg,rgba(255,248,236,0.8)_0%,rgba(253,244,227,0.88)_100%)] px-6 py-10 md:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,200,78,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(29,107,99,0.16),transparent_24%)]" />
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="relative z-10 w-full max-w-[180px] pt-3 text-2xl font-bold text-[#173845]">
                Model Choice:
              </div>

              <div className="relative z-10 flex-1 space-y-4">
                {AVAILABLE_MODELS.map((model) => {
                  const isActive = model.id === selectedModelId;

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleModelChange(model.id)}
                      className={`model-option ${isActive ? "model-option-active" : ""}`}
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
