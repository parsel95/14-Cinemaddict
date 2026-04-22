/**
 * @file film-card-controls-template.js
 * @description
 * Файл содержит реализацию функции createFilmCardControlsTemplate, которая отвечает за генерацию шаблона для отображения контролов управления фильмом в карточке фильма.
 * Функция принимает объект с данными о том, добавлен ли фильм в список "watchlist", "alreadyWatched" и "favorite". На основе этих данных формируется строка с HTML-разметкой, которая содержит блок с классом "film-card__controls" и тремя кнопками для управления фильмом. Каждая кнопка имеет класс, который указывает на ее тип (watchlist, watched, favorite) и может иметь дополнительный класс "film-card__controls-item--active", если соответствующий флаг в данных равен true.
 */

export const createFilmCardControlsTemplate = ({watchlist, alreadyWatched, favorite}) =>
  `
    <div class="film-card__controls">
      <button
        class="
          film-card__controls-item
          film-card__controls-item--add-to-watchlist
          ${(watchlist) ? 'film-card__controls-item--active' : ''}
        "
        type="button"
      >
        Add to watchlist
      </button>
      <button
        class="
          film-card__controls-item
          film-card__controls-item--mark-as-watched
          ${(alreadyWatched) ? 'film-card__controls-item--active' : ''}
        "
        type="button"
      >
        Mark as watched
      </button>
      <button
        class="
          film-card__controls-item
          film-card__controls-item--favorite
          ${(favorite) ? 'film-card__controls-item--active' : ''}
        "
        type="button"
      >
        Mark as favorite
      </button>
    </div>
  `;
