import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import TvaForm from "./tvaForm";
import ConfirmDelete from "./modals/confirmDelete";
import Deleted from "./modals/deleted";
import AddedOrModified from "./modals/addedOrModified";
import { TvaInterface } from "types";
import { deleteTva, fetchTvas,updateTva,addTva } from "api";

const Tva= () => {
  const [ tvas, setTvas ] = useState<TvaInterface[]>([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [modals, setModals]=useState({
    addedOrModified: false,
    form: false,
    deleted: false,
    confirmDelete: false,
  });
  const [ tvaToDelete, setTvaToDelete ] = useState<TvaInterface | null>(null);
  const [ tvaToEdit, setTvaToEdit ] = useState<TvaInterface | null>(null);
  const [lastAddedOrUpdatedTva, setLastAddedOrUpdatedTva] = useState<TvaInterface | null>(null);
  const [updated, setUpdated]= useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tvas.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    getTvas();
  }, []);

  const getTvas = async () => {
    try {
      const response = await fetchTvas();
      setTvas(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des taxes:', error);
    }
  };

  const handleDeleteTva = async (tvaId:number) => {
    try {
      await deleteTva(tvaId);
      setTvas(tvas.filter(tva => tva.id !== tvaId));
      setModals({...modals,confirmDelete:false,deleted:true})
    } catch (error) {
      console.error('Erreur lors de la suppression de la taxe:', error);
    }
  };

  const handleEditTva = (tvaId: number) => {
    const tvaToEdit = tvas.find(tva => tva.id === tvaId);
    if (tvaToEdit) {
      setTvaToEdit(tvaToEdit);
    }
  };

  const reset = () => {
    setError('')
    setModals({
      addedOrModified: false,
      form: false,
      deleted: false,
      confirmDelete: false,
    });
    setTvaToDelete(null);
    setTvaToEdit(null);
    setUpdated(false);
    setLastAddedOrUpdatedTva(null)
  }

  const handleUpdateTva = async (updatedTva: number) => {
    if (tvaToEdit) {
      try {
        const response = await updateTva(updatedTva,tvaToEdit.id);
        const updatedTvaData = response;
        setTvas(tvas.map(tva =>
          tva.id === updatedTvaData.id ? updatedTvaData : tva
        ));
        console.log(`TVA mise à jour avec succès:`, updatedTvaData);
        setLastAddedOrUpdatedTva(response);
        setUpdated(true);
        setModals({...modals,addedOrModified:true})
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la taxe:', error);
      }
    }
  };

  const handleAddTva = async (newTva: number) => {
    setError('');

    if (newTva === undefined) {
      return;
    }
    if (tvas.some(tva => tva.tva === newTva)) {
      setError("Votre Tva existe déja !");
      return;
    }

    try {
      const response = await addTva(newTva) 
      setLastAddedOrUpdatedTva(response); 
      setTvas([ ...tvas, response ]);
      setModals({...modals,addedOrModified:true,form:false})
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la taxe:', error);
    }
  };

  const setShowFormModal = (value: boolean): void => {
    setModals({ ...modals, form: value });
  };

  return (
    <div className="bg-dark pb-2">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>TVA</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((tva, index) => (
            <tr key={index}>
              <td className="d-flex justify-content-between align-items-center">{tva.tva}%
                <span>
                  <i className="fa-solid fa-pen-to-square m-2 text-warning"
                    onClick={() => handleEditTva(tva.id)}></i>
                  <i className="fa-solid fa-trash m-2 text-danger"
                    onClick={() => { setTvaToDelete(tva); setModals({...modals,confirmDelete:true}) }}></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <TvaForm
        onAddTva={handleAddTva}
        tvaToUpdate={tvaToEdit}
        onUpdateTva={handleUpdateTva}
        showFormModal={modals.form}
        setShowFormModal = {setShowFormModal}
        error={error}
      />

      <ConfirmDelete show={modals.confirmDelete} onHide={() =>setModals({...modals,confirmDelete:false})} tvaToDelete={tvaToDelete} handleDeleteTva={() => handleDeleteTva(tvaToDelete?.id!)}></ConfirmDelete>
      <Deleted show={modals.deleted} onHide={() => reset()} tva={tvaToDelete?.tva!} />
      <AddedOrModified show={modals.addedOrModified} onHide={()=>reset()} tva={lastAddedOrUpdatedTva} updated={updated} />
      <nav>
        <div className="d-flex justify-content-between ms-2 me-2">
          <Link to={"/"}><button className="btn btn-secondary">Retour</button></Link>
          {tvas.length > itemsPerPage && (
            <ul className="pagination">
              {Array.from({ length: Math.ceil(tvas.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={() =>setModals({...modals,form:true})}>Ajouter une TVA</Button>
        </div>
      </nav>
    </div>
  );
}

export default Tva;
