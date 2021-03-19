module.exports = (day) => {
  // start of day 00:00
  let helper = new Date(day);

  let min = new Date(helper.getFullYear(), helper.getMonth(), helper.getDate());

  let copy_min = new Date(min);

  // 23:59:59
  let max = new Date(min.getTime() + 1000 * 60 * 60 * 24 - 1);

  return {
    min, max
  }
};