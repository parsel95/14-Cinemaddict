/**
 * @file filter-model.js
 * @description
 * Файл содержит реализацию класса FilterModel, который отвечает за управление состоянием выбранного фильтра для списка фильмов.
 * Класс наследуется от Observable и предоставляет методы для получения текущего выбранного фильтра и его обновления. При обновлении фильтра класс уведомляет всех своих наблюдателей об изменении состояния, передавая тип обновления и новый выбранный фильтр.
 * Класс FilterModel используется в приложении для хранения и управления состоянием выбранного фильтра, который влияет на отображение списка фильмов в зависимости от выбранного критерия (например, все фильмы, фильмы в списке "watchlist", просмотренные фильмы, избранные фильмы).
 */

import Observable from '../framework/observable';
import {FilterType} from '../const';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get = () => this.#filter;

  set = (updateType, update) => {
    this.#filter = update;
    this._notify(updateType);
  };
}
