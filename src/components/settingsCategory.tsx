import React, { useState, useEffect } from "react";
import axios from 'axios';
import CategoryForm from "./categoryForm";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface Category {
  id: number;
  name: string;
}

const SettingsCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/categories');
      setCategories(response.data["hydra:member"]);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`https://localhost:8000/api/categories/${categoryId}`);
      setCategories(categories.filter(category => category.id !== categoryId));
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = categories.find(category => category.id === categoryId);
    if (categoryToEdit) {
      setCategoryToEdit(categoryToEdit);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryToDelete(null);
    setCategoryToEdit(null);
  };

  const handleUpdateCategory = (updatedCategoryName: string) => {
    if (categoryToEdit) {
      console.log(`Mise à jour de la catégorie avec l'ID: ${categoryToEdit.id} et le nouveau nom: ${updatedCategoryName}`);
      handleCloseModal(); // Ferme la modal après la modification réussie
    }
  };

  const handleAddCategory = async (newCategoryName: string) => {
    try {
      const response = await axios.post(
        'https://localhost:8000/api/categories',
        { name: newCategoryName },
        { headers: { 'Content-Type': 'application/ld+json' } }
      );
      setCategories([...categories, response.data]); // Ajoute la nouvelle catégorie à la liste actuelle
      handleCloseModal(); // Ferme la modal après l'ajout réussi
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };
  
  
  return (
    <div className="bg-dark">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Noms</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category, index) => (
            <tr key={index}>
              <td className="d-flex justify-content-between">
                {category.name}
                <span>
                  <i
                    className="fa-solid fa-pen-to-square m-2 text-warning"
                    onClick={() => handleEditCategory(category.id)}
                  ></i>
                  <i
                    className="fa-solid fa-trash m-2 text-danger"
                    onClick={() => {
                      setCategoryToDelete(category);
                      setShowModal(true);
                    }}
                  ></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CategoryForm onAddCategory={handleAddCategory} categoryToUpdate={categoryToEdit} onSubmit={handleUpdateCategory} />
      <nav>
        <div className="d-flex justify-content-center">
          {categories.length > 10 && (
            <ul className="pagination">
              {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }, (_, index) => (
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-dark" closeVariant="white">
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          Êtes-vous sûr de vouloir supprimer la catégorie {categoryToDelete?.name} ?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() => handleDeleteCategory(categoryToDelete?.id!)}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SettingsCategory;
