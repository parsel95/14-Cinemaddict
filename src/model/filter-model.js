import Observable from '../framework/observable';
import {FilterType} from '../const';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get = () => this.#filter;

  set = (updateType, update) => {
    this.#filter = update;
    this._notify(updateType);
  };
}
