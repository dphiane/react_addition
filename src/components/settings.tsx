import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Articles from './articles';
import SettingsCategory from './settingsCategory';
function Settings() {
  return (
    <Tabs
      defaultActiveKey="article"
      id="uncontrolled-tab-example"
      className="custom-tabs bg-dark"
      >
      <Tab eventKey="article" title="Articles">
        <Articles></Articles>
      </Tab>
      <Tab eventKey="category" title="Catégories">
        <SettingsCategory></SettingsCategory>
      </Tab>
      <Tab eventKey="tax" title="Taxes">
        Tab content for Contact
      </Tab>
      <Tab eventKey="tickets" title="Tickets">

      </Tab>
      <Tab eventKey="cashRegister" title="Journal de caisse">

    </Tab>
    </Tabs>
  );
}

export default Settings;