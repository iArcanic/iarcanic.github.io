import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    const fetchTimeAndTimezone = () => {
      const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      const timezoneOptions = {
        timeZoneName: "long",
      };

      // Fetch current time
      const time = new Date().toLocaleTimeString(undefined, timeOptions);
      setCurrentTime(time);

      // Fetch timezone
      const tz = new Date().toLocaleString(undefined, timezoneOptions);
      setTimezone(tz);
    };

    fetchTimeAndTimezone();
  }, []); // Empty dependency array ensures this runs only once

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCommandSubmit = (event) => {
    event.preventDefault();
    // Handle command logic here
    console.log(`Command entered: ${inputValue}`);
    setInputValue("");
  };

  return (
    <div className="terminal-window">
      <div className="terminal-content">
        <div className="terminal-welcome">
          Welcome to iArcanic's Portfolio Website!
          <br></br>
          <br />* Name: <span>Preetham Ananthkumar</span>
          <br />* Website: <span>https://iarcanic.github.io</span>
          <br></br>
          <br></br>
          <span>
            System information as of {currentTime} GMT+1 {timezone}
          </span>
        </div>

        <div className="terminal-info">
          <div className="info-line">
            <span className="info-label">System load:</span>
            <span>0.01</span>
            <span className="info-label">Processes:</span>
            <span>231</span>
          </div>
          <div className="info-line">
            <span className="info-label">Usage of /:</span>
            <span>68.0% of 47.41GB</span>
            <span className="info-label">Users:</span>
            <span>1</span>
          </div>
          <div className="info-line">
            <span className="info-label">Memory usage:</span>
            <span>5%</span>
            <span className="info-label">IPv4 address:</span>
            <span>192.168.1.89</span>
          </div>
          <div className="info-line">
            <span className="info-label">Swap usage:</span>
            <span>0%</span>
          </div>
          <br />
          <span>*** System restart not required ***</span>
          <br />
          <span>Last login: {timezone}</span>
        </div>

        <form onSubmit={handleCommandSubmit} className="terminal-prompt">
          <span className="command-prompt">$</span>
          <input
            type="text"
            className="command-input"
            placeholder=""
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export default App;
