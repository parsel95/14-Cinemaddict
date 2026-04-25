/**
 * @file films-api-service.js
 * @description
 * Файл содержит реализацию класса FilmsApiService, который отвечает за взаимодействие с сервером для получения и обновления данных о фильмах.
 * Класс наследуется от ApiService и предоставляет методы для получения списка фильмов и обновления данных фильма на сервере. Метод get() выполняет запрос к серверу для получения списка фильмов и возвращает результат в виде массива объектов. Метод update() выполняет запрос к серверу для обновления данных фильма, отправляя измененные данные в формате JSON и возвращая обновленные данные фильма после успешного обновления на сервере.
 * Класс также содержит приватный метод #adaptToServer(), который выполняет адаптацию данных фильма из формата, используемого в приложении, к формату, ожидаемому сервером при отправке данных для обновления фильма.
 * Класс FilmsApiService используется в приложении для взаимодействия с сервером при получении и обновлении данных о фильмах. Презентеры и модели в приложении используют методы этого класса для получения данных о фильмах и обновления их состояния при взаимодействии с пользователем.
 */

import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class FilmsApiService extends ApiService {
  get = () => this._load({url: 'movies'})
    .then(ApiService.parseResponse);

  update = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer(film) {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        ...film.filmInfo,
        ['alternative_title']: film.filmInfo.alternativeTitle,
        ['total_rating']: film.filmInfo.totalRating,
        ['age_rating']: film.filmInfo.ageRating,
        ['release']: {
          ...film.filmInfo.release,
          ['release_country']: film.filmInfo.release.releaseCountry,
        }
      },
      ['user_details']: {
        ...film.userDetails,
        ['already_watched']: film.userDetails.alreadyWatched,
        ['watching_date']: film.userDetails.watchingDate
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info'].release.releaseCountry;
    delete adaptedFilm['user_details'].alreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;

    return adaptedFilm;
  }
}
