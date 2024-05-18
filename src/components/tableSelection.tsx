import React, { useEffect } from 'react';
import TableList from './tableList';
import * as tables from '../assets/tables.json';

export interface MenuProps {
  onTableSelect: (tableNumber: number) => void;
}

const TableSelection: React.FC<MenuProps> = ({ onTableSelect }) => {

  const handleTableSelect = (index: number) => {
    onTableSelect(index);
  };

  return (
    <div className='d-flex flex-column bg-dark'>
      <TableList tables={tables.tables} onTableSelect={handleTableSelect} />
    </div>
  );
}
export default TableSelection;