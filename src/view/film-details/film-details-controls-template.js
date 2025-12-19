export const createDeatailsControlsTemplate = ({watchlist, alreadyWatched, favorite}) =>
  `<section class="film-details__controls">
    <button
      class="
      film-details__control-button
      film-details__control-button--watchlist
      ${(watchlist) ? 'film-details__control-button--active' : ''}
      "
      id="watchlist"
      name="watchlist"
      type="button"
    >
      Add to watchlist
    </button>
    <button
      class="
        film-details__control-button
        film-details__control-button--watched
        ${(alreadyWatched) ? 'film-details__control-button--active' : ''}
      "
      id="watched"
      name="watched"
      type="button"
    >
      Already watched
    </button>
    <button
      class="
        film-details__control-button
        film-details__control-button--favorite
        ${(favorite) ? 'film-details__control-button--active' : ''}
      "
      id="favorite"
      name="favorite"
      type="button"
    >
      Add to favorites
    </button>
  </section>`;
