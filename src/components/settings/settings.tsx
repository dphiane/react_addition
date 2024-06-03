import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Products from './products/products';
import SettingsCategory from './categories/category';
import Tva from './tva/tva';
import Invoices from './invoice';

function Settings() {
  return (
    <div className=' min-vh-100 '>
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
          <Invoices></Invoices>
        </Tab>
        <Tab eventKey="cashRegister" title="Journal de caisse">

        </Tab>
      </Tabs>
    </div>
  );
}

export default Settings;