import { createElement } from '../../render.js';
import { createCardInfoTemplate } from './film-card-info-template.js';
import { createFilmCardControlsTemplate } from './film-card-controls-template.js';

const createNewPopupTemplate = () =>
  `
    <article class="film-card">

      ${createCardInfoTemplate()}

      ${createFilmCardControlsTemplate()}

    </article>
  `;

export default class FilmCardView {
  getTemplate() {
    return createNewPopupTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
