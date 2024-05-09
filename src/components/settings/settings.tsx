import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Products from './products';
import SettingsCategory from './categorySettings';
import Tva from './tva';
import { Link } from "react-router-dom";

function Settings() {
  return (
    <>
      <Tabs
        defaultActiveKey="products"
        id="settings-tabs"
        className="custom-tabs bg-dark position-relative"
      >
        <Tab eventKey="products" title="Articles">
          <Products></Products>
        </Tab>
        <Tab eventKey="category" title="Catégories">
          <SettingsCategory></SettingsCategory>
        </Tab>
        <Tab eventKey="tax" title="Taxes">
          <Tva></Tva>
        </Tab>
        <Tab eventKey="tickets" title="Tickets">

        </Tab>
        <Tab eventKey="cashRegister" title="Journal de caisse">

        </Tab>
      </Tabs>
      <Link to={"/"}><button className="btn btn-secondary m-2 position-absolute bottom-0 start-0">Retour</button></Link>
    </>
  );
}

export default Settings;