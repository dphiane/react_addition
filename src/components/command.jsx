import { Link } from "react-router-dom";
import Table from "./table";

export default function command() {
  return (
    <div className="container-fluid vh-100">
      <div className="d-flex h-100">
        <Table></Table>
        <div className="d-flex flex-column justify-content-between bg-secondary-subtle w-75">
          menu item
          <div className="bg-secondary text-light text-center fw-bold p-2">
            <Link to={"/"}>Menu</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
