import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TvaForm from "./tvaForm";

interface Tva {
  id: number;
  tva: number;
}

function Tva() {
  const [tvas, setTvas] = useState<Tva[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [tvaToDelete, setTvaToDelete] = useState<Tva | null>(null);
  const [tvaToEdit, setTvaToEdit] = useState<Tva | null>(null);
  const [existingTva, setExistingTva] = useState<number | null>(null); // Nouvel état pour stocker le montant de TVA existant
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
      setTvas(response.data["hydra:member"]);
    } catch (error) {
      console.error('Erreur lors de la récupération des taxes:', error);
    }
  };

  const handleDeleteTva = async (tvaId: number) => {
    try {
      await axios.delete(`https://localhost:8000/api/tvas/${tvaId}`);
      setTvas(tvas.filter(tva => tva.id !== tvaId));
      setShowModal(false);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setTvaToDelete(null);
    setExistingTva(null);
  };

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
        handleCloseModal();
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la taxe:', error);
      }
    }
  };

  const handleAddTva = async (newTva: number) => {
    if(newTva === undefined){
      return;
    }
    if (tvas.some(tva => tva.tva === newTva)) {
      setExistingTva(newTva);
      setShowModal(true);
      return; 
    }

    try {
      const response = await axios.post(
        'https://localhost:8000/api/tvas',
        { tva: newTva },
        { headers: { 'Content-Type': 'application/ld+json' } }
      );
      setTvas([...tvas, response.data]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la taxe:', error);
    }
  };

  return (
    <div className="bg-dark">
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
                     onClick={() => { setTvaToDelete(tva); setShowModal(true);}}></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <TvaForm onAddTva={handleAddTva} tvaToUpdate={tvaToEdit} onSubmit={handleUpdateTva} existingTva={existingTva} />

      <nav>
        <div className="d-flex justify-content-center">
          {tvas.length > 10 && (
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
        </div>
      </nav>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton  closeVariant="white" className='bg-dark'>
          <Modal.Title>{existingTva ? 'TVA déjà existante' : 'Confirmer la suppression'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          {existingTva ? `Le montant de TVA ${existingTva} existe déjà.` : `Êtes-vous sûr de vouloir supprimer la taxe ${tvaToDelete?.tva} ?`}
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant="secondary" onClick={handleCloseModal}>
            {existingTva ? 'Fermer' : 'Annuler'}
          </Button>
          {!existingTva && (
            <Button variant="danger" onClick={() => handleDeleteTva(tvaToDelete?.id!)}>
              Supprimer
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Tva;
