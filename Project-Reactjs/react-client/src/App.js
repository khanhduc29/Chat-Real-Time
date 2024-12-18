// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:5000');

//     ws.onmessage = (event) => {
//       setMessages((prev) => [...prev, event.data]);
//     };

//     return () => ws.close();
//   }, []);

//   const sendMessage = () => {
//     const ws = new WebSocket('ws://localhost:5000');
//     ws.onopen = () => ws.send(input);
//   };

//   return (
//     <div>
//       <h1>React Kafka WebSocket Client</h1>
//       <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
//       <button onClick={sendMessage}>Send</button>
//       <ul>
//         {messages.map((msg, index) => (
//           <li key={index}>{msg}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);  // WebSocket instance

  // Kết nối WebSocket khi component được mount
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');
    setWs(socket);  // Lưu lại WebSocket instance

    socket.onmessage = (event) => {
      // Nhận tin nhắn từ server và Kafka consumer
      setMessages((prev) => [...prev, event.data]);
    };

    return () => socket.close();  // Đóng WebSocket khi component unmount
  }, []);

  // Gửi tin nhắn khi người dùng bấm nút
  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(input);  // Gửi tin nhắn qua WebSocket tới server
      setInput('');  // Xóa input sau khi gửi
    }
  };

  return (
    <div>
      <h1>Real-time Customer Support</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

