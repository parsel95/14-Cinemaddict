/**
 * @file const.js
 * @description
 * Файл содержит константы, используемые в различных частях приложения.
 */

const FILM_COUNT = 20;

const FILM_COUNT_PER_STEP = 5;

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const FILTER_TYPE_ALL_NAME = 'All movies';

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserStatusValue = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};

const UserStatusTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const ExtraType = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const Method = {
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export {
  FILM_COUNT,
  EMOTIONS,
  FILM_COUNT_PER_STEP,
  FILTER_TYPE_ALL_NAME,
  FilterType,
  SortType,
  UserStatusValue,
  UserStatusTitle,
  ExtraType,
  UserAction,
  UpdateType,
  Method
};
