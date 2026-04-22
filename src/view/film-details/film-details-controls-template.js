/**
 * @file film-details-controls-template.js
 * @description
 * Файл содержит реализацию функции createFilmDetailsControlsTemplate, которая отвечает за генерацию шаблона для отображения контролов управления фильмом в подробной информации о фильме.
 * Функция принимает объект с данными о том, добавлен ли фильм в список "watchlist", "alreadyWatched" и "favorite". На основе этих данных формируется строка с HTML-разметкой, которая содержит секцию с классом "film-details__controls" и тремя кнопками для управления фильмом. Каждая кнопка имеет класс, который указывает на ее тип (watchlist, watched, favorite) и может иметь дополнительный класс "film-details__control-button--active", если соответствующий флаг в данных равен true.
 */

export const createFilmDetailsControlsTemplate = ({watchlist, alreadyWatched, favorite}) =>
  `
    <section class="film-details__controls">
      <button
        type="button"
        class="
          film-details__control-button
          film-details__control-button--watchlist
          ${(watchlist) ? 'film-details__control-button--active' : ''}
        "
        id="watchlist"
        name="watchlist"
      >
        Add to watchlist
      </button>
      <button
        type="button"
        class="
          film-details__control-button
          film-details__control-button--watched
          ${(alreadyWatched) ? 'film-details__control-button--active' : ''}
        "
        id="watched"
        name="watched"
      >
        Already watched
      </button>
      <button
        type="button"
        class="
          film-details__control-button
          film-details__control-button--favorite
          ${(favorite) ? 'film-details__control-button--active' : ''}
        "
        id="favorite"
        name="favorite"
      >
        Add to favorites
      </button>
    </section>
  `;
