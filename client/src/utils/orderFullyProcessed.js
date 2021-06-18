// эта функция показывает закрыт ли заказ полностью
// возвращает true - если заказ полностью закрыт
// false - в противном случае

const orderFullyProcessed = (order = {}) => {
  return order.completed && order.operatorDecided && (order.accountantDecided || order.adminDecided);
};

export default orderFullyProcessed;