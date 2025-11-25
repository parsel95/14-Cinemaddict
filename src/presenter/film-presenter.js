import FilmCardView from '../view/film-card/film-card-view.js';

export default class FilmPresenter {
  #renderFilm = (film, container) => {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.setCardClickHandler(() => {
      this.#addFilmDetailsComponent(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    render (filmCardComponent, container.element);
  };
};

