import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, resetPasswordRequest } from '../api';
import ResetPasswordRequest from "./resetPasswordRequest";
// @ts-ignore
import Image from "../assets/caisse-restaurant.png";
import Loader from "../components/loader";

const Login: React.FC = () => {
  const [loading, setLoading]= useState<boolean>(false);
  const [resetPasswordForm, setResetPasswordForm] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess]= useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('')
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError('Vos identifiants sont incorrects.');
    }finally{
      setLoading(false)
    }
  };

  const handleResetPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await resetPasswordRequest(resetEmail);
      setSuccess('Un email de réinitialisation a été envoyé.');
    } catch (err) {
      setError('Une erreur est survenue lors de la réinitialisation du mot de passe.');
    }finally{
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setResetPasswordForm(!resetPasswordForm);
    setError('');
    setSuccess('')
  };

  return (
    <div className="container d-flex flex-column flex-lg-row align-items-center">
      <div className="col-md-8 position-relative">
        <img
          className="img-fluid rounded-3"
          src={Image}
          alt="illustration d'une caisse enregistreuse"
        />
      </div>
      <div className="container col-lg-4 col-md-6 col-10 d-flex flex-column justify-content-center">
        {resetPasswordForm ? (
          <ResetPasswordRequest resetPasswordRequest={handleResetPasswordRequest} resetEmail={resetEmail} setResetEmail={setResetEmail} toggleForm={toggleForm} error={error} success={success} loading={loading}></ResetPasswordRequest>
        ) : (
          <div>
            <h2 className="text-center text-light">Connexion</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-light">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-light">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              {<Loader loading={loading}></Loader>}
              <button type="submit" className="btn btn-primary">
                Se connecter
              </button>
              <small className="ms-2 text-light">
                <button type="button" className="btn btn-link text-light" onClick={toggleForm}>
                  Mot de passe oublié ?
                </button>
              </small>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
