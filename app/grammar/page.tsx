"use client";

import { useEffect, useState } from "react";
import { Sender } from "@ant-design/x";
import { useCompletion } from "ai/react";
import { MemoizedMarkdown } from "@/components/MemoizedMarkdown";
import { motion } from "motion/react";
import HistoryItem from "./HistoryItem";
import { RollbackOutlined } from "@ant-design/icons";

interface HistoryRecord {
  input: string;
  completion: string;
}

const STORAGE_KEY = "grammarData";

export default function GrammarPage() {
  // 用于存储 input 和 completion 的历史记录
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isTouched, setIsTouched] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(
    null
  );

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
      if (parsedHistory.length > 0) {
        setHistory(parsedHistory);
      }
    }
  }, []);

  const selectHandler = (record: HistoryRecord) => {
    if (!isTouched) {
      setIsTouched(true);
    }
    setSelectedHistory(record);
  };

  return (
    <div className="mx-auto w-2/5 mt-8">
      <motion.div
        animate={{
          marginTop: isTouched ? 0 : "20rem",
          opacity: 1,
        }}
        initial={{
          marginTop: "18rem",
          opacity: 0,
        }}
      >
        <Sender
          className="shadow-lg rounded-xl"
          loading={isLoading}
          value={input}
          onChange={(_, event) => {
            if (!isTouched) {
              setIsTouched(true);
            }
            if (event) {
              handleInputChange(
                event as React.ChangeEvent<HTMLTextAreaElement>
              );
            }
          }}
          onSubmit={() => {
            handleSubmit();
          }}
          onCancel={() => {
            stop();
          }}
        />
      </motion.div>

      <div className="prose space-y-2 mt-4">
        <MemoizedMarkdown id={input} content={completion} />
      </div>
      {!selectedHistory ? (
        <motion.ul className="flex flex-wrap gap-10">
          {history.map((record, index) => (
            <HistoryItem
              key={index}
              record={record}
              index={index}
              onSelected={selectHandler}
            />
          ))}
        </motion.ul>
      ) : (
        <div className="history-content prose space-y-2 mt-4">
          <button
            onClick={() => setSelectedHistory(null)}
            className="px-2 py-1 bg-green-500 text-white rounded-lg"
          >
            <RollbackOutlined className="mr-1"/>
            All History
          </button>
          <MemoizedMarkdown
            id={selectedHistory.input}
            content={selectedHistory.completion}
          />
        </div>
      )}
    </div>
  );
}
