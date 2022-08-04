import Game from "../Game";

global.setTimeout = jest.fn((callback, timeInMilliseconds) => {
  callback();
  return timeInMilliseconds;
});

function makeSUT({ text = "any_text", timeInSeconds = 60 }) {
  const game = new Game({
    text,
    timeInSeconds,
  });

  return { game, text, timeInSeconds };
}

describe("test", () => {
  it("should create an empty game", () => {
    const { text, game } = makeSUT({});

    expect(game.mistakes).toBe(0);
    expect(game.typed).toBe("");
    expect(game.text).toBe(text);
  });

  describe("onType", () => {
    it("should call startGame when first letter is pressed", () => {
      const { game } = makeSUT({});

      const typed = "a";
      game.onType(typed);

      expect(game.started).toBe(true);
    });
    it("should call startGame only once a game", () => {
      const { game } = makeSUT({});
      const startGameSpy = jest.spyOn(game, "startGame");

      game.onType("a");
      game.onType("");
      game.onType("a");

      expect(startGameSpy).toBeCalledTimes(1);
    });
    it("should append typed letter to typed internal var", () => {
      const { game } = makeSUT({});

      const typed = "a";
      game.onType(typed);

      expect(game.typed).toBe("a");
    });

    it("should should just replace old typed with new when deletion occours", () => {
      const { game } = makeSUT({ text: "abc" });

      game.onType("a");
      game.onType("ab");
      game.onType("a");

      expect(game.typed).toBe("a");
    });

    it("should count the mistakes", () => {
      const { game } = makeSUT({});

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

    it("should count the mistakes - consider deletion", () => {
      const { game } = makeSUT({});

      game.onType("a");
      game.onType("an");
      game.onType("any");
      game.onType("any_");
      game.onType("any_0");
      game.onType("any_00");
      game.onType("any_000");
      game.onType("any_0000");
      game.onType("any_000");
      game.onType("any_00");
      game.onType("any_0");
      game.onType("any_");
      game.onType("any_0");
      game.onType("any_00");
      game.onType("any_000");
      game.onType("any_0000");

      expect(game.mistakes).toBe(8);
    });

    it("should count the mistakes with typed bigger than text", () => {
      const { game } = makeSUT({ text: "a" });

      game.onType("a");
      game.onType("ab");

      expect(game.mistakes).toBe(1);
    });
  });
});
