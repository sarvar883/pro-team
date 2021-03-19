module.exports = (month, year) => {
  let min = new Date(year, month);

  // copy of min
  let copy_min = new Date(year, month);

  let max = new Date(copy_min.setMonth(copy_min.getMonth() + 1));

  return {
    min, max
  }
};