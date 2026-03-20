import { MessageDto } from "../types/case";

interface Props {
  message: MessageDto;
  currentUserId: string;
}

export default function MessageBubble({ message, currentUserId }: Props) {
  const isOwn = message.senderId === currentUserId;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginBottom: "8px"
      }}
    >
      <div
        style={{
          background: isOwn ? "#cce5ff" : "#eee",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "60%"
        }}
      >
        <div>{message.content}</div>

        <div style={{ fontSize: "10px", opacity: 0.6 }}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}