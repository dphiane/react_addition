import React from 'react';
import { Link } from "react-router-dom";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Products from './products';
import SettingsCategory from './category';
import Tva from './tva';


function Settings() {
  return (
    <>
      <Tabs
        defaultActiveKey="products"
        id="settings-tabs"
        className="custom-tabs bg-dark"
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
      <Link to={"/"}><button className="btn btn-secondary position-absolute start-0 bottom-0 m-2">Retour</button></Link>
    </>
  );
}

export default Settings;