import { Link } from "react-router-dom";

export default function table() {
  <div className="d-flex flex-column justify-content-between flex-grow-1">
    <div className="position-relative">
      <Link to={"/"}>
        <i className="fa-solid fa-arrow-left position-absolute"></i>
      </Link>
      <h3 className="text-center">Table</h3>
      <hr />
    </div>
    <div>article</div>
    <div className="">Total:</div>
    <div className="bg-primary text-light text-center fw-bold p-2">
      <Link to="/paid">Payer</Link>
    </div>
  </div>;
}