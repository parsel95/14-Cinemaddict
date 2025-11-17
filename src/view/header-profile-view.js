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
