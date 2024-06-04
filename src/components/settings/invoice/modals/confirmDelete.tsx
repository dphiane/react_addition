import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Invoice } from "components/types";

interface ConfirmDelete{
show: boolean;
onHide: ()=>void;
editInvoice: Invoice;
handleDeleteInvoice : (id:number)=>void;
setShowDeleteModal: (value:boolean)=>void;
}

const ConfirmDelete = ({show,onHide,editInvoice,handleDeleteInvoice,setShowDeleteModal}:ConfirmDelete) =>{
    return(
        <Modal show={show} onHide={onHide} backdrop="static">
        <Modal.Header closeVariant="white" className='bg-dark'>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          Souhaitez-vous vraiment supprimer la facture N°{editInvoice?.invoiceNumber} ?
        </Modal.Body>
        <Modal.Footer className='bg-dark d-flex justify-content-between'>
          <Button variant="danger" onClick={()=>handleDeleteInvoice(editInvoice?.id!)}>
            Supprimer
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
export default ConfirmDelete;