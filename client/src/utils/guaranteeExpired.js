// this function returns true if guarantee period of the completed
// order is expired and false otherwise

const guaranteeExpired = (completedAt = new Date(), guarantee = 0) => {
  let passedInDate = new Date(completedAt);
  // console.log('func compl', passedInDate);
  // console.log('func guarantee', guarantee);

  // date of expire
  let expireDate = new Date(passedInDate.setMonth(passedInDate.getMonth() + guarantee));

  // console.log('func expireDate', expireDate);

  if (new Date().getTime() > expireDate.getTime()) {
    // console.log('func result true');
    return true;
  } else {
    // console.log('func result false');
    return false;
  }
};

export default guaranteeExpired;