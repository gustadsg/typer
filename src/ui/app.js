import { useCallback, useEffect, useRef, useState } from "react";
import Game from "../application/Game";
import EnglishTextRequester from "../application/EnglishTextRequester";

import "./app.css";

const gameTimeInSeconds = 30;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Letter({ correct, typed }) {
  const color = correct === typed ? "text-correct" : "text-wrong";

  return <span className={typed ? color : "text-default"}>{correct}</span>;
}

function App() {
  const [gameText, setGameText] = useState("");

  const inputRef = useRef(null);
  const gameRef = useRef(
    new Game({ text: gameText, timeInSeconds: gameTimeInSeconds })
  );
  const textRequester = useRef(new EnglishTextRequester());

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const startTime = gameRef.current.startedAt ?? new Date();
  const passedTime = (new Date() - startTime) / 1000;
  const remainigTime = (gameTimeInSeconds - passedTime).toFixed(0);

  async function fetchAndSetText() {
    const text = await textRequester.current.getText();
    setGameText(text);
  }

  useEffect(() => {
    fetchAndSetText();
  }, []);

  useInterval(() => {
    const shouldReload =
      !gameRef.current.ended && Boolean(gameRef.current.startedAt);
    if (shouldReload) {
      forceUpdate();
      gameRef.current.getTypingSpeed();
    }
  }, 1000);

  function handleChange(event) {
    event.preventDefault();
    if (gameRef.current.ended) inputRef.current.value = gameRef.current.typed;
    gameRef.current.onType(event.target.value);
    forceUpdate();
  }

  function focusOnTextArea() {
    inputRef.current.focus();
  }

  async function replay() {
    inputRef.current.value = "";
    await fetchAndSetText();
    gameRef.current = new Game({
      text: gameText,
      timeInSeconds: gameTimeInSeconds,
    });
  }

  return (
    <div className="App">
      <textarea
        type="text"
        ref={inputRef}
        onChange={handleChange}
        style={{ opacity: 0, height: 0, width: 0 }}
      />

      {remainigTime > 0 && <p>Tempo Restante: {remainigTime}</p>}
      {remainigTime <= 0 && <p>Tempo Restante: 0</p>}

      <p>Velocidade: {gameRef.current.speed.wpm.toFixed(2)}</p>

      <div className="text-container" onClick={focusOnTextArea}>
        {gameText?.split("").map((correct, index) => (
          <Letter
            key={index}
            correct={correct}
            typed={gameRef.current.typed[index]}
          />
        ))}
      </div>
      <button className="replay-btn" onClick={replay}>
        replay
      </button>
    </div>
  );
}

export default App;
