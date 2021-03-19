// this function calculates average score of user (disinfector ?)

// percent that is subtracted from average score for each failed order
const PERCENT_PER_FAIL = 5;

// the object should have 3 fields: 
// totalScore, totalOrders and failedOrders
const calculateDisinfScore = (object) => {
  let averageScore = (object.totalScore / object.totalOrders).toFixed(2);

  // penalty for failed orders
  let percentToSubtract = PERCENT_PER_FAIL * object.failedOrders;

  if (object.failedOrders > 100 / PERCENT_PER_FAIL) {
    return 0;
  } else {
    return averageScore * (1 - percentToSubtract / 100).toFixed(2);
  }
};

export default calculateDisinfScore;