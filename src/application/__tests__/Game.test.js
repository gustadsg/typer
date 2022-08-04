import Game from "../Game";

jest.useFakeTimers();

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

    it("should end game after given time", () => {
      const timeInSeconds = 10;
      const { game } = makeSUT({ timeInSeconds });
      const endGameSpy = jest.spyOn(game, "endGame");
      const setTimeoutSpy = jest.spyOn(global, "setTimeout");

      game.onType("a");
      expect(game.ended).toBe(false);

      jest.runAllTimers();

      expect(game.ended).toBe(true);
      expect(endGameSpy).toBeCalledTimes(1);
      expect(setTimeoutSpy).toBeCalledTimes(1);
      expect(setTimeoutSpy).toHaveBeenCalledWith(
        expect.any(Function),
        timeInSeconds * 1000
      );
    });

    it("should not change if onType is called after game has ended", () => {
      const { game } = makeSUT({});

      game.onType("a");
      jest.runAllTimers();
      game.onType("ab");

      expect(game.typed).toBe("a");
    });

    it("should call handleAppend on apppend", () => {
      const { game } = makeSUT({});
      const handleAppendSpy = jest.spyOn(game, "handleAppend");

      game.onType("a");

      expect(handleAppendSpy).toBeCalledTimes(1);
      expect(handleAppendSpy).toBeCalledWith("a");
    });

    it("should call handleDeletion with correct value", () => {
      const { game } = makeSUT({});
      const handleDeletionSpy = jest.spyOn(game, "handleDeletion");

      game.onType("a");

      expect(handleDeletionSpy).toBeCalledTimes(1);
    });
  });

  describe("handleAppend", () => {
    it("should append typed letter to typed internal var", () => {
      const { game } = makeSUT({});

      const typed = "a";
      game.onType(typed);

      expect(game.typed).toBe("a");
    });
  });

  describe("handleDeletion", () => {
    it("should should just replace old typed with new when deletion occours", () => {
      const { game } = makeSUT({ text: "abc" });

      game.onType("a");
      game.onType("ab");
      game.onType("a");

      expect(game.typed).toBe("a");
    });
  });

  describe("handleMistakes", () => {
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
