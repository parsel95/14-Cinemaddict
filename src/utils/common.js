/**
 * Случайное целое число в диапазоне
 * @param {number} [a=0] - Минимум
 * @param {number} [b=1] - Максимум
 * @returns {number} Случайное число от min до max включительно
 *
 * @example
 * getRandomInteger(1, 5); // 1, 2, 3, 4 или 5
 * getRandomInteger(5, 1); // тоже 1, 2, 3, 4 или 5
 */
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Возвращает случайный элемент из массива
 * @param {Array} items - Массив элементов
 * @returns {*} Случайный элемент массива
 *
 * @example
 * getRandomValue(['a', 'b', 'c']); // 'a', 'b' или 'c'
 */
const getRandomValue = (items) =>
  items[getRandomInteger(0, items.length - 1)];


export {
  getRandomInteger,
  getRandomValue,
};
