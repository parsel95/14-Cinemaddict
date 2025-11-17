import {EMOTIONS} from '../../const.js';

const createEmotionItem = (emotionItem) =>
  `
    <input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotionItem}"
      value="${emotionItem}"
    >
    <label class="film-details__emoji-label" for="emoji-${emotionItem}">
      <img
        src="./images/emoji/${emotionItem}.png"
        width="30"
        height="30"
        alt="emoji"
      />
    </label>
  `;

export const createFilmDetailsFormTemplate = () =>
  `
    <form class="film-details__new-comment"  action="" method="get">
      <div class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${EMOTIONS.map(createEmotionItem).join('')}
      </div>
    </form>
  `;
