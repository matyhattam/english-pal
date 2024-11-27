import { useRef, useEffect, useState, ReactNode } from 'react';
import ReactMakrdown from 'react-markdown';
import gfm from 'remark-gfm';
import { ScaleLoader } from 'react-spinners';
import { Messages } from '../../App'
import { useChatGpt } from '../../hooks/hooks';
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

export function MessageArea({ className, messages }: MessagesAreaProps) {
  const scrollRef = useRef(null);
  const [correction, setCorrection] = useState([]);
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function clickShowCorrection(message) {
    if (message.id !== correction.id) {
      setIsCorrecting(true);
      setShowCorrection(!showCorrection)
      setSelectedMessageId(message.id)

      const correction = await useChatGpt(message.content,
        "you are an english teacher, correct my sentance with good and simple english related to the current topic, be concise but you must use Rich Text Formating to emphasize errors visualy");
      setIsCorrecting(false);
      setCorrection({ id: message.id, content: correction });
    } else {
      setShowCorrection(!showCorrection)
    }
  }

  function ChatItem({ className, children, message }: ChatItem) {
    const isCurrentMessage = selectedMessageId === message.id;
    if (message.source === 'user') {
      if (isCurrentMessage && isCorrecting) {
        return (
          <div
            className={className}>
            <ScaleLoader color="hsl(25 5.3% 44.7%)" />
          </div>
        )
      } else {
        return (
          <div
            className={className}
            onClick={() => clickShowCorrection(message)}>
            {children}
          </div>
        )
      }
    } else {
      return (
        <div
          className={className} >
          {children}
        </div>
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
              children={displayCorrection && showCorrection ? correction.content : message.content}
              remarkPlugins={[gfm]} />
          </ChatItem>
        )
      })}
    </div>
  );
}
