import React from "react";
import { Modal, Button } from "react-bootstrap";

interface confirmLogoutInterface{
    show:boolean;
    onHide: ()=>void;
    logout: ()=>void;
}

const ConfirmLogout = ({show,onHide,logout}:confirmLogoutInterface)=>{
return(
    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton className="bg-dark" closeVariant="white">
      <Modal.Title>Déconnexion</Modal.Title>
    </Modal.Header>
    <Modal.Body className="bg-dark text-center">
      Êtes-vous sûr de vouloir vous déconnecter ?
    </Modal.Body>
    <Modal.Footer className="bg-dark">
      <Button variant="secondary" onClick={onHide}>
        Annuler
      </Button>
      <Button variant="danger" onClick={logout}>
        Se déconnecter
      </Button>
    </Modal.Footer>
  </Modal>
)

}
export default ConfirmLogout;