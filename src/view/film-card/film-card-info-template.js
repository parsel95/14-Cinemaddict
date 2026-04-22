/**
 * @file film-card-info-template.js
 * @description
 * Файл содержит реализацию функции createCardInfoTemplate, которая отвечает за генерацию шаблона для отображения информации о фильме в карточке фильма.
 * Функция принимает объект с данными о фильме и количеством комментариев, а затем возвращает строку с HTML-разметкой, которая содержит информацию о фильме, такую как название, рейтинг, год выпуска, продолжительность, жанр, постер, описание и количество комментариев.
 * В шаблоне используется вспомогательные функции formatStringToYear и formatMinutesToTime для форматирования года выпуска и продолжительности фильма соответственно.
 */

import {formatStringToYear, formatMinutesToTime} from '../../utils/film.js';

export const createCardInfoTemplate = (filmInfo, commentsLength) => {
  const {
    title, totalRating,
    release, runtime,
    genre, poster,
    description,
  } = filmInfo;

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
      <p class="film-card__description">
        ${description}
      </p>
      <span class="film-card__comments">
        ${commentsLength} comments
      </span>
    </a>`;
};

