import { ReactNode } from 'react';
import { FiSidebar } from "react-icons/fi";
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

export function Chat({ toggleSideBar, className, currentConv, setCurrentConv, messages, setMessages }: ChatProps) {
  function ChatHeader({ children, className }: ChatHeaderProps) {
    return <div className={className}>
      {children}
    </div>
  }

  return (
    <div className={className}>
      <ChatHeader className='chatheader'>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FiSidebar style={{
            color: "hsl(25 5.3% 44.7%)",
            fontSize: '1.5em'
          }}
            onClick={toggleSideBar} />
        </div>
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
        currentConv={currentConv}
        setCurrentConv={setCurrentConv}
        setMessages={setMessages}
      ></Textarea>
    </div>
  )

}

