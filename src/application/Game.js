export default class Game {
  constructor({ text, timeInSeconds = 60 }) {
    this.text = text;
    this.typed = "";
    this.mistakes = 0;
    this.timeToEndInSeconds = timeInSeconds;
    this.ended = false;
  }

  onType(newTyped) {
    if (this.typed.length === 0) this.startGame();

    if (newTyped.length < this.typed.length) {
      this.typed = newTyped;
      return;
    }

    const letterPosition = this.typed.length;
    const correctLetter = this.text[letterPosition];
    const typedLetter = newTyped[letterPosition];
    if (correctLetter !== typedLetter) this.mistakes += 1;
    this.typed += typedLetter;
  }

  startGame() {
    setTimeout(() => {
      this.endGame();
    }, this.timeToEndInSeconds * 1000);
  }

  endGame() {
    this.ended = true;
  }
}
