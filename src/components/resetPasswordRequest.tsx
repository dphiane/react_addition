import React from "react";
import Loader from "./loader";

interface resetPasswordFormInterface {
  resetPasswordRequest: (e: React.FormEvent) => void;
  resetEmail: string;
  error: string;
  toggleForm: () => void;
  setResetEmail: (value: string) => void;
  success :string;
  loading:boolean;
}

const ResetPasswordRequest: React.FC<resetPasswordFormInterface> = ({ resetPasswordRequest, resetEmail, error, toggleForm, setResetEmail ,success,loading}) => {
  return (
    <div>
      <h2 className="text-center text-light">Réinitialisation du mot de passe</h2>
      <form onSubmit={resetPasswordRequest}>
        <div className="mb-3">
          <label htmlFor="resetEmail" className="form-label text-light">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="resetEmail"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </div>
        {success && <p className="text-warning">{success}</p>}
        {error && <p className="text-danger">{error}</p>}
        {<Loader loading={loading}></Loader>}
        <button type="submit" className="btn btn-primary w-100">
          Réinitialiser le mot de passe
        </button>
        <small className="text-light ">
          <button type="button" className="w-100 btn btn-link text-light" onClick={toggleForm}>
            Retour à la connexion
          </button>
        </small>
      </form>
    </div>
  );
};

export default ResetPasswordRequest;
