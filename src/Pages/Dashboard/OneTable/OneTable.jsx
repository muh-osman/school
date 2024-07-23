import React, { useState, useEffect } from "react";
import style from "./OneTable.module.scss";
import { useParams } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
// API
import useGetTableData from "../../../API/useGetTableData.Api";

export default function OneTable() {
  let { tableId } = useParams();

  const { data: tableData, fetchStatus } = useGetTableData(tableId);

  const [editableData, setEditableData] = useState(tableData);

  useEffect(() => {
    setEditableData(tableData);
  }, [tableData]);

  const handleInputChange = (e, rowIndex, cellIndex) => {
    const updatedData = { ...editableData };
    updatedData.rows[rowIndex].cells[cellIndex].value = e.target.value;
    setEditableData(updatedData);
  };

  const handleColumnChange = (e, columnIndex) => {
    const updatedData = { ...editableData };
    const newColumns = [...updatedData.columns];
    const newRows = [...updatedData.rows];

    // Update the column name
    newColumns[columnIndex].name = e.target.value;

    // Reorder columns
    newColumns.sort((a, b) => a.order - b.order);

    // Update the cells order based on the new column order
    newRows.forEach((row) => {
      row.cells.sort((a, b) => {
        const cellA = a.order - 1; // Adjusting order to start from 0
        const cellB = b.order - 1; // Adjusting order to start from 0
        return newColumns[cellA].order - newColumns[cellB].order;
      });
    });

    updatedData.columns = newColumns;
    updatedData.rows = newRows;

    setEditableData(updatedData);
  };



  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {editableData && (
        <>
          <h1>
            <input
              type="text"
              value={editableData?.name}
              onChange={(e) =>
                setEditableData({ ...editableData, name: e.target.value })
              }
            />
          </h1>
          <p>
            <input
              type="text"
              value={editableData?.description}
              onChange={(e) =>
                setEditableData({
                  ...editableData,
                  description: e.target.value,
                })
              }
            />
          </p>

          <table dir="rtl" className="table table-striped">
          <thead>
  <tr>
    <th>#</th>
    {editableData.columns.sort((a, b) => a.order - b.order).map((column, columnIndex) => (
      <th key={column.id} scope="col">
        <input
          type="text"
          value={column.name}
          onChange={(e) => handleColumnChange(e, columnIndex)}
        />
      </th>
    ))}
  </tr>
</thead>
<tbody>
  {editableData.rows.sort((a, b) => a.order - b.order).map((row, rowIndex) => (
    <tr key={row.id}>
      <td>{rowIndex + 1}</td>
      {row.cells.sort((a, b) => a.order - b.order).map((cell, cellIndex) => (
        <td key={cell.id}>
          <input
            type="text"
            value={cell.value}
            onChange={(e) => handleInputChange(e, rowIndex, cellIndex)}
          />
        </td>
      ))}
    </tr>
  ))}
</tbody>

          </table>
        </>
      )}
    </div>
  );
}
