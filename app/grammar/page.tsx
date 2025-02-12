"use client";

import { useEffect, useState } from "react";
import { Sender } from "@ant-design/x";
import { useCompletion } from "ai/react";
import { MemoizedMarkdown } from "@/components/MemoizedMarkdown";

interface HistoryRecord {
  input: string;
  completion: string;
}

const STORAGE_KEY = "grammarData";

export default function GrammarPage() {
  // 用于存储 input 和 completion 的历史记录
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const {
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    stop,
    completion,
    setInput,
  } = useCompletion({
    api: "/api/completion",
    onFinish(prompt, completion) {
      setHistory((prev) => [
        ...prev,
        { input: prompt, completion: completion },
      ]);
      setInput("");
    },
  });

  useEffect(() => {
    return () => {
      if (history.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    };
  }, [history]);

  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory) as HistoryRecord[];
      if(parsedHistory.length > 0) {
        setHistory(JSON.parse(storedHistory));
      }
    }
  }, []);

  return (
    <div className="mx-auto w-2/5 mt-8">
      <Sender
        className="shadow-lg rounded-xl"
        loading={isLoading}
        value={input}
        onChange={(_, event) => {
          if (event) {
            handleInputChange(event as React.ChangeEvent<HTMLTextAreaElement>);
          }
        }}
        onSubmit={() => {
          handleSubmit();
        }}
        onCancel={() => {
          stop();
        }}
      />
      <div className="prose space-y-2 mt-4">
        <MemoizedMarkdown id={input} content={completion} />
      </div>
    </div>
  );
}
