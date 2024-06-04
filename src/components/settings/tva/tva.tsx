import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import TvaForm from "./tvaForm";
import ConfirmDelete from "./modals/confirmDelete";
import Deleted from "./modals/deleted";
import AddedOrModified from "./modals/addedOrModified";

export interface Tva {
  id: number;
  tva: number;
}

function Tva() {
  const [ tvas, setTvas ] = useState<Tva[]>([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false);
  const [ showDeletedModal, setShowDeletedModal ] = useState<boolean>(false);
  const [showModalAddedOrModified, setShowModalAddedOrModified] = useState<boolean>(false);

  const [ showFormModal, setShowFormModal ] = useState(false);
  const [ tvaToDelete, setTvaToDelete ] = useState<Tva | null>(null);
  const [ tvaToEdit, setTvaToEdit ] = useState<Tva | null>(null);
  const [updated, setUpdated]= useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tvas.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchTvas();
  }, []);

  const fetchTvas = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/tvas');
      setTvas(response.data[ "hydra:member" ]);
    } catch (error) {
      console.error('Erreur lors de la récupération des taxes:', error);
    }
  };

  const handleDeleteTva = async (tvaId: number) => {
    try {
      await axios.delete(`https://localhost:8000/api/tvas/${tvaId}`);
      setTvas(tvas.filter(tva => tva.id !== tvaId));
      setShowDeleteConfirmation(false);
      setShowDeletedModal(true);
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
    setShowFormModal(false)
    setTvaToDelete(null);
    setTvaToEdit(null);
    setUpdated(false);
  }

  const handleUpdateTva = async (updatedTva: number) => {
    if (tvaToEdit) {
      try {
        const response = await axios.put(
          `https://localhost:8000/api/tvas/${tvaToEdit.id}`,
          { tva: updatedTva },
          { headers: { 'Content-Type': 'application/ld+json' } }
        );
        const updatedTvaData = response.data;
        setTvas(tvas.map(tva =>
          tva.id === updatedTvaData.id ? updatedTvaData : tva
        ));
        console.log(`TVA mise à jour avec succès:`, updatedTvaData);
        setUpdated(true);
        setShowModalAddedOrModified(true)
        reset()
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
      const response = await axios.post(
        'https://localhost:8000/api/tvas',
        { tva: newTva },
        { headers: { 'Content-Type': 'application/ld+json' } }
      );
      setTvas([ ...tvas, response.data ]);
      reset();
      setShowModalAddedOrModified(true);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la taxe:', error);
    }
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
                    onClick={() => { setTvaToDelete(tva); setShowDeleteConfirmation(true) }}></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <TvaForm
        onAddTva={handleAddTva}
        tvaToUpdate={tvaToEdit}
        onSubmit={handleUpdateTva}
        showFormModal={showFormModal}
        setShowFormModal={setShowFormModal}
        reset={reset}
        error={error}
      />

      <ConfirmDelete show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} tvaToDelete={tvaToDelete} handleDeleteTva={() => handleDeleteTva(tvaToDelete?.id!)}></ConfirmDelete>
      <Deleted show={showDeletedModal} onHide={() => setShowDeletedModal(false)} tva={tvaToDelete?.tva!} />
      <AddedOrModified show={showModalAddedOrModified} onHide={()=>setShowModalAddedOrModified(false)} tva={tvaToEdit} updated={false} />
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
          <Button onClick={() => setShowFormModal(true)}>Ajouter une TVA</Button>
        </div>
      </nav>
    </div>
  );
}

export default Tva;
