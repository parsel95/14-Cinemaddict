import AbstractView from '../../framework/view/abstract-view';

const createFilmListLoadingViewTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`
);

export default class FilmListLoadingView extends AbstractView {
  get template () {
    return createFilmListLoadingViewTemplate();
  }
}
