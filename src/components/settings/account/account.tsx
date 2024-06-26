import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ConfirmLogout from "./modals/confirmLogout";
import { changePassword, getCurrentUser, removeToken } from 'api';
import { jwtDecode } from "jwt-decode";
import Loader from "../../loader";
import PasswordChanged from "./modals/passwordChanged";
import { Link } from "react-router-dom";

interface DecodedToken {
    username: string;
}

const Account = () => {
    const [ modals, setModals ] = useState({
        confirm: false,
        passwordChanged: false
    })
    const [ decodedToken, setDecodedToken ] = useState<DecodedToken | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ password, setPassword ] = useState<string>('');
    const [ newPassword, setNewPassword ] = useState<string>('');
    const [ confirmNewPassword, setConfirmNewPassword ] = useState<string>('');
    const [ error, setError ] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCurrentUser();
        if (token) {
            setLoading(true);
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setDecodedToken(decoded);
            } catch (error) {
                console.error('Erreur lors du décodage du token JWT', error);
            } finally {
                setLoading(false);
            }
        }
    }, []);

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    const handlePutPassword = async () => {
        if(newPassword.trim().length <= 0 && password.trim().length <= 0){
            setError('Veuillez remplir les champs.')
            return;
        }
        if(newPassword.length < 6 ){
            setError("Votre mot de passe doit faire au minimum 6 caractères.")
            return;
        }
        if(newPassword.length > 50 ){
            setError("Votre mot de passe doit faire au maximum 50 caractères.")
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }
        try {
            const token = getCurrentUser();
            if (token) {
                const decoded = jwtDecode<DecodedToken>(token);
                const response = await changePassword(decoded.username, password, newPassword, token);
                console.log(response)
                setError('');
                setPassword('');
                setNewPassword('')
                setConfirmNewPassword('');
                setModals({ ...modals, passwordChanged: true })
            }
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe', error);
            setError('L\'ancien mot de passe est incorrect');
        }
    };

    return (
        <>
            {decodedToken ? (
                <div className="m-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="text-light m-0">Identifiant: {decodedToken.username}</p>
                        <Button variant="danger" className="me-2" onClick={() => setModals({ ...modals, confirm: true })}>Se déconnecter</Button>
                    </div>
                    <div className="d-flex justify-content-center">
                    <div className="card-form w-100">
        <h3 className="text-light text-center mb-3">Changer de mot de passe</h3>

                    <Form>
                        <FloatingLabel label="Ancien mot de passe">
                            <Form.Control type="password" className="mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel  label="Nouveau mot de passe">
                            <Form.Control type="password" className="mb-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel label="Confirmer mon nouveau mot de passe">
                            <Form.Control type="password" className="mb-2"  value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        </FloatingLabel>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                        <Button variant="primary" onClick={handlePutPassword}>Modifier le mot de passe</Button>
                    </div>
                    </div>
                </div>
            ) : (
                <Loader loading={loading}></Loader>
                )}
            <Link to={"/"}><button className="btn btn-secondary m-2">Retour</button></Link>
            <ConfirmLogout show={modals.confirm} onHide={() => setModals({ ...modals, confirm: false })} logout={handleLogout}></ConfirmLogout>
            <PasswordChanged show={modals.passwordChanged} onHide={() => setModals({ ...modals, passwordChanged: false })}></PasswordChanged>
        </>
    );
};

export default Account;
