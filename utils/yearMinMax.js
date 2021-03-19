module.exports = (year) => {
  // 1 January of the year, 0 is January
  let min = new Date(year, 0);

  // 31 December of the year, 11 is December
  let max = new Date(year, 11, 31, 23, 59);

  return {
    min, max
  }
};