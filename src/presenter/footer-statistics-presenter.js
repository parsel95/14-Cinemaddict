import FooterStatisticsView from '../view/footer-statistics-view.js';
import {remove, render, replace} from '../framework/render';
import {UpdateType} from '../const.js';

export default class FooterStatisticsPresenter {
  #container = null;
  #footerStatisticsComponent = null;

  #filmsModel = null;

  #filmCount = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmsModel = filmModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#filmCount = this.#filmsModel.get().length;

    const prevFooterStatisticsComponent = this.#footerStatisticsComponent;

    this.#footerStatisticsComponent = new FooterStatisticsView(this.#filmCount);

    if (prevFooterStatisticsComponent === null) {
      render(this.#footerStatisticsComponent, this.#container);
      return;
    }

    replace(this.#footerStatisticsComponent, prevFooterStatisticsComponent);
    remove(prevFooterStatisticsComponent);
  }

  #modelEventHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
