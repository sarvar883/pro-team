module.exports = (days) => {
  // 00:00 of the first day
  let day0 = new Date(days[0]);
  let min = new Date(day0.getFullYear(), day0.getMonth(), day0.getDate());

  // get the last day
  let day6 = new Date(days[6]);
  let helper = new Date(day6.getFullYear(), day6.getMonth(), day6.getDate());

  // 23:59:59 of the last day
  let max = new Date(helper.setTime(helper.getTime() + 1000 * 60 * 60 * 24 - 1));

  return {
    min, max
  }
};