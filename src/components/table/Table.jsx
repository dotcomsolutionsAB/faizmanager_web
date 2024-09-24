// MyTable.jsx
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './table.css';

const Table = ({ rowData }) => {
  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 80, maxWidth: 100, cellClass: 'cell-border'}, // Set width for ID column
    { headerName: 'Name', field: 'name', sortable: true, filter: true, cellClass: 'cell-border' },
    { headerName: 'Email', field: 'email', sortable: true, filter: true, cellClass: 'cell-border' },
    { headerName: 'Mobile', field: 'mobile', sortable: true, filter: true, cellClass: 'cell-border' },
    { headerName: 'Gender', field: 'gender', sortable: true, filter: true, cellClass: 'cell-border' },
    // Add more columns as needed
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 550, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]} // Include 10 in the selector
        enableFilter={true}
      />
    </div>
  );
};

export default Table;
