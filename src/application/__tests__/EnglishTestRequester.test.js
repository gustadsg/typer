import { ENGLISH_TEXT_NUMBER_OF_OVERVIEWS, ENGLISH_TEXT_URL, MAX_CHARACTERS } from "../../utils/constants";
import EnglishTestRequester from "../EnglishTextRequester";
import {
  overviewFactory, trending,
} from "../__mocks__/theMovieDb.mock";

global.fetch = jest.fn(async () => Promise.resolve({
  json: () => Promise.resolve(trending),
}));

function makeSUT() {
  return new EnglishTestRequester();
}

describe("EnglishTestRequester", () => {
  it("should create a new Requester correctly", () => {
    const sut = makeSUT();

    expect(sut).toBeInstanceOf(EnglishTestRequester);
    expect(sut.url).toBe(ENGLISH_TEXT_URL);
    expect(sut.listOfTexts).toEqual([]);
  });

  describe("getText", () => {
    it("should call getRandomTexts if listOfTexts is empty", () => {
      const sut = makeSUT();
      const getRandomTextsSpy = jest.spyOn(sut, "getRandomTexts");

      sut.getText();

      expect(getRandomTextsSpy).toBeCalledTimes(1);
    });

    it("should not call getRandomTexts if listOfTexts is not empty", () => {
      const sut = makeSUT();
      const getRandomTextsSpy = jest.spyOn(sut, "getRandomTexts");

      sut.listOfTexts = ["any_text", "any_text"];
      sut.getText();

      expect(getRandomTextsSpy).not.toBeCalled();
    });

    it("should respect max characters", async () => {
      const sut = makeSUT();
      const getRandomNumberSpy = jest.spyOn(sut, "getRandomNumber").mockReturnValueOnce(0);

      const text = await sut.getText();

      expect(getRandomNumberSpy).toBeCalledTimes(1);
      expect(typeof (text)).toBe("string");
      expect(text).toHaveLength(MAX_CHARACTERS);
    });

    it("should return correct number of characters", async () => {
      const numOfCharsPerMovie = 10;
      const numOfMovies = 20;
      const sut = makeSUT();
      jest.spyOn(sut, "getRandomNumber").mockReturnValueOnce(0);

      sut.listOfTexts = new Array(numOfMovies).fill(overviewFactory(numOfCharsPerMovie));
      const text = await sut.getText();

      const expectedLengthOfText = ENGLISH_TEXT_NUMBER_OF_OVERVIEWS * numOfCharsPerMovie;
      expect(typeof (text)).toBe("string");
      expect(text).toHaveLength(expectedLengthOfText);
    });
  });
});
