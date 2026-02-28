import HeaderProfileView from '../view/header-profile-view.js';
import {getUserStatus} from '../utils/user';
import {remove, render, replace} from '../framework/render';

export default class HeaderProfilePresenter {
  #container = null;
  #headerProfileComponent = null;

  #filmsModel = null;

  #userStatus = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmsModel = filmModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#userStatus = getUserStatus(this.#filmsModel.get());

    const prevHeaderProfileComponent = this.#headerProfileComponent;

    this.#headerProfileComponent = new HeaderProfileView(this.#userStatus);

    if (prevHeaderProfileComponent === null) {
      render(this.#headerProfileComponent, this.#container);
      return;
    }

    replace(this.#headerProfileComponent, prevHeaderProfileComponent);
    remove(prevHeaderProfileComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };
}
