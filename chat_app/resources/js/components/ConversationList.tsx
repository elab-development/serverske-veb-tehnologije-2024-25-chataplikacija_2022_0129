import React from "react";

interface ConversationData {
  name: string;
  lastMessage?: string;
}

interface ConversationListProps {
  conversations: ConversationData[];
  onSelect: (conversation: ConversationData) => void;
}

export default function ConversationList({ conversations, onSelect }: ConversationListProps) {
  return (
    <div className="conversation-list">
      {conversations.map((conv, index) => (
        <div
          key={index}
          className="p-2 border-b hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(conv)}
        >
          <div className="font-bold">{conv.name}</div>
          <div className="text-sm text-gray-500">{conv.lastMessage || "No messages yet"}</div>
        </div>
      ))}
    </div>
  );
}
