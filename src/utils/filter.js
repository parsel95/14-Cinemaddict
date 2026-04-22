/**
 * @file filter.js
 * @description
 * Файл содержит реализацию объекта filter, который представляет собой набор функций для фильтрации массива фильмов на основе различных критериев (все фильмы, фильмы в списке "watchlist", просмотренные фильмы и избранные фильмы).
 * Каждая функция в объекте filter принимает массив фильмов и возвращает новый массив, отфильтрованный по соответствующему критерию. Например, функция для фильтрации фильмов в списке "watchlist" возвращает только те фильмы, у которых флаг watchlist установлен в true.
 */

import {FilterType} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => [...films],
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export {filter};
