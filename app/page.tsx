"use client";

import { useChat } from "ai/react";
import { Bubble, Prompts, Sender } from "@ant-design/x";
import { useState } from "react";
import type { PromptsProps } from "@ant-design/x";
import {
  FireOutlined,
  CoffeeOutlined,
  SmileOutlined,
  UserOutlined,
  MessageOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "motion/react";
import { MemoizedMarkdown } from "@/components/MemoizedMarkdown";
import { RolesType } from "@ant-design/x/es/bubble/BubbleList";

const items: PromptsProps["items"] = [
  {
    key: "6",
    icon: <CoffeeOutlined style={{ color: "#964B00" }} />,
    description: "How to rest effectively after long hours of work?",
    disabled: false,
  },
  {
    key: "7",
    icon: <SmileOutlined style={{ color: "#FAAD14" }} />,
    description: "What are the secrets to maintaining a positive mindset?",
    disabled: false,
  },
  {
    key: "8",
    icon: <FireOutlined style={{ color: "#FF4D4F" }} />,
    description: "How to stay calm under immense pressure?",
    disabled: false,
  },
  {
    key: "9",
    icon: <MessageOutlined style={{ color: "#A52A2A" }} />,
    description: "Hello !",
    disabled: false,
  },
];

const renderMarkdown = (id: string, content: string) => (
  <div className="prose space-y-2">
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <MemoizedMarkdown id={id} content={content} />
  </div>
);

const roles: RolesType = {
  user: {
    placement: "start",
    typing: true,
    avatar: {
      icon: <UserOutlined />,
      style: { color: "#f56a00", backgroundColor: "#fde3cf" },
    },
  },
  assistant: {
    placement: "end",
    typing: true,
    avatar: {
      icon: <RobotOutlined />,
      style: { color: "#fff", backgroundColor: "#87d068" },
    },
  },
};

export default function Chat() {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    reload,
  } = useChat({
    onFinish() {
      setLoading(false);
    },
  });

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
  };

  return (
    <div className="mx-auto w-2/5 mt-8">
      <div className="w-full py-8 mx-auto">
        <div className="flex-1 overflow-y-auto mb-4  border border-gray-100 rounded-lg p-4 shadow-lg flex flex-col gap-2">
          <AnimatePresence mode="wait">
            {!messages.length ? (
              <motion.div
                key="prompts"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className="h-[700px]"
              >
                <Prompts
                  title="🤔 You might also want to ask:"
                  items={items}
                  vertical
                  onItemClick={(item) => {
                    if (
                      item.data.description &&
                      typeof item.data.description === "string"
                    ) {
                      // setInput(item.data.description);
                      const id = Date.now().toString();
                      setMessages([
                        {
                          id,
                          role: "user",
                          content: item.data.description,
                        },
                      ]);
                      reload();
                      setLoading(true);
                    }
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
              >
                <Bubble.List
                  roles={roles}
                  items={messages.map((m) => ({
                    key: m.id,
                    role: m.role,
                    content: m.content,
                    messageRender(content) {
                      return renderMarkdown(m.id, content);
                    },
                    variant: "shadow",
                    typing: { step: 2, interval: 50 },
                  }))}
                  autoScroll
                  className="h-[700px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <Sender
            className="shadow-lg rounded-xl"
            loading={loading}
            value={input}
            onChange={(_, event) => {
              if (event) {
                handleInputChange(
                  event as React.ChangeEvent<HTMLTextAreaElement>
                );
              }
            }}
            onSubmit={() => {
              handleSubmit();
              setLoading(true);
            }}
            onCancel={() => {
              setLoading(false);
            }}
          />
        </form>
      </div>
    </div>
  );
}
