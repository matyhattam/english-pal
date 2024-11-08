import { useRef, useEffect, ReactNode } from 'react';
import { Messages } from '../../App'
import './Chat.css'

interface MessagesAreaProps {
  className?: string;
  messages: Messages[];

}

interface ChatItem {
  className?: string;
  children?: ReactNode;
}

export function MessageArea({ className, messages }: MessagesAreaProps) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function ChatItem({ className, children }: ChatItem) {
    return (
      <div className={className}>{children}</div>
    )
  }

  return <div className={className} ref={scrollRef}>
    {messages.map(message => (
      <ChatItem key={message.id}
        className={`chatitem ${message.source === 'user' ? 'useritem' : 'teacheritem'}`}>
        {message.content}
      </ChatItem>
    ))}
  </div>
}
