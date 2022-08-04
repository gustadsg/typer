export default class Game {
  constructor(text) {
    this.text = text;
    this.typed = "";
    this.mistakes = 0;
  }

  onType(newTyped) {
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
}
