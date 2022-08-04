export default class Game {
  constructor({ text, timeInSeconds = 60 }) {
    this.text = text;
    this.typed = "";
    this.mistakes = 0;
    this.timeToEndInSeconds = timeInSeconds;
    this.started = false;
    this.ended = false;
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
}
