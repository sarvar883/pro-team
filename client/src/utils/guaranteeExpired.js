// this function returns true if guarantee period of the completed
// order is expired and false otherwise

const guaranteeExpired = (completedAt = new Date(), guarantee = 0) => {
  let passedInDate = new Date(completedAt);

  // date of expire
  let expireDate = new Date(passedInDate.setMonth(passedInDate.getMonth() + guarantee));

  if (new Date().getTime() > expireDate.getTime()) {
    return true;
  } else {
    return false;
  }
};

export default guaranteeExpired;