import React, { useState} from "react";

import { Link , useNavigate } from "react-router-dom";
import { login } from './api';
// @ts-ignore
import Image from "../assets/caisse-restaurant.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError('Vos identifiants sont incorrects.');
    }
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
        <h2 className="text-center text-light">Connexion</h2>
        <form onSubmit={handleSubmit} >
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">
              Email
            </label>
            <input
              type="email"
              className="form-control "
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
          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
          <small className="ms-2 text-light">
            <Link to={'/forgot-password'}>Mot de passe oublié ?</Link>
          </small>
        </form>
      </div>
    </div>
  );
}

export default Login;
