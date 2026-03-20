import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: "10px" }}>
      <input
        style={{ flex: 1 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Kirjoita viesti..."
      />

      <button type="submit">Lähetä</button>
    </form>
  );
}