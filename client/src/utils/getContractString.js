// this function takes in array of client contracts and returns 
// string (comma separated values of contracts)

// takes in array of strings e.g. ['1', '2', 'a']

const getContractsString = (arr) => {
  let newString = '';

  if (arr.length === 0) {
    return '--';
  }

  arr.forEach((item, index) => {
    if (index === arr.length - 1) {
      newString += item;
    } else {
      newString += `${item}, `;
    }
  });

  return newString;
};

export default getContractsString;