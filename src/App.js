import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { art } from "./utils/asciiArt";
import { colorSchemes } from "./utils/colorSchemes";
import { commands } from "./utils/commands";
import {
  FaGithub,
  FaLinkedin,
  FaFilePdf,
  FaSun,
  FaMoon,
  FaEnvelope,
  FaUserCircle,
  FaTimes,
  FaMinus,
  FaExpand,
} from "react-icons/fa";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const inputRef = useRef(null);
  const [outputs, setOutputs] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentScheme, setCurrentScheme] = useState("default");

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

    const interval = setInterval(() => {
      fetchTimeAndTimezone();
    }, 1000); // Update time every second

    return () => clearInterval(interval);
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
        ];
        break;
      case "clear":
        setOutputs([]);
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
          "- spotify: Redirec to iArcanic's Spotify Profile",
          "- quit or exit: Close this tab",
        ];
        break;
      case "repo":
        newOutput = ["Redirecting to repo..."];
        window.open("https://github.com/iArcanic/iarcanic.github.io", "_blank");
        break;
      case "github":
        newOutput = ["Redirecting to GitHub profile..."];
        window.open("https://github.com/iArcanic", "_blank");
        break;
      case "linkedin":
        newOutput = ["Redirecting to LinkedIn profile..."];
        window.open(
          "https://www.linkedin.com/in/preethamananthkumar/",
          "_blank"
        );
        break;
      case "spotify":
        newOutput = ["Redirecting to Spotify profile..."];
        window.open(
          "https://open.spotify.com/user/mqn5u81bu4cam0fut7hc417aa",
          "_blank"
        );
        break;
      case "quit":
      case "exit":
        newOutput = ["Goodbye!"];
        window.close();
        break;
      default:
        newOutput = [
          `zsh: command not found: '${command}'`,
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
      handleCommandSubmit(event);
    } else if (event.key === "ArrowUp") {
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
    } else if (!isNaN(event.key) && event.key >= 0 && event.key <= 9) {
      event.preventDefault();
      if (event.key >= 1 && event.key <= 5) {
        const schemeIndex = event.key - 1;
        const schemes = Object.keys(colorSchemes.light);
        setCurrentScheme(schemes[schemeIndex]);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    const matches = commands.filter((command) =>
      command.startsWith(inputValue.trim())
    );

    if (matches.length === 1) {
      setInputValue(matches[0] + " ");
    } else if (matches.length > 1) {
      setOutputs((prevOutputs) => [
        ...prevOutputs,
        { command: inputValue, output: matches },
      ]);
    }
  };

  useEffect(() => {
    hljs.highlightAll();
  }, [outputs]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const applyColorScheme = () => {
    const scheme = isDarkMode
      ? colorSchemes.dark[currentScheme]
      : colorSchemes.light[currentScheme];

    return {
      backgroundColor: scheme.background,
      color: scheme.text,
    };
  };

  const getCurrentColorScheme = () => {
    return colorSchemes[isDarkMode ? "dark" : "light"][currentScheme];
  };

  const { background, text, terminalInfo, prompt, command, result, asciiArt } =
    getCurrentColorScheme();

  const closeTab = () => {
    window.close();
  };

  const toggleFullScreen = () => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: background,
        color: text,
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      <div className="top-buttons">
        <button className="mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        {Object.keys(colorSchemes.light).map((scheme, index) => (
          <button
            key={scheme}
            className="color-scheme-toggle"
            onClick={() => setCurrentScheme(scheme)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="header-buttons">
        <button className="macos-btn close-btn" onClick={closeTab}>
          <FaTimes className="icon" />
        </button>
        <button className="macos-btn minimize-btn">
          <FaMinus className="icon" />
        </button>
        <button className="macos-btn maximize-btn" onClick={toggleFullScreen}>
          <FaExpand className="icon" />
        </button>
      </div>
      <div className="terminal-content" style={applyColorScheme()}>
        <pre className="ascii-art" style={{ color: asciiArt }}>
          {art}
        </pre>
        <div
          className="terminal-welcome"
          style={{ color: applyColorScheme().terminalInfo }}
        >
          Welcome to iArcanic's Portfolio Website!
          <br></br>
          <br />* <FaUserCircle style={{ color: terminalInfo }} />{" "}
          <span style={{ color: command }}>Preetham Ananthkumar</span>
          <br />* <FaEnvelope style={{ color: terminalInfo }} />{" "}
          <a
            href="mailto:preetham.mervin@gmail.com"
            className="terminal-link"
            style={{ color: command }}
          >
            preetham.mervin@gmail.com
          </a>
          <br />* <FaGithub style={{ color: terminalInfo }} />{" "}
          <a
            href="https://github.com/iArcanic"
            className="terminal-link"
            style={{ color: command }}
          >
            iArcanic
          </a>
          <br />* <FaLinkedin style={{ color: terminalInfo }} />{" "}
          <a
            href="https://www.linkedin.com/in/preetham-ananthkumar"
            className="terminal-link"
            style={{ color: command }}
          >
            Preetham Ananthkumar
          </a>
          <br />* <FaFilePdf style={{ color: terminalInfo }} />{" "}
          <a
            href="/path/to/resume.pdf"
            className="terminal-link"
            style={{ color: command }}
            download
          >
            Download Resume
          </a>
          <br></br>
          <br></br>
          <span style={{ color: terminalInfo }}>
            System information as of {timezone}
          </span>
        </div>

        <div className="terminal-info">
          <div className="info-line">
            <span className="info-label" style={{ color: terminalInfo }}>
              System load:
            </span>
            <span style={{ color: prompt }}>0.01</span>
            <span className="info-label" style={{ color: terminalInfo }}>
              Processes:
            </span>
            <span style={{ color: prompt }}>231</span>
          </div>
          <div className="info-line">
            <span className="info-label" style={{ color: terminalInfo }}>
              Usage of /:
            </span>
            <span style={{ color: prompt }}>68.0% of 47.41GB</span>
            <span className="info-label" style={{ color: terminalInfo }}>
              Users:
            </span>
            <span style={{ color: prompt }}>1</span>
          </div>
          <div className="info-line">
            <span className="info-label" style={{ color: terminalInfo }}>
              Memory usage:
            </span>
            <span style={{ color: prompt }}>5%</span>
            <span className="info-label" style={{ color: terminalInfo }}>
              IPv4 address:
            </span>
            <span style={{ color: prompt }}>192.168.1.89</span>
          </div>
          <div className="info-line">
            <span className="info-label" style={{ color: terminalInfo }}>
              Swap usage:
            </span>
            <span style={{ color: prompt }}>0%</span>
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
          <span>
            *** Toggle between light and dark modes with the icon at the top
            left ***
          </span>
          <br />
          <span>
            *** Use keys (1, 2, 3, 4, 5) or buttons at the top left to change
            colour scheme ***
          </span>
          <br />
          <br />
          <span style={{ color: terminalInfo }}>Last login: {timezone}</span>
          <br />
        </div>
        <br />
        <div className="output-container">
          {outputs.map((output, index) => (
            <div key={index} className="command-output">
              <div className="command" style={{ color: command }}>
                iarcanic@portfolio:~$&nbsp; {output.command}
              </div>
              {output.output.map((line, idx) => (
                <pre key={idx} className="output" style={{ color: result }}>
                  {line}
                </pre>
              ))}
            </div>
          ))}
        </div>
        <form onSubmit={handleCommandSubmit} className="terminal-prompt">
          <label htmlFor="command-input" style={{ color: prompt }}>
            iarcanic@portfolio:~$&nbsp;
          </label>
          <input
            id="command-input"
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder=""
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: text,
              width: "90%",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
