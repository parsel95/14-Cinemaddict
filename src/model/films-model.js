import { generateFilms } from '../mock/film.js';

export default class FilmsModel {
  #films = generateFilms();

  get = () => this.#films;
}
