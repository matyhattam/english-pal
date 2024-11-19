import { useRef, useEffect, useState, ReactNode } from 'react';
import ReactMakrdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Messages } from '../../App'
import './Chat.css'

interface MessagesAreaProps {
  className?: string;
  messages: Messages[];

}

interface ChatItem {
  className?: string;
  children?: ReactNode;
  message: Messages;
}

export function MessageArea({ className, messages, isLoading }: MessagesAreaProps) {
  const scrollRef = useRef(null);
  const [correction, setCorrection] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function clickShowCorrection(message) {
    setShowCorrection(!showCorrection)
    setSelectedMessageId(message.id)
    setCorrection("test correction display");
  }

  function ChatItem({ className, children, message }: ChatItem) {
    if (message.source === 'user') {
      return (
        <div className={className} onClick={() => clickShowCorrection(message)}>{children}</div>
      )
    } else {
      return (
        <div className={className} >{children}</div>
      )
    }

  }

  return (
    <div className={className} ref={scrollRef}>
      {messages.map(message => {
        const displayCorrection = selectedMessageId === message.id
        return (
          <ChatItem key={message.id}
            message={message}
            className={`chatitem ${message.source === 'user' ?
              'useritem' : 'teacheritem'}`} >
            <ReactMakrdown
              children={displayCorrection && showCorrection ? correction : message.content}
              remarkPlugins={[gfm]} />
          </ChatItem>
        )
      })}
    </div>
  );
}
