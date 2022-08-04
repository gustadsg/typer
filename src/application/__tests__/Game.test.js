import Game from "../Game";

describe("test", () => {
  it("should create an empty game", () => {
    const text = "any_text";
    const game = new Game(text);

    expect(game.mistakes).toBe(0);
    expect(game.typed).toBe("");
    expect(game.text).toBe(text);
  });
});
