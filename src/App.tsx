import { ReactNode, useState } from 'react'
import './App.css'

function App() {

  interface ContainerProps {
    children: ReactNode;
    className?: string;
  }
  interface SidebarProps {
    className?: string;
  }
  interface ChatProps {
    children: ReactNode;
    className?: string;
  }
  interface TextareaProps {
    className?: string;
  }

  const [showSideBar, setShowSideBar] = useState<boolean>(true)

  function toggleSideBar() {
    setShowSideBar(!showSideBar);
    console.log(showSideBar)
  }

  function Container({ children, className }: ContainerProps) {
    return <div className={className}>
      {children}
    </div>
  }
  function Sidebar({ className }: SidebarProps) {
    return <div className={className}>
    </div>
  }
  function Chat({ children, className }: ChatProps) {
    return <div className={className}>
    {children}
    </div>
  }
  function Textarea({ className }: TextareaProps) {
    return <textarea className={className}>
    </textarea>
  }
  return (
    <>
      <Container className='container'>
      {showSideBar && (
        <Sidebar className='sidebar'>
        </Sidebar>)}
        <Chat className='chat'>
          <button onClick={toggleSideBar}>show</button>
          <Textarea className='textarea'></Textarea>
        </Chat>
      </Container>
    </>
  )
}

export default App
