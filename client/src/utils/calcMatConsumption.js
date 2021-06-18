import materials from '../components/common/materials';

// this function calculates total material consumption
const calcMaterialConsumption = (orders) => {
  const totalConsumption = [];

  // empty materials array
  materials.forEach(object => {
    const emptyObject = {
      material: object.material,
      amount: 0,
      unit: object.unit
    };
    totalConsumption.push(emptyObject);
  });

  orders.forEach(order => {
    if (order.completed && order.disinfectors) {
      order.disinfectors.forEach(element => {
        element.consumption.forEach(object => {
          totalConsumption.forEach(item => {
            if (object.material === item.material && object.unit === item.unit) {
              item.amount += object.amount;
            }
          });
        });
      });
    }
  });

  return totalConsumption;
};

export default calcMaterialConsumption;