import { useState } from "react";

const CONTENT_TYPES = [
  { id: "blog", label: "Blog Post", icon: "📝" },
  { id: "social", label: "Social Media", icon: "📱" },
  { id: "script", label: "Video Script", icon: "🎬" },
  { id: "caption", label: "Caption", icon: "✍️" },
];

const SYSTEM_PROMPT = `You are a Content Creation Agent. Your job is to research and write high-quality content end-to-end.

When given a content request:
1. First, use the web_search tool to research the topic thoroughly (search 2-3 times for different angles).
2. Synthesize what you found.
3. Write polished, ready-to-publish content based on the type requested.

Content type guidelines:
- blog: 600-900 words, SEO-friendly headings, engaging intro and CTA
- social: Platform-appropriate (Instagram/LinkedIn/Twitter), hooks, hashtags
- script: YouTube/Reel format with hook, body, CTA, timestamps
- caption: Short, punchy, with emojis and relevant hashtags

Always return ONLY the final content, formatted and ready to use. No meta-commentary.`;

export default function App() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(""); // "researching" | "writing"
  const [error, setError] = useState("");

 const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    setError("");
    setStage("researching");

    try {
      setStage("writing");

      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, contentType }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data.content);
    } catch (err) {
      setError("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
      setStage("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>✦ Content Creation Agent</h1>
        <p style={styles.subtitle}>
          Researches & writes content end-to-end using AI
        </p>
      </header>

      <main style={styles.main}>
        {/* Content Type Selector */}
        <div style={styles.typeGrid}>
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              style={{
                ...styles.typeBtn,
                ...(contentType === type.id ? styles.typeBtnActive : {}),
              }}
            >
              <span style={{ fontSize: 22 }}>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Topic Input */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>What should I write about?</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`e.g. "The future of AI in healthcare" or "How to start journaling"`}
            style={styles.textarea}
            rows={3}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          style={{
            ...styles.generateBtn,
            opacity: loading || !topic.trim() ? 0.5 : 1,
          }}
        >
          {loading ? (
            stage === "researching" ? "🔍 Researching topic..." : "✍️ Writing content..."
          ) : (
            "Generate Content"
          )}
        </button>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Result */}
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.resultHeader}>
              <span style={styles.resultLabel}>
                {CONTENT_TYPES.find((t) => t.id === contentType)?.icon}{" "}
                {CONTENT_TYPES.find((t) => t.id === contentType)?.label}
              </span>
              <button onClick={copyToClipboard} style={styles.copyBtn}>
                Copy ✦
              </button>
            </div>
            <pre style={styles.resultText}>{result}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f0f0f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "0 16px 60px",
  },
  header: {
    textAlign: "center",
    padding: "48px 0 32px",
    borderBottom: "1px solid #222",
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    margin: 0,
    color: "#fff",
  },
  subtitle: {
    color: "#888",
    marginTop: 8,
    fontSize: 15,
  },
  main: {
    maxWidth: 720,
    margin: "0 auto",
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginBottom: 28,
  },
  typeBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "14px 8px",
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    color: "#aaa",
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.15s",
  },
  typeBtnActive: {
    background: "#1a1a2e",
    border: "1px solid #6c63ff",
    color: "#a78bfa",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  textarea: {
    width: "100%",
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#f0f0f0",
    fontSize: 15,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: 1.5,
  },
  generateBtn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  error: {
    marginTop: 16,
    padding: "12px 16px",
    background: "#1f0a0a",
    border: "1px solid #5a1a1a",
    borderRadius: 8,
    color: "#f87171",
    fontSize: 14,
  },
  resultBox: {
    marginTop: 28,
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    overflow: "hidden",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 18px",
    borderBottom: "1px solid #222",
    background: "#111",
  },
  resultLabel: {
    fontSize: 13,
    color: "#a78bfa",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  copyBtn: {
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 6,
    color: "#888",
    cursor: "pointer",
    fontSize: 12,
    padding: "5px 12px",
  },
  resultText: {
    padding: "20px 18px",
    margin: 0,
    fontSize: 14,
    lineHeight: 1.7,
    color: "#ddd",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};