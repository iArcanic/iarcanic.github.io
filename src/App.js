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
  FaDiscord,
  FaSpotify,
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
  const [stats, setStats] = useState({
    publicRepos: 0,
    followers: 0,
    following: 0,
    totalStars: 0,
    totalForks: 0,
    accountCreationDate: "",
    totalCommits: 0,
  });

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
          "> Hi, I'm Preetham (or iArcanic)",
          "> I'm currently a third year student at the University of Warwick studying Cybersecurity (BSc)",
          "> I love martial arts, playing badminton, and going gym",
          "> I also love to read manga, most notably: Berserk, Vagabond, and Vinland Saga",
          "> Most importantly, I'm a Christian, and I love Jesus Christ! AVE CHRISTUS REX!",
        ];
        break;
      case "clear":
        setOutputs([]);
        return;
      case "help":
        newOutput = [
          "Available commands:",
          "- help: Display this help message",
          "- clear: Clear the terminal screen",
          "- about: Display information about iArcanic",
          "- repo: Redirect to this website's GitHub repository (iarcanic/iarcanic.github.io)",
          "- github: Redirect to iArcanic's GitHub Profile (iArcanic)",
          "- linkedin: Redirect to iArcanic's LinkedIn Profile (preetham-a-1810781b1)",
          "- resume: Download iArcanic's resume as a PDF",
          "- discord: Redirect to iArcanic's Discord Profile (_preet_)",
          "- spotify: Redirect to iArcanic's Spotify Profile (P r x x t;)",
          "- sudo rm -rf /*: Delete the root directory and wipe out the system entierly (Uhhhh please don't try this command...)",
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
      case "resume":
        newOutput = ["Downloading resume..."];
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "preetham-ananthkumar-resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case "spotify":
        newOutput = ["Redirecting to Spotify profile..."];
        window.open(
          "https://open.spotify.com/user/mqn5u81bu4cam0fut7hc417aa",
          "_blank"
        );
        break;
      case "discord":
        newOutput = ["Redirecting to Discord profile..."];
        window.open("https://discord.gg/8KgcEmtM", "_blank");
        break;
      case "quit":
        newOutput = ["Goodbye!"];
        window.close();
        break;
      case "exit":
        newOutput = ["Goodbye!"];
        window.close();
        break;
      case "sudo rm -rf /*":
        newOutput = [
          "I told you not to do that, didn't I... •`_´•",
          "I warned you...",
          "zsh: cannot remove '/': Operation not permitted",
          "zsh: cannot remove '/*': Operation not permitted",
        ];
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
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

  const { background, text, terminalInfo, prompt, command, result } =
    getCurrentColorScheme();

  const handleSchemeChange = (colorScheme) => {
    setCurrentScheme(colorScheme);
  };

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userUrl = `https://api.github.com/users/iArcanic`;
        const reposUrl = `https://api.github.com/users/iArcanic/repos?per_page=100`;

        // Fetch user stats
        const userResponse = await fetch(userUrl);
        const userData = await userResponse.json();

        // Fetch repositories stats
        const reposResponse = await fetch(reposUrl);
        const reposData = await reposResponse.json();

        // Calculate total stars, forks, and commits
        let totalStars = 0;
        let totalForks = 0;
        let totalCommits = 0;

        for (const repo of reposData) {
          totalStars += repo.stargazers_count;
          totalForks += repo.forks_count;

          // Fetch the number of commits for each repo
          const commitsUrl = `https://api.github.com/repos/iArcanic/${repo.name}/commits?per_page=1`;
          const commitsResponse = await fetch(commitsUrl);

          if (commitsResponse.headers.get("link")) {
            const commitCount = parseInt(
              commitsResponse.headers
                .get("link")
                .match(/&page=(\d+)>; rel="last"/)[1]
            );
            totalCommits += commitCount;
          } else {
            // If there's no 'link' header, it means there are fewer commits and we need to fetch all commits
            const commitsData = await commitsResponse.json();
            totalCommits += commitsData.length;
          }
        }

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars: totalStars,
          totalForks: totalForks,
          accountCreationDate: new Date(
            userData.created_at
          ).toLocaleDateString(),
          totalCommits: totalCommits,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      }
    };

    fetchStats();
  }, []); // Adding an empty dependency array to run useEffect only once

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
        <pre className="ascii-art bold-glow" style={{ color: command }}>
          {art}
        </pre>
        <div
          className="terminal-welcome"
          style={{ color: applyColorScheme().terminalInfo }}
        >
          <span style={{ color: prompt }}>
            Welcome to iArcanic's Portfolio Website!
          </span>
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
            href="/resume.pdf"
            className="terminal-link"
            style={{ color: command }}
            download="preetham-ananthkumar-resume.pdf"
          >
            Download Resume
          </a>
          <br />* <FaDiscord style={{ color: terminalInfo }} />{" "}
          <a
            href="https://discord.gg/8KgcEmtM"
            className="terminal-link"
            style={{ color: command }}
          >
            _preet_
          </a>
          <br />* <FaSpotify style={{ color: terminalInfo }} />{" "}
          <a
            href="https://open.spotify.com/user/mqn5u81bu4cam0fut7hc417aa"
            className="terminal-link"
            style={{ color: command }}
          >
            P r x x t;
          </a>
          <br></br>
          <br></br>
          <span style={{ color: terminalInfo }}>
            System information as of {timezone}
          </span>
        </div>

        <div className="terminal-info">
          <div className="info-line">
            <a
              href="https://github.com/iArcanic?tab=repositories"
              className="terminal-link info-label"
              style={{ color: terminalInfo }}
            >
              Public repos:
            </a>
            <span style={{ color: prompt }}>{stats.publicRepos}</span>
            <a
              href="https://github.com/iArcanic?tab=followers"
              className="terminal-link info-label"
              style={{ color: terminalInfo }}
            >
              Followers:
            </a>
            <span style={{ color: prompt }}>{stats.followers}</span>
          </div>
          <div className="info-line">
            <a
              href="https://github.com/iArcanic?tab=followers"
              className="terminal-link info-label"
              style={{ color: terminalInfo }}
            >
              Following:
            </a>
            <span style={{ color: prompt }}>{stats.following}</span>
            <span className="info-label" style={{ color: terminalInfo }}>
              Total stars:
            </span>
            <span style={{ color: prompt }}>{stats.totalStars}</span>
          </div>
          <div className="info-line">
            <span className="info-label" style={{ color: terminalInfo }}>
              Total forks:
            </span>
            <span style={{ color: prompt }}>{stats.totalForks}</span>
            <span className="info-label" style={{ color: terminalInfo }}>
              Total commits:
            </span>
            <span style={{ color: prompt }}>{stats.totalCommits}</span>
          </div>
          <div className="info-line">
            <span className="info-label" style={{ color: terminalInfo }}>
              Creation date:
            </span>
            <span style={{ color: prompt }}>{stats.accountCreationDate}</span>
          </div>
          <br />
          <div>
            <span>
              *** Type{" "}
              <span className="bold-glow" style={{ color: command }}>
                'help'
              </span>{" "}
              for a list of all available commands ***
            </span>
            <br />
            <span>
              *** Type{" "}
              <span className="bold-glow" style={{ color: command }}>
                'repo'
              </span>{" "}
              to view the GitHub repository or click{" "}
              <a
                href="https://github.com/iArcanic/iarcanic.github.io"
                className="terminal-link"
                download
              >
                <span className="bold-glow" style={{ color: command }}>
                  'here'
                </span>
              </a>{" "}
              ***
            </span>
            <br />
            <span>
              *** Toggle between{" "}
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={toggleDarkMode}
              >
                light
              </span>{" "}
              and{" "}
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={toggleDarkMode}
              >
                dark
              </span>{" "}
              modes with the icon at the top left ***
            </span>
            <br />
            <span>
              *** Use keys (
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={() => handleSchemeChange("default")}
              >
                1
              </span>
              ,{" "}
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={() => handleSchemeChange("monokai")}
              >
                2
              </span>
              ,{" "}
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={() => handleSchemeChange("gruvbox")}
              >
                3
              </span>
              ,{" "}
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={() => handleSchemeChange("solarized")}
              >
                4
              </span>
              ,{" "}
              <span
                className="bold-glow terminal-link"
                style={{ color: command }}
                onClick={() => handleSchemeChange("dracula")}
              >
                5
              </span>
              ) or buttons at the top left to change colour scheme ***
            </span>
            <br />
            <span>
              *** Use{" "}
              <span className="bold-glow" style={{ color: command }}>
                [ARROW UP]
              </span>
              ,{" "}
              <span className="bold-glow" style={{ color: command }}>
                [ARROW DOWN]
              </span>
              ,{" "}
              <span className="bold-glow" style={{ color: command }}>
                [TAB]
              </span>
              ,{" "}
              <span className="bold-glow" style={{ color: command }}>
                [CTRL+A]
              </span>
              ,{" "}
              <span className="bold-glow" style={{ color: command }}>
                [CTRL+E]
              </span>
              , and{" "}
              <span className="bold-glow" style={{ color: command }}>
                [CTRL+U]
              </span>{" "}
              key shortcuts ***
            </span>
            <br />
            <span>
              *** Use the top left window controls to{" "}
              <span className="bold-glow" style={{ color: command }}>
                close (red)
              </span>{" "}
              or{" "}
              <span className="bold-glow" style={{ color: command }}>
                maximise (green)
              </span>{" "}
              the window ***
            </span>
          </div>
          <br />
          <br />
          <span style={{ color: terminalInfo }}>Last login: {timezone}</span>
          <br />
        </div>
        <br />
        <div className="output-container">
          {outputs.map((output, index) => (
            <div key={index} className="command-input">
              <div className="command" style={{ color: prompt }}>
                iarcanic@portfolio:~$ {output.command}
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
