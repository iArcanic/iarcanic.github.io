import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { FaGithub, FaLinkedin, FaFilePdf } from "react-icons/fa";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const inputRef = useRef(null);
  const [outputs, setOutputs] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
    const trimmedInput = inputValue.trim();
    if (trimmedInput !== "") {
      processCommand(trimmedInput); // Process the entered command
      setCommandHistory((prevHistory) => [...prevHistory, trimmedInput]);
    }
    setInputValue(""); // Clear input after submitting
    setHistoryIndex(-1); // Reset history index after submitting a new command
  };

  const processCommand = (command) => {
    let newOutput = []; // Temp array to collect new output
    switch (command.trim().toLowerCase()) {
      case "about":
        newOutput = [
          "Name: Preetham Ananthkumar",
          "Website: https://iarcanic.github.io",
          "Role: Software Engineer",
        ];
        break;
      case "clear":
        setOutputs([]); // Clear all outputs
        return;
      case "help":
        newOutput = [
          "Available commands:",
          "- about: Display information about me",
          "- clear: Clear the terminal screen",
          "- help: Display this help message",
          "- repo: Redirect to this website's GitHub repository",
          "- github: Redirect to iArcanic's GitHub Profile",
          "- linkedin: Redirect to iArcanic's Linkedin Profile",
          "- resume: Download iArcanic's resume PDF",
          "- quit or exit: Close the terminal",
        ];
        break;
      case "repo":
        window.open("https://github.com/iArcanic/iarcanic.github.io", "_blank");
        return;
      case "github":
        window.open("https://github.com/iArcanic", "_blank");
        return;
      case "linkedin":
        window.open(
          "https://www.linkedin.com/in/preethamananthkumar/",
          "_blank"
        );
        return;
      case "quit":
      case "exit":
        window.close();
        return;
      default:
        newOutput = [
          `bash: command not found: '${command}'`,
          `Type 'help' to see a list of available commands.`,
        ];
        break;
    }
    setOutputs((prevOutputs) => [
      ...prevOutputs,
      { command, output: newOutput },
    ]); // Update outputs with new output
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      // Submit command on Ctrl+Enter or Cmd+Enter
      handleCommandSubmit(event);
    } else if (event.key === "ArrowUp") {
      // Handle arrow key navigation for command history
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (event.key === "ArrowDown") {
      if (historyIndex >= 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(newIndex >= 0 ? commandHistory[newIndex] : "");
      }
    } else if (event.key === "u" && (event.ctrlKey || event.metaKey)) {
      // Ctrl+U to clear input line
      setInputValue("");
    } else if (event.key === "e" && (event.ctrlKey || event.metaKey)) {
      // Ctrl+E to go to end of input line
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    } else if (event.key === "a" && (event.ctrlKey || event.metaKey)) {
      // Ctrl+A to go to beginning of input line
      inputRef.current.selectionStart = 0;
      inputRef.current.selectionEnd = 0;
    }
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
          <br />
        </div>
        <br />
        {outputs.map((output, index) => (
          <div key={index} className="terminal-output">
            <div className="prompt-history">
              <span className="command-prompt">$</span>
              <span>{output.command}</span>
            </div>
            {output.output.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        ))}
        <form onSubmit={handleCommandSubmit} className="terminal-prompt">
          <span className="command-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder=""
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e)}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export default App;
