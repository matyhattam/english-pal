import { ReactNode, useState } from 'react';
import { FiSidebar } from "react-icons/fi";
import { Textarea } from './TextArea';
import { MessageArea, dummyMessages } from './MessageArea'
import './Chat.css'

interface ChatProps {
  className?: string;
  toggleSideBar: () => void;
}
interface ChatHeaderProps {
  children: ReactNode;
  className?: string;
}

export function Chat({ toggleSideBar, className }: ChatProps) {
  //const [messages, setMessages] = useState(dummyMessages);
  const [messages, setMessages] = useState([]);

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
      <MessageArea className='messagesarea' messages={messages}></MessageArea>
      <Textarea
        formClassName="messageinput"
        textAreaClassName="textarea"
        setMessages={setMessages}
      ></Textarea>
    </div>
  )

}

