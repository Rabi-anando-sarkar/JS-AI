import { useRef, useState } from "react";

// Read from .env — VITE_API_BASE_URL=http://localhost:8000/api/v1
// Vite only exposes vars prefixed with VITE_, and only via import.meta.env.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = `${API_BASE_URL}/chat/chats`;

// USD per 1M tokens. Fill in the real model ids your backend uses
// (the ones you pass as MODELS_SOL.MODEL_A / MODEL_B / MODEL_C / JUDGE_MODEL).
const PRICING = {
  "gpt-5.6-sol": { input: 5.0, output: 30.0 },
  "gpt-5.6-terra": { input: 2.5, output: 15.0 },
  "gpt-5.6-luna": { input: 1.0, output: 6.0 },
  // add more as needed — unknown ids fall back to null cost below
};

function costFor(modelId, usage) {
  const rate = PRICING[modelId];
  if (!rate || !usage) return null;
  const inTok = usage.input_tokens ?? 0;
  const outTok = usage.output_tokens ?? 0;
  return (inTok * rate.input) / 1e6 + (outTok * rate.output) / 1e6;
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | streaming | done | error
  const [meta, setMeta] = useState(null); // { candidates, usage }
  const [errorMsg, setErrorMsg] = useState("");
  const abortRef = useRef(null);

  async function runQuery(e) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || status === "streaming") return;

    setAnswer("");
    setMeta(null);
    setErrorMsg("");
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by a blank line.
        const events = buffer.split("\n\n");
        buffer = events.pop(); // last chunk may be incomplete, keep it for next read

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;

          const jsonStr = line.slice(5).trim();
          let payload;
          try {
            payload = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          if (payload.type === "chunk") {
            setAnswer((prev) => prev + payload.content);
          } else if (payload.type === "done") {
            setMeta({ candidates: payload.candidates, usage: payload.usage });
          }
        }
      }

      setStatus("done");
    } catch (err) {
      if (err.name === "AbortError") return;
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      runQuery(e);
    }
  }

  const isStreaming = status === "streaming";

  return (
    <div className="page">
      <div className="window">
        <div className="titlebar">
          <span className="dot dot-red" />
          <span className="dot dot-amber" />
          <span className="dot dot-green" />
          <span className="titlebar-label">orchestrator — 3 models, 1 judge</span>
        </div>

        <div className="body">
          <div className="output" aria-live="polite">
            {answer === "" && status === "idle" && (
              <p className="placeholder">
                Ask something. Three models answer in parallel, a judge model
                merges the two strongest replies, and the result streams in
                here.
              </p>
            )}
            {answer === "" && isStreaming && (
              <p className="placeholder">running the panel…</p>
            )}
            {answer !== "" && (
              <p className="answer">
                {answer}
                {isStreaming && <span className="cursor" />}
              </p>
            )}
            {status === "error" && <p className="error">✗ {errorMsg}</p>}
          </div>

          {meta && (
            <div className="meta">
              <span className="meta-label">panel</span>
              {meta.candidates?.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}

              <table className="usage-table">
                <thead>
                  <tr>
                    <th>model</th>
                    <th>in</th>
                    <th>out</th>
                    <th>cost</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: "MODEL_A", id: meta.candidates?.[0] },
                    { role: "MODEL_B", id: meta.candidates?.[1] },
                    { role: "MODEL_C", id: meta.candidates?.[2] },
                    { role: "JUDGE_MODEL", id: "judge" },
                  ].map(({ role, id }) => {
                    const usage = meta.usage?.[role];
                    if (!usage) return null;
                    const cost = costFor(id, usage);
                    return (
                      <tr key={role}>
                        <td>{id ?? role}</td>
                        <td>{usage.input_tokens ?? "–"}</td>
                        <td>{usage.output_tokens ?? "–"}</td>
                        <td>{cost !== null ? `$${cost.toFixed(5)}` : "n/a"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {(() => {
                const total = ["MODEL_A", "MODEL_B", "MODEL_C"]
                  .map((role, i) =>
                    costFor(meta.candidates?.[i], meta.usage?.[role])
                  )
                  .concat(costFor("judge", meta.usage?.JUDGE_MODEL))
                  .filter((c) => c !== null)
                  .reduce((a, b) => a + b, 0);
                return total > 0 ? (
                  <div className="total-cost">total ≈ ${total.toFixed(5)}</div>
                ) : null;
              })()}
            </div>
          )}

          <form className="composer" onSubmit={runQuery}>
            <span className="prompt-glyph">&gt;</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ask the panel something…"
              rows={2}
              disabled={isStreaming}
            />
            <button type="submit" disabled={isStreaming || !prompt.trim()}>
              {isStreaming ? "streaming…" : "send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
