import React, {useState} from "react";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';

interface MenuItem {
    name: string;
    price: number;
    tva: number;
    category: string;
}

const menu: MenuItem[] = [
  {
    name: "Pizza Margherita",
    price: 8.99,
    tva: 10,
    category: "Pizza"
  },
  {
    name: "Spaghetti Carbonara",
    price: 12.5,
    tva: 10,
    category: "Pasta"
  },
  {
    name: "Salade Niçoise",
    price: 9.75,
    tva: 10,
    category: "Salad"
  },
  {
    name: "Burger Classique",
    price: 11.25,
    tva: 10,
    category: "Burger"
  },
  {
    name: "Café Expresso",
    price: 2.5,
    tva: 5.5,
    category: "Drinks"
  }
];
function Articles(){
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menu.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

return(
    <div className="bg-dark">
  <Table striped bordered hover variant="dark">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Catégories</th>
        <th>Prix</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.category}</td>
          <td>{item.price}</td>
        </tr>
      ))}
    </tbody>
  </Table>
      <div className="d-flex justify-content-between me-5">
        <Link to={"/"}><button className="btn btn-secondary m-2">Retour</button></Link>
        <button className="btn btn-primary m-2">
            <i className="fa-solid fa-circle-plus fa-xl text-light me-2"></i>
            Ajouter un article
        </button>
      </div>
      <nav>
        <div className="d-flex justify-content-center">
        {menu.length > 5 && (
  <ul className="pagination">
    {Array.from({ length: Math.ceil(menu.length / itemsPerPage) }, (_, index) => (
      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
        <button onClick={() => paginate(index + 1)} className="page-link">
          {index + 1}
        </button>
      </li>
    ))}
  </ul>
)}
          </div>
      </nav>
    </div>
)
}

export default Articles;