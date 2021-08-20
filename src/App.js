import { useEffect,useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js'
import axios from './axios.js';

function App() {

  const [messages,setMessages] = useState([]);

  useEffect(()=>{
    axios.get("/messages/sync")
    .then(response =>{
      setMessages(response.data);
    })
  },[])
  
  useEffect(()=>{
    const pusher = new Pusher('96c1fc056ad9f61e3df3', {
      cluster: 'ap2'
    });
    
    const channel = pusher.subscribe('messages');
    channel.bind('inserted',(data)=> {
      setMessages([...messages,data])
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }

  },[messages])
  
  console.log(messages)

  return (
    <div className="app">
      <div className='app__body'>
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
