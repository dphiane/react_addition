import React from 'react';
import { ProductsInterface } from 'types';

interface ProductListProps {
  products: (ProductsInterface & { quantity: number })[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <>
      {products.length > 0 && (
        <>
          <h4 className="text-decoration-underline">Articles</h4>
          <ul>
            {products.map((product, index) => (
              <li className="position-relative" key={index}>{product.quantity} x {product.name}<span className="position-absolute end-0 me-2">{product.price} €</span></li>
            ))}
            <hr />
          </ul>
        </>
      )}
    </>
  );
};

export default ProductList;
