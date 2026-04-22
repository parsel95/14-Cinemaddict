import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

const createFilmExtraTemplate = (type) =>
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">
        ${(type === 'Most commented') ? 'Most commented' : 'Top rated' }
      </h2>
    </section>
  `;
export default class FilmExtraView extends AbstractStatefulView {
  #type = null;

  constructor(type) {
    super();
    this.#type = type;
  }

  get template() {
    return createFilmExtraTemplate(this.#type);
  }
}
