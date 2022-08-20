import { ENGLISH_TEXT_NUMBER_OF_OVERVIEWS, ENGLISH_TEXT_URL, MAX_CHARACTERS } from "../utils/constants";

export default class EnglishTextRequester {
  constructor() {
    this.url = ENGLISH_TEXT_URL;
    this.listOfTexts = [];
  }

  async getText() {
    if (!this.listOfTexts.length) {
      await this.getRandomTexts();
    }

    const randomIndex = this.getRandomNumber();
    return this.listOfTexts
      .slice(randomIndex, ENGLISH_TEXT_NUMBER_OF_OVERVIEWS)
      .join("")
      .split("")
      .splice(0, MAX_CHARACTERS)
      .join("");
  }

  async getRandomTexts() {
    const movies = await this.getTrendingMovies();
    this.listOfTexts = movies.results
      .filter((movie) => movie.overview)
      .map((movie) => movie.overview);
  }

  async getTrendingMovies() {
    const response = await fetch(this.url);
    return response.json();
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 10);
  }
}
