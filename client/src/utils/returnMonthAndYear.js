// this function returns month and year 
// month: as a number 0-January; and 11 - December
// year as a number YYYY
// param is a string, possible values - 'previous' and 'current'
const returnMonthAndYear = (param) => {
  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();

  // if previous month
  if (param === 'previous') {
    if (month === 0) {
      month = 11;
      year -= 1;
    } else {
      month -= 1;
    }
  }

  return { month, year };
};

export default returnMonthAndYear;