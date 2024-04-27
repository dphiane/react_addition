import React, { useState } from 'react';
import * as tables from '../assets/tables.json';
import { useNavigate } from 'react-router-dom';

const SeatingPlan = () => {
    const navigate = useNavigate();

    const [tableSelected, setSelectedTable] = useState<number | null>(null);

    const ucFirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleTableSelect = (index: number) => {
        const selectedTableIndex = index + 1;
        setSelectedTable(selectedTableIndex);
        localStorage.setItem('selectTable', `cart_${selectedTableIndex}`);
         navigate("/");
    };

    return (
        <div>
            <h1 className='text-center m-5'>Selectionner une table</h1>
            <div className='d-flex justify-content-center flex-wrap'>
                {tables.tables.map((table, index) => (
                    <button
                        className="text-center m-2 btn btn-primary" key={index} onClick={() => { handleTableSelect(index); }}>
                        {ucFirst(table.name)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SeatingPlan;
