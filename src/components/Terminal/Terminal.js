import React, { useState } from "react";
import "./Terminal.css";

const commands = {
  help: "Available commands: help, about-me, clear",
  "about-me": "This is a terminal-style website built with React.",
  clear: () => "",
};

const Terminal = () => {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = (event) => setInput(event.target.value);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const newOutput = [...output];
      const [cmd, ...args] = input.split(" ");
      if (commands[cmd]) {
        const result =
          typeof commands[cmd] === "function"
            ? commands[cmd](args)
            : commands[cmd];
        newOutput.push(`$ ${input}`, result);
      } else {
        newOutput.push(`$ ${input}`, `Command not found: ${cmd}`);
      }
      setOutput(newOutput);
      setInput("");
    }
  };

  return (
    <div className="terminal">
      <div className="output">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="input-line">
        <span className="prompt">$</span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;
