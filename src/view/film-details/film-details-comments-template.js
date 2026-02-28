import {formatStringToDateWithTime} from '../../utils/film.js';
import he from 'he';

const createCommentTemplate = ({emotion, comment, author, date, id}, deletingCommentId) =>
  `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${he.encode(author)}</span>
          <span class="film-details__comment-day">${formatStringToDateWithTime(date)}</span>
          <button
            class="film-details__comment-delete"
            data-comment-id="${id}"
            ${(deletingCommentId === id) ? 'disabled' : ''}
          >
            ${(id === deletingCommentId) ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>
  `;

export const createFilmDetailsCommentsTemplate = (comments, deleteCommentId) =>
  `
    <ul class="film-details__comments-list">
      ${comments.map((comment) => createCommentTemplate(comment, deleteCommentId)).join('')}
    </ul>
  `;
