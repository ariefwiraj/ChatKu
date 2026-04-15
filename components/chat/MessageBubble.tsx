"use client";

import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "bot";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${isUser ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      
      <div className={`group relative py-3 px-4 rounded-2xl text-[15px] leading-relaxed ${
        isUser 
          ? "bg-primary text-white rounded-tr-none shadow-sm" 
          : "bg-surface-elevated border border-border text-foreground rounded-tl-none shadow-sm"
      }`}>
        <div className="prose prose-sm dark:prose-invert max-w-none text-current">
          <ReactMarkdown
            components={{
              p: ({ node: _node, ...props }) => <p className="mb-2 last:mb-0" {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
              ul: ({ node: _node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
              ol: ({ node: _node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
              li: ({ node: _node, ...props }) => <li className="mb-1" {...props} />, // eslint-disable-line @typescript-eslint/no-unused-vars
              code: ({ node: _node, className, children, ref: _ref, ...props }) => { // eslint-disable-line @typescript-eslint/no-unused-vars
                const isInline = !className;
                return isInline ? (
                  <code className="bg-black/20 rounded px-1.5 py-0.5 text-[0.9em]" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-[#0d0d12] border border-border rounded-lg p-4 overflow-x-auto my-3 text-[0.9em]" {...props}>
                    <code className={className}>
                      {children}
                    </code>
                  </pre>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
