import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

interface TabData {
  title: string;
  content: string;
}
interface Product {
    name: string;
    price: number;
    tva: number
  }
  
const productsByCategory: { [ key: string ]: Product[] } = {
    Entrée: [
      { name: 'Salade', price: 5.00, tva: 10 },
      { name: 'Soupe', price: 4.00, tva: 10 },
      { name: 'Bruschetta', price: 6.00, tva: 10 },
    ],
    Plats: [
      { name: 'Poulet rôti', price: 10.00, tva: 10 },
      { name: 'Pâtes carbonara', price: 12.00, tva: 10 },
      { name: 'Steak frites', price: 15.00, tva: 10 },
    ],
    Dessert: [
      { name: 'Tiramisu', price: 8.00, tva: 10 },
      { name: 'Crème brûlée', price: 7.00, tva: 10 },
      { name: 'Gâteau au chocolat', price: 6.50, tva: 10 },
    ],
    Boisson: [
      { name: 'Eau plate', price: 2.50, tva: 10 },
      { name: 'Coca-Cola', price: 3.50, tva: 10 },
      { name: 'Vin rouge', price: 12.00, tva: 20 },
    ],
    Vin: [
  
    ],
    Boisson_Chaude: [
  
    ],
  
  
  };

function MyTabs() {
  const [tabData, setTabData] = useState<TabData[]>([]);

  useEffect(() => {
    // Fetch your JSON data here
    fetch('your_file.json')
      .then(response => response.json())
      .then((data: TabData[]) => setTabData(data))
      .catch(error => console.error('Error fetching JSON:', error));
  }, []);

  return (
    <Tabs defaultActiveKey="0" id="tabs-example">
      {Object.keys(productsByCategory).map((category, index) => (
    <Tab key={index} eventKey={index.toString()} title={category}>
    <p>{category}</p>
  </Tab>
      ))}
    </Tabs>
  );
}


export default MyTabs;
