// this function calculates stats from array of orders
const calculateStats = (arr) => {
  let array = [...arr];

  let object = {
    totalSum: 0,
    totalScore: 0,
    totalOrders: array.length,
    completed: 0,
    confirmedOrders: [],
    rejected: 0,
    failed: 0,


    corporate: 0,
    // процент корпоративных заказов от общего количества заказов
    corporatePercent: 0,
    corpSum: 0,
    // процент суммы корпоративных заказов от общей суммы заказов
    corpSumPercent: 0,


    indiv: 0,
    indivPercent: 0,
    indivSum: 0,
    indivSumPercent: 0
  };

  array.forEach(order => {
    if (order.completed) {
      object.completed++;


      // if order was confirmed
      if (order.operatorConfirmed &&
        (order.accountantConfirmed || order.adminConfirmed)
      ) {
        object.confirmedOrders.push(order);
        object.totalSum += order.cost;
        object.totalScore += order.score;

        if (order.clientType === 'corporate') {
          object.corporate++;
          object.corpSum += order.cost;

        } else if (order.clientType === 'individual') {
          object.indiv++;
          object.indivSum += order.cost;

        }
      }


      // if order was rejected
      if (
        (order.operatorDecided && !order.operatorConfirmed) ||
        (order.accountantDecided && !order.accountantConfirmed) ||
        (order.adminDecided && !order.adminConfirmed)
      ) {
        object.rejected++;
      }


      // if order was failed
      if (order.failed) {
        object.failed++;
      }
    }
  });

  object.corporatePercent = (object.corporate * 100 / object.confirmedOrders.length).toFixed(1);
  object.indivPercent = (object.indiv * 100 / object.confirmedOrders.length).toFixed(1);

  object.corpSumPercent = (object.corpSum * 100 / object.totalSum).toFixed(1);
  object.indivSumPercent = (object.indivSum * 100 / object.totalSum).toFixed(1);

  return object;
};

export default calculateStats;