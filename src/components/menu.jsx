import { useState } from 'react';
import { Link } from 'react-router-dom';
import EditableTitle from './editableTitle';
import TableList from './tableList';
import * as tables from '../assets/tables.json';

export default function Menu() {
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableSelect = (index) => {
    setSelectedTable(tables.tables[index]);
  };

  return (
    <div className='d-flex flex-column mt-2'>
      <TableList tables={tables.tables} onTableSelect={handleTableSelect} />
      {selectedTable && (
        <div>
          <h2>Détails de la table sélectionnée :</h2>
          <pre>{JSON.stringify(selectedTable, null, 2)}</pre>
        </div>
      )}
      <EditableTitle />
    </div>
  );
}
