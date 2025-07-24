import React, { useState } from "react";
import axios from "axios";
import JsxParser from "react-jsx-parser";

export default function UIBuilder() {
  const [viewMode, setViewMode] = useState("preview");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([
    "Make a login form",
    "Create a pricing card",
  ]);
  const [jsxCode, setJsxCode] = useState("");
  const [copied, setCopied] = useState(false); // for feedback

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    if (!history.includes(trimmedPrompt)) {
      setHistory([trimmedPrompt, ...history]);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/generate`,
        { prompt: trimmedPrompt }
      );

      const { jsx } = response.data;
      if (!jsx || typeof jsx !== "string" || !jsx.includes("className")) {
        throw new Error("Invalid JSX returned");
      }

      setJsxCode(jsx);
    } catch (error) {
      console.error("Error generating component from JSX:", error.message);
      setJsxCode(
        `<div className="text-red-600">Failed to render: ${error.message}</div>`
      );
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsxCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-auto border-r">
        <h2 className="text-lg font-semibold mb-4">Prompt History</h2>
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li key={index} className="text-sm text-gray-700">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Code / Preview Area</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {copied ? "Copied!" : "Copy JSX"}
            </button>
            <button
              onClick={() =>
                setViewMode(viewMode === "preview" ? "code" : "preview")
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Switch to {viewMode === "preview" ? "Code" : "Preview"}
            </button>
          </div>
        </div>

        <div className="flex-1 border rounded-lg p-4 bg-white overflow-auto">
          {viewMode === "preview" ? (
            <div className="border p-4 bg-gray-50 rounded-lg">
              <JsxParser
                jsx={jsxCode}
                components={{}} // Add your own components here if needed
                renderInWrapper={false}
              />
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">JSX Code</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm text-gray-800 whitespace-pre-wrap">
                {jsxCode || "<div>No JSX returned</div>"}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt..."
            className="flex-1 border px-4 py-2 rounded focus:outline-none"
          />
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
