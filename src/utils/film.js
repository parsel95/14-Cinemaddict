import dayjs from 'dayjs';

/**
 * Преобразует строку с датой в год
 * @param {string} date - Строка с датой в формате ISO или другом поддерживаемом формате
 * @returns {number} Год из переданной даты
 *
 * @example
 * formatStringToYear('2023-12-18T10:30:00.000Z'); // 2023
 * formatStringToYear('1995-05-15'); // 1995
 */
const formatStringToYear = (date) =>
  new Date(date).getFullYear();

/**
 * Преобразует минуты в форматированное время (часы и минуты)
 * @param {number} minutes - Количество минут
 * @returns {string} Время в формате "ЧЧч ММм"
 *
 * @example
 * formatMinutesToTime(90); // "1ч 30м"
 * formatMinutesToTime(45); // "0ч 45м"
 */
const formatMinutesToTime = (minutes) => {
  const MINUTES_PER_HOUR = 60;

  return (minutes < MINUTES_PER_HOUR)
    ? `${minutes}m`
    : `${Math.floor(minutes / MINUTES_PER_HOUR)}h ${minutes % MINUTES_PER_HOUR}m`;
};

/** Преобразует строку с датой в форматированную дату в формате "DD Month YYYY"
 * @param {string} date - Строка с датой в формате ISO или другом поддерживаемом формате
 * @returns {string} Дата в формате "DD Month YYYY"
 *
 * @example
 * formatStringToDate('2023-12-18T10:30:00.000Z'); // "18 December 2023"
 * formatStringToDate('1995-05-15'); // "15 May 1995"
 */
const formatStringToDate = (date) =>
  new Date(date).toLocaleString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'});

/**
 * Преобразует строку с датой в форматированную дату и время в формате "DD/MM/YYYY, HH:MM"
 * @param {string} date - Строка с датой в формате ISO или другом поддерживаемом формате
 * @returns {string} Дата и время в формате "DD/MM/YYYY, HH:MM"
 *
 * @example
 * formatStringToDateWithTime('2023-12-18T10:30:00.000Z'); // "18/12/2023, 10:30"
 * formatStringToDateWithTime('1995-05-15T14:45:00'); // "15/05/1995, 14:45"
 */
const formatStringToDateWithTime = (date) =>
  new Date(date).toLocaleString('en-GB');

/** Вспомогательная функция для сортировки фильмов по дате с учётом возможных null значений
 * @param {string|null} dateA - Дата первого фильма в формате ISO или null
 * @param {string|null} dateB - Дата второго фильма в формате ISO или null
 * @returns {number|null} Вес для сортировки или null, если оба значения не null
 *
 * @example
 * getWeightForNullDate(null, '2023-12-18T10:30:00.000Z'); // 1
 * getWeightForNullDate('1995-05-15', null); // -1
 * getWeightForNullDate(null, null); // 0
 * getWeightForNullDate('2023-12-18T10:30:00.000Z', '1995-05-15'); // null
 */
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

/** Сортирует фильмы по дате выпуска
 * @param {Object} filmA - Первый фильм для сравнения
 * @param {Object} filmB - Второй фильм для сравнения
 * @returns {number} Результат сравнения для сортировки
 *
 * @example
 * sortFilmsByDate(filmA, filmB); // возвращает положительное число, отрицательное число или 0
 */
const sortFilmsByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

/** Сортирует фильмы по рейтингу
 * @param {Object} filmA - Первый фильм для сравнения
 * @param {Object} filmB - Второй фильм для сравнения
 * @returns {number} Результат сравнения для сортировки
 *
 * @example
 * sortFilmsByRating(filmA, filmB); // возвращает положительное число, отрицательное число или 0
 */
const sortFilmsByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {
  formatStringToYear,
  formatMinutesToTime,
  formatStringToDate,
  formatStringToDateWithTime,
  sortFilmsByDate,
  sortFilmsByRating
};
