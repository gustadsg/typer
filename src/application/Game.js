export default class Game {
  constructor(text) {
    this.text = text;
    this.typed = "";
    this.mistakes = 0;
  }

  onType(letter) {
    const correctLetter = this.text[this.typed.length];
    if (correctLetter !== letter) this.mistakes += 1;
    this.typed += letter;
  }
}
