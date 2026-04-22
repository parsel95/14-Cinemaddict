/**
 * @file main.js
 * @description
 * Главный модуль инициализации приложения.
 * Выполняет роль точки входа, в которой создаются экземпляры моделей и презентеров, а также происходит загрузка данных.
 * @see {@link FilmsPresenter} - презентер для управления списком фильмов и их деталями.
 * @see {@link FilterPresenter} - презентер для управления фильтрами.
 * @see {@link HeaderProfilePresenter} - презентер для управления профилем пользователя в шапке сайта.
 * @see {@link FooterStatisticsPresenter} - презентер для управления статистикой в подвале сайта.
 * @see {@link FilmsModel} - модель для хранения и управления данными о фильмах.
 * @see {@link CommentsModel} - модель для хранения и управления данными о комментариях к фильмам.
 * @see {@link FilterModel} - модель для хранения и управления данными о фильтрах.
 * @see {@link FilmsApiService} - сервис для взаимодействия с API по фильмам.
 * @see {@link CommentsApiService} - сервис для взаимодействия с API по комментариям.
 */

import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import HeaderProfilePresenter from './presenter/header-profile-presenter';
import FooterStatisticsPresenter from './presenter/footer-statistics-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

import FilmsApiService from './api-services/films-api-service.js';
import CommentsApiService from './api-services/comments-api-service.js';

const AUTHORIZATION = 'Basic sa191inzddtz';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/cinemaddict';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION), filmsModel);
const filterModel = new FilterModel();

const headerProfilePresenter = new HeaderProfilePresenter(siteHeaderElement, filmsModel);
const footerStatisticsPresenter = new FooterStatisticsPresenter(siteFooterStatisticsElement, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);

headerProfilePresenter.init();
footerStatisticsPresenter.init();
filterPresenter.init();
filmsPresenter.init();
filmsModel.init();
