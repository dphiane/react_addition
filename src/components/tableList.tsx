import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';

interface Table {
    name: string;
    columns: string[];
    data: { [key: string]: string }[];
}

interface TableListProps {
    tables: Table[];
    onTableSelect: (index: number) => void;
}

const ucFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const TableList: React.FC<TableListProps> = ({ tables, onTableSelect }) => {

    return (
        <Dropdown>
            <Dropdown.Toggle className="w-100 rounded-0">
                <i className="fa-solid fa-list"></i> Liste des tables 
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {tables.map((table, index) => (
                    <Dropdown.Item key={index} onClick={() => onTableSelect(index)}>
                        {ucFirst(table.name)}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default TableList;
