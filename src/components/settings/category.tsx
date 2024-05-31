import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import CategoryForm from "./categoryForm";

import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface Category {
  id: number;
  name: string;
}

const categorySettings = () => {
  const [ categories, setCategories ] = useState<Category[]>([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ showConfirmationModal, setShowConfirmationModal ] = useState(false);
  const [ showFormModal, setShowFormModal ] = useState<boolean>(false);
  const [ formErrors, setFormErrors ] = useState<string>('');
  const [ categoryToDelete, setCategoryToDelete ] = useState<Category | null>(null);
  const [ categoryToEdit, setCategoryToEdit ] = useState<Category | null>(null);
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
      const sortedCategories = response.data[ "hydra:member" ].sort((a: Category, b: Category) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`https://localhost:8000/api/categories/${categoryId}`);
      setCategories(categories.filter(category => category.id !== categoryId));
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = categories.find(category => category.id === categoryId);
    if (categoryToEdit) {
      setCategoryToEdit(categoryToEdit);
    }else{
      setFormErrors('Catégorie non trouvée.')
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setCategoryToDelete(null);
  };

  const handleUpdateCategory = async (updatedCategoryName: string) => {
    if (categoryToEdit) {
      try {
        const response = await axios.put(
          `https://localhost:8000/api/categories/${categoryToEdit.id}`,
          { name: updatedCategoryName },
          { headers: { 'Content-Type': 'application/ld+json' } }
        );
        const updatedCategory = response.data;
        setCategories(categories.map(category =>
          category.id === updatedCategory.id ? updatedCategory : category
        ));
        console.log(`Catégorie mise à jour avec succès:`, updatedCategory);
        handleCloseModal(); // Ferme la modal après la modification réussie
        setFormErrors('');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
      }
    }
  };

  const handleAddCategory = async (newCategoryName: string) => {
    if (checkCategoryExist(newCategoryName, categories)) {
      try {
        const response = await axios.post(
          'https://localhost:8000/api/categories',
          { name: newCategoryName },
          { headers: { 'Content-Type': 'application/ld+json' } }
        );
        setCategories([ ...categories, response.data ]); // Ajoute la nouvelle catégorie à la liste actuelle
        handleCloseModal(); // Ferme la modal après l'ajout réussi
        setFormErrors('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
      }
    }else{
      setFormErrors('Votre catégorie existe déja.')
    }
  };

  const resetCategoryToEdit = () => {
    setCategoryToEdit(null);
  }

  function checkCategoryExist(categoryName: string, categories: Category[]) {
    return !categories.some(category => category.name === categoryName);
  }

  return (
    <div className="bg-dark pb-2">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Catégories</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category, index) => (
            <tr key={index}>
              <td className="d-flex justify-content-between align-items-center">
                {category.name}
                <span>
                  <i className="fa-solid fa-pen-to-square m-2 text-warning" onClick={() => handleEditCategory(category.id)}></i>
                  <i className="fa-solid fa-trash m-2 text-danger" onClick={() => { setCategoryToDelete(category); setShowConfirmationModal(true); }}></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CategoryForm
        onAddCategory={handleAddCategory}
        categoryToUpdate={categoryToEdit}
        onUpdateCategory={handleUpdateCategory}
        showFormModal={showFormModal}
        setShowFormModal={setShowFormModal}
        resetCategoryToEdit={resetCategoryToEdit}
        formErrors={formErrors}
      />
      <nav>
        <div className="d-flex justify-content-between ms-2 me-2">
          <Link to={"/"}><button className="btn btn-secondary">Retour</button></Link>

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
          <Button onClick={() => setShowFormModal(true)}>Ajouter une catégorie</Button>
        </div>
      </nav>

      <Modal show={showConfirmationModal} onHide={handleCloseModal}>
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

export default categorySettings;
