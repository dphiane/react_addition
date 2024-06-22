import { CartItem } from '../types';

export const getCartFromLocalStorage = (tableNumber: number | null): { [key: string]: CartItem } => {
    if (tableNumber === null) return {};

    const cartFromLocalStorage = localStorage.getItem(`cart_${tableNumber}`);
    return cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : {};
};

export const calculateTotalPrice = (cart: { [key: string]: CartItem }): number => {
  return Object.values(cart).reduce((total, { quantity, price }) => total + quantity * price, 0)
};

export const calculateTotalTVA = (cart: { [key: string]: CartItem }): number => {
  return Object.values(cart).reduce((total, { quantity, price, tva }) => total + quantity * price * tva / 100, 0)
};
