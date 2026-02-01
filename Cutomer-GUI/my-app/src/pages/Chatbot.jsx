// import React, { useState, useEffect, useRef } from 'react';
// // import './App.css'; // We will create this file for styling -- REMOVED to fix compilation error
// import "./Chatbot.css"
// // --- CSS STYLES ---
// // In this environment, styles must be in the same file.
// const GlobalCSS = `
// body {
//   font-family: Arial, sans-serif;
//   background-color: #f0f2f5;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   margin: 0;
// }

// .App {
//   width: 100%;
//   max-width: 500px;
//   height: 80vh;
//   display: flex;
//   flex-direction: column;
// }

// .chat-window {
//   border: 1px solid #ccc;
//   border-radius: 8px;
//   background-color: #fff;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   flex-grow: 1;
//   overflow: hidden;
// }

// .chat-header {
//   background-color: #007bff;
//   color: white;
//   padding: 15px;
//   text-align: center;
//   border-bottom: 1px solid #ddd;
// }

// .chat-header h2 {
//   margin: 0;
//   font-size: 1.2rem;
// }

// .chat-body {
//   flex-grow: 1;
//   padding: 20px;
//   overflow-y: auto; /* This makes the chat scrollable */
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// }

// .message {
//   padding: 10px 15px;
//   border-radius: 20px;
//   max-width: 70%;
//   line-height: 1.4;
//   word-wrap: break-word;
// }

// .message p {
//   margin: 0;
// }

// /* Style for messages from the user */
// .message.user {
//   background-color: #007bff;
//   color: white;
//   align-self: flex-end; /* Aligns to the right */
//   border-bottom-right-radius: 5px;
// }

// /* Style for messages from the bot */
// .message.bot {
//   background-color: #e9e9eb;
//   color: #333;
//   align-self: flex-start; /* Aligns to the left */
//   border-bottom-left-radius: 5px;
// }

// .chat-footer {
//   padding: 15px;
//   border-top: 1px solid #ddd;
//   background-color: #f9f9f9;
// }

// .chat-footer form {
//   display: flex;
//   gap: 10px;
// }

// .chat-footer input {
//   flex-grow: 1;
//   padding: 10px 15px;
//   border: 1px solid #ccc;
//   border-radius: 20px;
//   font-size: 1rem;
// }

// .chat-footer button {
//   padding: 10px 20px;
//   border: none;
//   background-color: #007bff;
//   color: white;
//   border-radius: 20px;
//   cursor: pointer;
//   font-size: 1rem;
//   font-weight: bold;
// }

// .chat-footer button:hover {
//   background-color: #0056b3;
// }
// `;
// // --- END OF CSS ---


// function App() {
//   // 'messages' will hold the entire chat history
//   const [messages, setMessages] = useState([]);
//   // 'input' is the text the user is currently typing
//   const [input, setInput] = useState('');

//   // Ref to the end of the chat, for auto-scrolling
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Scroll to bottom whenever messages array changes
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // This function is called when the user hits 'Send'
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent form from refreshing the page
//     if (!input.trim()) return; // Don't send empty messages

//     // 1. Add user's message to the chat window immediately
//     const userMessage = { text: input, sender: 'user' };
//     setMessages(prevMessages => [...prevMessages, userMessage]);

//     const currentInput = input;
//     setInput(''); // Clear the input field

//     try {
//       // 2. Send the user's message to the backend
//       // This URL matches your backend's port (5001)
//       const response = await fetch('http://localhost:5001/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: currentInput }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();

//       // 3. Add the bot's response to the chat window
//       const botMessage = { text: data.reply, sender: 'bot' };
//       setMessages(prevMessages => [...prevMessages, botMessage]);

//     } catch (error) {
//       console.error("Failed to send message:", error);
//       // Show an error message in the chat
//       const errorMessage = { text: "Sorry, I'm having trouble connecting.", sender: 'bot' };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     }
//   };

//   return (
//     <>
//       {/* This <style> tag injects the CSS into the page */}
//       <style>{GlobalCSS}</style>

//       <div className="App">
//         <div className="chat-window">
//           <div className="chat-header">
//             <h2>Support Chatbot</h2>
//           </div>
//           <div className="chat-body">
//             {/* Map over the messages array to display each message */}
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.sender}`}>
//                 <p>{msg.text}</p>
//               </div>
//             ))}
//             {/* This empty div is the target for auto-scrolling */}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="chat-footer">
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//               />
//               <button type="submit">Send</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

 export default Chatbot;

