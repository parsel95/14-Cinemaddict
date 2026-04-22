/**
 * @file film-details-form-template.js
 * @description
 * Файл содержит реализацию функции createFilmDetailsFormTemplate, которая отвечает за генерацию шаблона для отображения формы добавления нового комментария к фильму.
 * Функция принимает данные о выбранной эмоции, тексте комментария, а также флагах, указывающих на наличие ошибки загрузки комментария и состояние блокировки формы. На основе этих данных формируется строка с HTML-разметкой, которая содержит форму для добавления нового комментария, включая выбор эмоции и текстовое поле для ввода комментария. В зависимости от состояния загрузки комментария и блокировки формы, отображается соответствующее сообщение или форма может быть отключена.
 */

import {EMOTIONS} from '../../const.js';

const createEmotionItem = (emotionItem, checkedEmotionValue) =>
  `
    <input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotionItem}"
      value="${emotionItem}"
      ${emotionItem === checkedEmotionValue ? 'checked' : ''}
    >
    <label
      class="film-details__emoji-label"
      for="emoji-${emotionItem}"
      data-emotion-type=${emotionItem}
    >
      <img
        src="./images/emoji/${emotionItem}.png"
        width="30"
        height="30"
        alt="emoji"
      />
    </label>
  `;

export const createFilmDetailsFormTemplate = (checkedEmotion, comment, isCommentLoadingError, isDisabled) =>
  `
    <form
      class="film-details__new-comment"
      action=""
      method="get"
      ${(isCommentLoadingError || isDisabled) ? 'style="opacity: 20%" disabled' : ''}
    >
      <div class="film-details__add-emoji-label">
      ${(checkedEmotion) ? `<img src="images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji-${checkedEmotion}">` : ''}
      </div>

      <label class="film-details__comment-label">
        <textarea
          class="film-details__comment-input"
          placeholder="Select reaction below and write comment here"
          name="comment"
          ${(isCommentLoadingError || isDisabled) ? 'disabled' : ''}
        >${(comment) ? comment : ''}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${EMOTIONS.map((emotion) => createEmotionItem(emotion, checkedEmotion)).join('')}
      </div>
    </form>
  `;
