import { CartItemType } from '../components/carts';

export const getCartFromLocalStorage = (tableNumber: number | null): { [key: string]: CartItemType } => {
    if (tableNumber === null) return {};

    const cartFromLocalStorage = localStorage.getItem(`cart_${tableNumber}`);
    return cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : {};
};
