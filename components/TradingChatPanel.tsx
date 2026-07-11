"use client";

import { useMemo, useState } from "react";

import { answerTradingQuestion } from "@/services/tradingChat";
import type { SymbolAnalysis } from "@/services/analyzeSymbol";

type Props = {
  analysis: SymbolAnalysis;
};

export default function TradingChatPanel({
  analysis,
}: Props) {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] =
    useState("");

  const response = useMemo(() => {
    if (!submittedQuestion.trim()) {
      return null;
    }

    return answerTradingQuestion(
      submittedQuestion,
      analysis
    );
  }, [submittedQuestion, analysis]);

  function askQuestion() {
    if (!question.trim()) {
      return;
    }

    setSubmittedQuestion(question);
    setQuestion("");
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">
      <h3 className="text-xl font-semibold">
        🤖 AI Trading Coach
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Ask questions about the current setup.
      </p>

      <div className="mt-5 flex gap-3">
        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Analyze this trade..."
          className="flex-1 rounded-lg bg-slate-900 px-4 py-3 outline-none"
        />

        <button
          onClick={askQuestion}
          className="rounded-lg bg-sky-600 px-5 font-semibold"
        >
          Ask
        </button>
      </div>

      {response && (
        <div className="mt-6 rounded-lg bg-slate-900 p-5">
          <p className="font-semibold">
            {response.question}
          </p>

          <p className="mt-3 text-slate-300">
            {response.answer}
          </p>
        </div>
      )}
    </div>
  );
}
