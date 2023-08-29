import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import "./App.css";
import { motion } from "framer-motion";

const App = () => {
  const [message, setMessage] = useState(null);
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

  if (!message) {
    return (
      <div className="container">
        <h1>Syook encrypted Timeseries</h1>
        <p className="success__rate">Loading Data ...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <h1>Syook encrypted Timeseries</h1>
        <div className="success__rate">
          <p>{message?.time}</p>
          <p>
            {" "}
            Success Rate : <span>{message?.successRate}</span>
          </p>
        </div>
        {message &&
          Object.values(message?.insertRes?.segments)
            .reverse()
            .map((data, idx) => (
              <div className="table__separator" key={idx}>
                <motion.table layout>
                  <motion.thead layout>
                    <tr>
                      <th>time stamp</th>
                      <th>name</th>
                      <th>origin</th>
                      <th>destination</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody layout>
                    {data.map((data, idx) => (
                      <Fragment key={idx}>
                        <tr>
                          <td>{message?.insertRes?.time_stamp}</td>
                          <td>{data.name}</td>
                          <td>{data.origin}</td>
                          <td>{data.destination}</td>
                        </tr>
                      </Fragment>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            ))}
      </div>
    </>
  );
};

export default App;
