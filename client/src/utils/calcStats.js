// this function calculates stats from array of orders
const calculateStats = (arr) => {
  let object = {
    totalSum: 0,
    totalScore: 0,
    totalOrders: arr.length,
    completed: 0,
    confirmedOrders: [],
    rejected: 0,

    // сумма заказов для дезинфектора (она равна сумме заказа / количество дезинфекторов, выполнивших заказ)
    totalSumForDisinfector: 0,

    // тип заказа: Консультация
    // consultationConfirmed: 0,

    // тип заказа: Осмотр
    // osmotrConfirmed: 0,

    // тип заказа: Консультации + Осмотры (из подтвержденных заказов)
    consultAndOsmotrConfirmed: 0,

    // некачественные заказы
    failed: 0,

    // повторные заказы (если имеется атрибут prevFailedOrder)
    povtors: 0,


    corporate: 0,
    // процент корпоративных заказов от общего количества заказов
    corporatePercent: 0,
    corpSum: 0,
    // процент суммы корпоративных заказов от общей суммы заказов
    corpSumPercent: 0,


    indiv: 0,
    indivPercent: 0,
    indivSum: 0,
    indivSumPercent: 0,
  };

  arr.forEach(order => {

    if (order.hasOwnProperty('prevFailedOrder')) {
      object.povtors++;
    }


    if (order.completed) {
      object.completed++;


      // if order was confirmed
      if (!order.failed &&
        // исключаем некачественные и повторные заказы
        !order.hasOwnProperty('prevFailedOrder') &&
        order.operatorConfirmed &&
        (order.accountantConfirmed || order.adminConfirmed)
      ) {
        object.confirmedOrders.push(order);
        object.totalSum += order.cost;
        object.totalScore += order.score;


        // сумма, которая достанется каждому дезинфектору
        if (order.disinfectors && order.disinfectors.length > 0) {
          object.totalSumForDisinfector = object.totalSumForDisinfector + order.cost / order.disinfectors.length;
        }


        if (order.clientType === 'corporate') {
          object.corporate++;
          object.corpSum += order.cost;

        } else if (order.clientType === 'individual') {
          object.indiv++;
          object.indivSum += order.cost;

        }

        // тип заказа: Консультация или Осмотр
        if (
          order.typeOfService.includes('Консультация') ||
          order.typeOfService.includes('Осмотр') ||
          order.typeOfService.includes('Осмотр и консультации')
        ) {
          object.consultAndOsmotrConfirmed++;
        }
        // if (order.typeOfService.includes('Осмотр')) {
        // object.osmotrConfirmed++;
        // }
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