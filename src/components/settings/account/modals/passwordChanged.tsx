import React from "react";
import { Modal, Button } from "react-bootstrap";

interface PasswordChangedInterface{
show:boolean;
onHide: ()=>void;
}
const PasswordChanged = ({show,onHide}:PasswordChangedInterface)=>{
return(
    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton className="bg-dark" closeVariant="white">
      <Modal.Title>Mot de passe</Modal.Title>
    </Modal.Header>
    <Modal.Body className="bg-dark text-center">
        Votre mot de passe à bien été changé.
    </Modal.Body>
    <Modal.Footer className="bg-dark">
      <Button variant="success" onClick={onHide}>
        Fermer
      </Button>
    </Modal.Footer>
  </Modal>
)
}
export default PasswordChanged;