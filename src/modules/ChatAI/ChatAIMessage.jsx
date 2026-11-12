
import ReactMarkdown from 'react-markdown';

export default function ChatAIMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`max-w-[75%] p-3 rounded-xl shadow 
          ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
