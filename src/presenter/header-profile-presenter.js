/**
 * @file header-profile-presenter.js
 * @description
 * Файл содержит реализацию класса HeaderProfilePresenter, который отвечает за управление профилем пользователя в шапке сайта.
 * Класс взаимодействует с моделью фильмов для получения данных о статусе пользователя и отображения его профиля в шапке сайта. При изменении данных в модели фильмов, презентер обновляет отображение профиля пользователя.
  * В конструкторе класса принимаются контейнер для отображения профиля и модель фильмов. Презентер добавляет себя в качестве наблюдателя к модели фильмов, чтобы реагировать на изменения данных и обновлять профиль пользователя соответственно.
  * Метод init отвечает за инициализацию профиля пользователя, определение его статуса на основе данных модели фильмов и отображение профиля в шапке сайта. Метод #modelEventHandler вызывается при изменении данных в модели фильмов и инициирует обновление профиля пользователя.
  * Для определения статуса пользователя используется функция getUserStatus, которая принимает массив фильмов и возвращает строку с названием статуса пользователя (Novice, Fan, Movie Buff) в зависимости от количества фильмов, которые пользователь отметил как просмотренные. Если количество просмотренных фильмов не превышает определенные пороги, функция возвращает null, и рейтинг пользователя не отображается.
  * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонента профиля пользователя в шапке сайта. При первом отображении компонента используется метод render, а при последующих обновлениях используется метод replace для замены старого компонента новым, и метод remove для удаления старого компонента из DOM.
 */

import HeaderProfileView from '../view/header-profile-view.js';
import {getUserStatus} from '../utils/user';
import {remove, render, replace} from '../framework/render';

export default class HeaderProfilePresenter {
  #container = null;
  #headerProfileComponent = null;

  #filmsModel = null;

  #userStatus = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmsModel = filmModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#userStatus = getUserStatus(this.#filmsModel.get());

    const prevHeaderProfileComponent = this.#headerProfileComponent;

    this.#headerProfileComponent = new HeaderProfileView(this.#userStatus);

    if (prevHeaderProfileComponent === null) {
      render(this.#headerProfileComponent, this.#container);
      return;
    }

    replace(this.#headerProfileComponent, prevHeaderProfileComponent);
    remove(prevHeaderProfileComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };
}
