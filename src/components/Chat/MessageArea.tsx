import { useRef, useEffect } from 'react';
import './Chat.css'

interface MessagesAreaProps {
  className?: string;
}

export function MessageArea({ className, messages }: MessagesAreaProps) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function ChatItem({ className, children }) {
    return (
      <div className={className}>{children}</div>
    )
  }

  return <div className={className} ref={scrollRef}>
    {messages.map(message => (
      <ChatItem className={`chatitem ${message.source === 'user' ? 'useritem' : 'teacheritem'}`}>{message.content}</ChatItem>
    ))}
  </div>
}
