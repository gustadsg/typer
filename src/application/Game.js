import {
  ONE_MINUTE_IN_SECONDS,
  ONE_SECOND_IN_MILLISECONDS,
} from "../utils/constants";

export default class Game {
  constructor({ text, timeInSeconds = 60 }) {
    this.text = text;
    this.typed = "";
    this.mistakes = 0;
    this.timeToEndInSeconds = timeInSeconds;
    this.started = false;
    this.ended = false;
    this.startedAt = null;
  }

  onType(newTyped) {
    if (this.ended) return;
    if (!this.started) this.startGame();
    const isDeletion = this.handleDeletion(newTyped);
    if (isDeletion) return;

    this.handleAppend(newTyped);
  }

  startGame() {
    this.started = true;
    this.startedAt = new Date();
    setTimeout(() => {
      this.endGame();
    }, this.timeToEndInSeconds * 1000);
  }

  endGame() {
    this.ended = true;
  }

  handleDeletion(newTyped) {
    if (newTyped.length < this.typed.length) {
      this.typed = newTyped;
      return true;
    }
    return false;
  }

  handleAppend(newTyped) {
    const letterPosition = this.typed.length;
    const correctLetter = this.text[letterPosition];
    const typedLetter = newTyped[letterPosition];
    this.handleMistakes({ typedLetter, correctLetter });
    this.typed += typedLetter;
  }

  handleMistakes({ typedLetter, correctLetter }) {
    if (correctLetter !== typedLetter) this.mistakes += 1;
  }

  getTypingSpeed() {
    const charsTyped = this.typed.length;
    if (!charsTyped) return { lpm: 0, wpm: 0 };

    const timePassedInSeconds =
      (new Date() - this.startedAt) / ONE_SECOND_IN_MILLISECONDS;
    const cleanTyped = this.typed.replace(/\s/g, "");
    const lpm =
      (cleanTyped.length / timePassedInSeconds) * ONE_MINUTE_IN_SECONDS;

    const wordsTyped = this.typed.split(" ").length;
    const wpm = (wordsTyped / timePassedInSeconds) * ONE_MINUTE_IN_SECONDS;

    return { lpm, wpm };
  }
}
