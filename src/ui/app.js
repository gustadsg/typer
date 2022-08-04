import { useCallback, useEffect, useRef, useState } from "react";
import Game from "../application/Game";

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
  const color = correct === typed ? "green" : "red";

  return <span style={{ color: typed ? color : "grey" }}>{correct}</span>;
}

function App() {
  const [gameText, setGameText] = useState("");

  const inputRef = useRef(null);
  const gameRef = useRef(
    new Game({ text: gameText, timeInSeconds: gameTimeInSeconds })
  );

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const startTime = gameRef.current.startedAt ?? new Date();
  const passedTime = (new Date() - startTime) / 1000;
  const remainigTime = (gameTimeInSeconds - passedTime).toFixed(0);

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/trending/all/day?api_key=6a5284a99c6f041ce28059355ef6484d"
    ).then((response) => {
      response.json().then((result) => {
        const randomIndex = Math.floor(Math.random() * 10);
        const numberOfOvberviews = 8;
        const randomTexts = result.results
          .slice(randomIndex, numberOfOvberviews)
          .map((movie) => movie.overview || "")
          .join("");
        setGameText(randomTexts);
      });
    });
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

  return (
    <div className="App">
      <textarea
        type="text"
        ref={inputRef}
        onChange={handleChange}
        style={{ opacity: 0 }}
      />

      {remainigTime > 0 && <p>Tempo Restante: {remainigTime}</p>}
      {remainigTime <= 0 && <p>Tempo Restante: 0</p>}

      <p>Velocidade: {gameRef.current.speed.wpm.toFixed(2)}</p>

      <div onClick={focusOnTextArea}>
        {gameText?.split("").map((correct, index) => (
          <Letter
            key={index}
            correct={correct}
            typed={gameRef.current.typed[index]}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
