import { getRandomInteger, getRandomValue } from '../utils/common.js';
import {
  SCRIPTWRITERS_COUNT, ACTORS_COUNT, MAX_COMMENTS_ON_FILM,
  Raiting, AgeRating, YearsDuration, DaysDuration, DateType, Runtime, GenreCount,
  titles, names, surnames, posters, countries, genres, description
} from './const.js';
import { FILM_COUNT } from '../const.js';

const getDate = (type) => {
  const date = new Date();

  switch (type) {
    case DateType.FILM_INFO:
      date.setFullYear(
        date.getFullYear() - getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
      );
      break;
    case DateType.USER_DETAILS:
      date.setDate(
        date.getDate() - getRandomInteger(DaysDuration.MIN, DaysDuration.MAX)
      );
      break;
  }

  return date.toISOString();
};

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(titles),
  totalRating: getRandomInteger(Raiting.MIN, Raiting.MAX),
  poster: getRandomValue(posters),
  ageRating: getRandomInteger(AgeRating.MIN, AgeRating.MAX),
  director: `${getRandomValue(names)} ${getRandomValue(surnames)}`,
  scriptwriters: Array.from({ length: SCRIPTWRITERS_COUNT }, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  actors: Array.from({ length: ACTORS_COUNT }, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  release: {
    date: getDate(DateType.FILM_INFO),
    releaseСountry: getRandomValue(countries)
  },
  runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
  genre: Array.from({ length: getRandomInteger(GenreCount.MIN, GenreCount.MAX) }, () => getRandomValue(genres)),
  description: getRandomValue(description),
});

export const generateFilms = () => {
  const films = Array.from({ length: FILM_COUNT }, generateFilm);

  let totalCommentsCount = 0;

  const getWatcingDate = () => getDate(DateType.USER_DETAILS);

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);

    const filmCommentsCount = (hasComments)
      ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
      : 0;

    totalCommentsCount += filmCommentsCount;

    const alreadyWatched = Boolean(getRandomInteger(0, 1));

    return {
      id: String(index + 1),
      comments: (hasComments)
        ? Array.from(
          { length: filmCommentsCount },
          (_value, commentIndex) => String(totalCommentsCount - commentIndex)
        )
        : [],
      filmInfo: film,
      userDetails: {
        watchlist: Boolean(getRandomInteger(0, 1)),
        alreadyWatched,
        watchingDate: (alreadyWatched) ? getWatcingDate() : null,
        favorite: Boolean(getRandomInteger(0, 1)),
      },
    };
  });
};

