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

export {
  formatStringToYear,
  formatMinutesToTime,
  formatStringToDate,
  formatStringToDateWithTime
};
