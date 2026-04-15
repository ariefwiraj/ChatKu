"use client";

import ChatHeader from "@/components/chat/ChatHeader";
import MessageContainer from "@/components/chat/MessageContainer";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useSessionToken } from "@/hooks/useSessionToken";

export default function ChatPage() {
  const { token } = useSessionToken();
  const { messages, isLoading, sendMessage } = useChat({
    sessionToken: token,
  });

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <ChatHeader />
      <MessageContainer messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
