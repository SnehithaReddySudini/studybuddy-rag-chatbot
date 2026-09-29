"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useRef } from "react";

function Quiz({ data }: { data: any }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className="border rounded-xl p-4 my-2 bg-white text-black">
      <h3 className="font-bold mb-2">Quiz: {data.topic}</h3>
      {data.questions.map((q: any, i: number) => (
        <div key={i} className="mb-3">
          <p>{i + 1}. {q.question}</p>
          {q.options.map((o: string, j: number) => (
            <button
              key={j}
              onClick={() => setPicked({ ...picked, [i]: j })}
              className={`block w-full text-left px-3 py-1 my-1 rounded border ${
                picked[i] === undefined ? "" : j === q.answerIndex ? "bg-green-200" : picked[i] === j ? "bg-red-200" : ""
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Chat() {
const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-2">📚 StudyBuddy</h1>
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
            {m.parts.map((p: any, i: number) => {
              if (p.type === "text") return <p key={i} className="whitespace-pre-wrap">{p.text}</p>;
              if (p.type === "file" && p.mediaType?.startsWith("image/"))
                return <img key={i} src={p.url} className="max-w-xs rounded inline-block" />;
              if (p.type === "tool-createQuiz" && p.state === "output-available")
                return <Quiz key={i} data={p.output} />;
              return null;
            })}
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm">Error: {error.message}</p>}
      <form
        className="flex gap-2 mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input && !files) return;
          sendMessage({ text: input, files });
          setInput("");
          setFiles(undefined);
          if (fileRef.current) fileRef.current.value = "";
        }}
      >
        <input type="file" accept="image/*" ref={fileRef} onChange={(e) => setFiles(e.target.files ?? undefined)} />
        <input
          className="flex-1 border rounded px-3 py-2 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or upload a problem image..."
        />
        <button disabled={status !== "ready"} className="bg-blue-600 text-white px-4 rounded">Send</button>
      </form>
    </main>
  );
}