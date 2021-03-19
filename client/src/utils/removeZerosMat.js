// this function removes material with amount of 0 from array

const removeZeros = arr => {
  let array = [...arr];

  array = array.filter(item => item.amount > 0);

  return array;
};

export default removeZeros;