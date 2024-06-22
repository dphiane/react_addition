import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryForm from "./categoryForm";
import Deleted from "./modals/deleted";
import ConfirmDelete from "./modals/confirmDelete";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { fetchCategories, deleteCategory, updateCategory, addCategory } from "../../../api";
import AddedOrModified from "./modals/addedOrModified";
import { Category } from "types";

const categorySettings = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modals, setModals] = useState({
    addedOrModified: false,
    form: false,
    deleted: false,
    confirmDelete: false,
  });
  const [formErrors, setFormErrors] = useState<string>('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryName, setCategoryName]= useState<string>('');
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchCategories();
      const sortedCategories = response.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(category => category.id !== categoryId));
      setModals({ ...modals, confirmDelete: false, deleted: true });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = categories.find(category => category.id === categoryId);
    if (categoryToEdit) {
      setCategoryToEdit(categoryToEdit);
      setCategoryName(categoryToEdit.name)
    } else {
      setFormErrors('Catégorie non trouvée.');
    }
  };

  const handleUpdateCategory = async (updatedCategoryName: string) => {
    if (categoryToEdit) {
      try {
        const updatedCategory = await updateCategory(categoryToEdit.id, updatedCategoryName);
        setCategories(categories.map(category =>
          category.id === updatedCategory.id ? updatedCategory : category
        ));
        console.log('Catégorie mise à jour avec succès:', updatedCategory);
        setModals({...modals,addedOrModified:true, form:false})
        setFormErrors('');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
      }
    }
  };

  const handleAddCategory = async (newCategoryName: string) => {
    if (checkCategoryExist(newCategoryName, categories)) {
      try {
        setCategoryName(newCategoryName);
        const newCategory = await addCategory(newCategoryName);
        setCategories([...categories, newCategory]);
        setModals({...modals,addedOrModified:true, form:false})
        setFormErrors('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
      }
    } else {
      setFormErrors('Votre catégorie existe déjà.');
    }
  };

  const resetCategoryToEdit = () => {
    setCategoryToEdit(null);
  };

  function checkCategoryExist(categoryName: string, categories: Category[]) {
    return !categories.some(category => category.name === categoryName);
  }

  const handleCloseDeletedModal = () => {
    setModals({ ...modals, deleted: false });
    setCategoryToDelete(null);
  };

  const handleShowFormModal = (show: boolean) => {
    setModals({ ...modals, form: show });
  };

  const handleCloseConfirmationModal=()=>{
    setModals({...modals, addedOrModified:false});
    setCategoryName('');
    setCategoryToEdit(null);
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
                  <i className="fa-solid fa-trash m-2 text-danger" onClick={() => { setCategoryToDelete(category); setModals({ ...modals, confirmDelete: true }) }}></i>
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
        showFormModal={modals.form}
        setShowFormModal={handleShowFormModal}
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
          <Button onClick={() => setModals({ ...modals, form: true })}>Ajouter une catégorie</Button>
        </div>
      </nav>

      <Deleted show={modals.deleted} onHide={handleCloseDeletedModal} categoryName={categoryToDelete?.name}></Deleted>
      <ConfirmDelete show={modals.confirmDelete} onHide={() => setModals({...modals,confirmDelete:false})} categoryToDelete={categoryToDelete} handleDeleteCategory={handleDeleteCategory} />
      <AddedOrModified show={modals.addedOrModified} onHide={()=>handleCloseConfirmationModal()} categoryName={categoryName} categoryToUpdate={categoryToEdit}/>
    </div>
  );
};
export default categorySettings;
