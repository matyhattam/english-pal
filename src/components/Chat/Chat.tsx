import { ReactNode, useState } from 'react';
import { FiSidebar, FiPlusSquare } from "react-icons/fi";
import { Textarea } from './TextArea';
import { MessageArea } from './MessageArea'
import './Chat.css'

interface ChatProps {
  className?: string;
  toggleSideBar: () => void;
}
interface ChatHeaderProps {
  children: ReactNode;
  className?: string;
}

export function Chat({ toggleSideBar, className, setConversations, currentConv, setCurrentConv, messages, setMessages }: ChatProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function ChatHeader({ children, className }: ChatHeaderProps) {
    return <div className={className}>
      {children}
    </div>
  }

  return (
    <div className={className}>
      <ChatHeader className='chatheader'>
        <FiSidebar style={{
          color: "hsl(25 5.3% 44.7%)",
          fontSize: '1.5em'
        }}
          onClick={toggleSideBar} />
        <FiPlusSquare style={{
          color: "hsl(25 5.3% 44.7%)",
          fontSize: '1.5em'
        }}
          onClick={() => {
            setCurrentConv(null);
            setMessages([])
          }}
        />
      </ChatHeader>
      <MessageArea
        className='messagesarea'
        currentConv={currentConv}
        messages={messages}
        setMessages={setMessages}>
      </MessageArea>
      <Textarea
        formClassName="messageinput"
        textAreaClassName="textarea"
        setConversations={setConversations}
        currentConv={currentConv}
        setCurrentConv={setCurrentConv}
        setMessages={setMessages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}>
      </Textarea>
    </div>
  )

}

