import React from 'react'

interface SendMessageFormProps {
    newMessage: string;
    setNewMessage: (value: string) => void;
    onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean
}

const SendMessageForm = ({newMessage, setNewMessage, onSendMessage, loading}: SendMessageFormProps) => {
  return (
    <form onSubmit={onSendMessage} className="flex items-center mt-4 flex-shrink-0">
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md"
            disabled={loading}
            required
        />
        <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-r-md"
            disabled={loading}
        >
            Send
        </button>
    </form>
  )
}

export default SendMessageForm