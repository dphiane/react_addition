import React from "react";
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

interface ResetPasswordSuccessInterface{
    show:boolean;
    onHide: ()=>void;
}

const ResetPasswordSuccess = ({show,onHide}:ResetPasswordSuccessInterface)=>{
    return (
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton className='bg-dark'>
            <Modal.Title>Mot de passe réinitialisé</Modal.Title>
          </Modal.Header>
          <Modal.Body className='bg-dark'>
            Votre mot de passe à bien été réinitialisé.
          </Modal.Body>
          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={onHide}>
              Fermer
            </Button>
            <Link to='/login' className="btn btn-primary">Page de connection</Link>
          </Modal.Footer>
        </Modal>
)
}
export default ResetPasswordSuccess;