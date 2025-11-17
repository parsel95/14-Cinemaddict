import { formatStringToYear, formatMinutesToTime } from '../../utils/film.js';

export const createCardInfoTemplate = (filmInfo, commentsLength) => {
  const {
    title, totalRating, release,
    runtime, genre, poster, description } = filmInfo;

  return `
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatStringToYear(release.date)}</span>
        <span class="film-card__duration">${formatMinutesToTime(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsLength} comments</span>
    </a>`;
};

