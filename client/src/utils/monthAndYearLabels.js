import monthsNames from '../components/common/monthNames';

const getMonthAndYearLabels = () => {
  // MONTH
  const monthLabels = [
    { label: "-- Выберите месяц -- ", value: "" }
  ];

  monthsNames.forEach((month, i) => {
    monthLabels.push({
      label: month, value: i
    });
  });


  // YEAR
  const yearLabels = [
    { label: "-- Выберите Год -- ", value: "" }
  ];

  for (let i = 2019; i <= new Date().getFullYear(); i++) {
    yearLabels.push({
      label: i, value: i
    });
  }

  return { monthLabels, yearLabels };
};

export default getMonthAndYearLabels;