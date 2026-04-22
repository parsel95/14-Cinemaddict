/**
 * @file user.js
 * @description
 * Файл содержит реализацию функции getUserStatus, которая отвечает за определение статуса пользователя на основе количества просмотренных фильмов.
 * Функция принимает массив фильмов и возвращает строку с названием статуса пользователя (Novice, Fan, Movie Buff) в зависимости от количества фильмов, которые пользователь отметил как просмотренные. Если количество просмотренных фильмов не превышает определенные пороги, функция возвращает null.
 */

import {UserStatusValue, UserStatusTitle} from '../const';

const getUserStatus = (films) => {
  const watchedFilmCount = films.filter((film) =>
    film.userDetails.alreadyWatched
  ).length;

  if (
    watchedFilmCount > UserStatusValue.NOVICE &&
    watchedFilmCount <= UserStatusValue.FAN
  ) {
    return UserStatusTitle.NOVICE;
  }

  if (
    watchedFilmCount > UserStatusValue.FAN &&
    watchedFilmCount <= UserStatusValue.MOVIE_BUFF
  ) {
    return UserStatusTitle.FAN;
  }

  if (watchedFilmCount > UserStatusValue.MOVIE_BUFF) {
    return UserStatusTitle.MOVIE_BUFF;
  }

  return null;
};

export { getUserStatus };
