import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';

interface Table {
    name: string;
    columns: string[];
    data: { [ key: string ]: string }[];
}

interface TableListProps {
    tables: Table[];
    onTableSelect: (index: number) => void;
}

const TableList: React.FC<TableListProps> = ({ tables, onTableSelect }) => {
    const [tableSelected, setSelectedTable] = useState<number | null>(() => {
        const storedTable = localStorage.getItem('selectTable');
        return storedTable ? parseInt(storedTable.split("_")[1]) : 1;
    });

    const ucFirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const formatTableName = (name: string) => {
        return name.replace(/([a-zA-Z]+)(\d+)/, '$1 $2');
    };

    const handleTableSelect = (index: number) => {
        setSelectedTable(index + 1)
    }

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle className="w-100 rounded-0">
                    <i className="fa-solid fa-list"></i> Liste des tables
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100 bg-dark">
                    {tables.map((table, index) => (
                        <Dropdown.Item className="text-center" key={index} onClick={() => { onTableSelect(index); handleTableSelect(index) }}>
                            {ucFirst(formatTableName(table.name))}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <h2 className="text-center">Table n°{tableSelected}</h2>
        </div>
    );
};

export default TableList;
