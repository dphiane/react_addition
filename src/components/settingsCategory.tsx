import React , {useState} from "react";

const category = ['entrées','plats','desserts','boisson froide','boisson chaude','vin'];

const SettingsCategory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = category.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
    return (
        <div>
        <ul>
          {currentItems.map((item, index) => (
            <li key={index}>
              <h3>{item}</h3>
            </li>
          ))}
        </ul>
        <nav>
          <div className="d-flex justify-content-center">
          {category.length > 10 && (
  <ul className="pagination">
    {Array.from({ length: Math.ceil(category.length / itemsPerPage) }, (_, index) => (
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
);
}

export default SettingsCategory;