import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { FaGithub, FaLinkedin, FaFilePdf } from "react-icons/fa";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const inputRef = useRef(null);

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

    // Autofocus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCommandSubmit = (event) => {
    event.preventDefault();
    setInputValue("");
  };

  const asciiArt = `
$$\\  $$$$$$\\                                          $$\\           
\\__|$$  __$$\\                                         \\__|          
$$\\ $$ /  $$ | $$$$$$\\   $$$$$$$\\  $$$$$$\\  $$$$$$$\\  $$\\  $$$$$$$\\ 
$$ |$$$$$$$$ |$$  __$$\\ $$  _____| \\____$$\\ $$  __$$\\ $$ |$$  _____|
$$ |$$  __$$ |$$ |  \\__|$$ /       $$$$$$$ |$$ |  $$ |$$ |$$ /      
$$ |$$ |  $$ |$$ |      $$ |      $$  __$$ |$$ |  $$ |$$ |$$ |      
$$ |$$ |  $$ |$$ |      \\$$$$$$$\\ \\$$$$$$$ |$$ |  $$ |$$ |\\$$$$$$$\\ 
\\__|\\__|  \\__|\\__|       \\_______| \\_______|\\__|  \\__|\\__| \\_______|                        
  `;

  return (
    <div className="terminal-window">
      <div className="terminal-content">
        <pre className="ascii-art">{asciiArt}</pre>
        <div className="terminal-welcome">
          Welcome to iArcanic's Portfolio Website!
          <br></br>
          <br />* Name: <span>Preetham Ananthkumar</span>
          <br />* <FaGithub />{" "}
          <a href="https://github.com/iArcanic" className="terminal-link">
            iArcanic
          </a>
          <br />* <FaLinkedin />{" "}
          <a
            href="https://www.linkedin.com/in/preetham-ananthkumar"
            className="terminal-link"
          >
            Preetham Ananthkumar
          </a>
          <br />* <FaFilePdf />{" "}
          <a href="/path/to/resume.pdf" className="terminal-link" download>
            Download Resume
          </a>
          <br></br>
          <br></br>
          <span>System information as of {timezone}</span>
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
          <span>*** Type 'help' for a list of all available commands ***</span>
          <br />
          <span>
            *** Type 'repo' to view the GitHub repository or click{" "}
            <a
              href="https://github.com/iArcanic/iarcanic.github.io"
              className="terminal-link"
              download
            >
              here
            </a>{" "}
            ***
          </span>
          <br />
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
