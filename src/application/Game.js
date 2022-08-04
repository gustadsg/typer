import {
  ONE_MINUTE_IN_SECONDS,
  ONE_SECOND_IN_MILLISECONDS,
} from "../utils/constants";

export default class Game {
  constructor({ text, timeInSeconds = ONE_MINUTE_IN_SECONDS }) {
    this.text = text;
    this.typed = "";
    this.mistakes = 0;
    this.timeToEndInSeconds = timeInSeconds;
    this.ended = false;
    this.startedAt = null;
    this.speed = { lpm: 0, wpm: 0 };
  }

  onType(newTyped) {
    if (this.ended) return;
    if (!this.startedAt) this.startGame();
    const isDeletion = this.handleDeletion(newTyped);
    if (isDeletion) return;

    this.handleAppend(newTyped);
    this.getTypingSpeed();
  }

  startGame() {
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
    if (!charsTyped) {
      this.speed = { lpm: 0, wpm: 0 };
      return;
    }
    const timePassedInSeconds =
      (new Date() - this.startedAt) / ONE_SECOND_IN_MILLISECONDS;
    const cleanTyped = this.typed.replace(/\s/g, "");
    const lpm =
      (cleanTyped.length / timePassedInSeconds) * ONE_MINUTE_IN_SECONDS;

    const wordsTyped = this.typed.split(" ").length;
    const wpm = (wordsTyped / timePassedInSeconds) * ONE_MINUTE_IN_SECONDS;

    this.speed = { lpm, wpm };
  }
}
