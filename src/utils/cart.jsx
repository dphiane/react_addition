export function calculateTotalPrice (cart){
    let totalPrice = 0;
    Object.values(cart).forEach(item => {
      totalPrice += item.quantity * item.price;
    });
    return totalPrice;
  };

 export function calculateTotalTVA(cart){
    let total = 0;
    Object.values(cart).forEach(item => {
      total += item.quantity * (item.price / (1 + item.tva));
    });
    return parseFloat(total.toFixed(2));
  };
