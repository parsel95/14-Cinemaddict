/**
 * @file films-model.js
 * @description
 * Файл содержит реализацию класса FilmsModel, который отвечает за управление данными о фильмах и взаимодействием с сервером для получения и обновления информации о фильмах.
 * Класс наследуется от Observable и предоставляет методы для получения списка фильмов, обновления данных фильма на клиенте и сервере, а также адаптации данных, полученных с сервера, к формату, используемому в приложении.
 * Метод init() выполняет асинхронную операцию по получению данных о фильмах с сервера и адаптации их к формату приложения. Методы updateOnClient() и updateOnServer() выполняют обновление данных фильма на клиенте и сервере соответственно, с обработкой ошибок при обновлении на сервере. Метод #adaptToClient() выполняет адаптацию данных, полученных с сервера, к формату, используемому в приложении.
 * Класс FilmsModel используется в приложении для хранения и управления данными о фильмах, а также для взаимодействия с сервером для получения и обновления информации о фильмах. Презентеры и представления в приложении используют методы этого класса для получения данных о фильмах и обновления их состояния при взаимодействии с пользователем.
 */

import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class FilmsModel extends Observable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const films = await this.#apiService.get();
      this.#films = films.map(this.#adaptToClient);
    } catch {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  get = () => this.#films;

  updateOnClient = async ({updateType, update, isAdapted}) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const updatedFilm = (!isAdapted)
      ? this.#adaptToClient(update)
      : update;

    this.#films = [
      ...this.#films.slice(0, index),
      updatedFilm,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, updatedFilm);
  };

  updateOnServer = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.update(update);

      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient(film) {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film['film_info'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating']
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date']
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  }
}
