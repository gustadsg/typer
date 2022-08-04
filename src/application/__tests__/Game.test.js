import Game from "../Game";

describe("test", () => {
  it("should create an empty game", () => {
    const text = "any_text";
    const game = new Game(text);

    expect(game.mistakes).toBe(0);
    expect(game.typed).toBe("");
    expect(game.text).toBe(text);
  });

  describe("onType", () => {
    it("should append typed letter to typed internal var", () => {
      const text = "any_text";
      const game = new Game(text);

      const typed = "a";
      game.onType(typed);

      expect(game.typed).toBe("a");
    });

    it("should count the mistakes", () => {
      const text = "any_text";
      const game = new Game(text);

      game.onType("a");
      game.onType("an");
      game.onType("any");
      game.onType("any_");
      game.onType("any_0");
      game.onType("any_00");
      game.onType("any_000");
      game.onType("any_0000");

      expect(game.mistakes).toBe(4);
    });
  });
});
