/**
 * @file header-profile-view.js
 * @description
 * Файл содержит реализацию класса HeaderProfileView, который отвечает за отображение профиля пользователя в шапке сайта.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения профиля, а также методы для установки данных о статусе пользователя.
 * Статус пользователя отображается в виде рейтинга, который зависит от количества просмотренных фильмов. Если пользователь не имеет статуса, рейтинг не отображается.
 */

import AbstractView from '../framework/view/abstract-view.js';

const createHeaderProfileTemplate = (userStatus) =>
  `
    <section class="header__profile profile">
      ${(userStatus !== null) ? `<p class="profile__rating">${userStatus}</p>` : ''}
      <img
        class="profile__avatar"
        src="images/bitmap@2x.png"
        alt="Avatar"
        width="35"
        height="35"
      >
    </section>
  `;

export default class HeaderProfileView extends AbstractView {
  #userStatus = null;

  constructor(userStatus) {
    super();
    this.#userStatus = userStatus;
  }

  get template() {
    return createHeaderProfileTemplate(this.#userStatus);
  }
}
