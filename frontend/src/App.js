import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  const [message, setMessage] = useState({});
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:3002");

    // Listen for custom events from the server
    socket.on("message", (receivedData) => {
      // Update state with the received data
      console.log(receivedData);
      setMessage(receivedData);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [message]);

  return <div>App</div>;
};

export default App;
