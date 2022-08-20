export function overviewFactory(numberOfCharacters = 100) {
  return new Array(numberOfCharacters).fill("a").join("");
}

export function movieFactory(numberOfCharacters = 100) {
  return {
    overview: overviewFactory(numberOfCharacters),
  };
}

export function trendingFactory(numberOfResults = 20, numberOfMovieCharacters = 100) {
  return ({
    results: new Array(numberOfResults).fill(movieFactory(numberOfMovieCharacters)),
  });
}

export const movie = movieFactory();

export const trending = trendingFactory();
