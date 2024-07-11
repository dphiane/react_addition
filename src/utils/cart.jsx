export function calculateTotalPrice (cart){
    let total = 0;
    Object.values(cart).forEach(item => {
      total += item.quantity * item.price;
    });
    return parseFloat(total.toFixed(2));
  };

 export function calculateTotalTVA(cart){
    let total = 0;
    Object.values(cart).forEach(item => {
      total += item.quantity * (item.price / (1 + item.tva));
    });
    return parseFloat(total.toFixed(2));
  };

 export function calculatePrice(price , quantity){
  const total = price * quantity;
  return parseFloat(total.toFixed(2));
 }