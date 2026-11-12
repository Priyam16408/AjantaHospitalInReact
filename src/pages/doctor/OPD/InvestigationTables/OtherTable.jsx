'use client';

import React from 'react';
import Table from 'react-bootstrap/Table';

function OtherTable({ style, otherTable }) {
  // Extract unique dates dynamically
  const dateHeaders = [...new Set(otherTable.flatMap(item => 
    Object.keys(item).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/))
  ))];

  return (
    <div
      className="table-container"
      style={{
        overflowX: 'auto', // Enable horizontal scrolling
        overflowY: 'auto', // Optional: Enable vertical scrolling
        maxHeight: '45vh', // Optional: Limit the table's height
        whiteSpace: 'nowrap', // Prevent wrapping of table cells
      }}
    >
      <Table bordered hover className="mb-0">
        <thead className='background-theme-color text-white align-items-center theme-color'
        style={
          {
            position: 'sticky',
            top: 0, // For header
            left: 0, // For first column
            backgroundColor: '#fff', // Ensure visibility
            zIndex: 1010, // Ensure they stay on top
          }
        }
        >
          <tr>
            <th
              className="border px-4 py-2 text-center"
              
            >
              Other Tests
            </th>
            {dateHeaders.map((date, index) => (
              <th
                key={index}
                className="border px-4 py-2 text-center"
                style={{
                  minWidth: '70px',
                  // Match header background color
                  padding: '0.5rem 1rem',
                }}
              >
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {otherTable.map((test, index) => (
            <tr key={test.ID}>
              <td className="px-4 py-2">{test.NAME}</td>
              {dateHeaders.map((date, dateIndex) => (
                <td key={dateIndex} className="px-4 py-2 text-center">
                  {test[date] || ''} {/* Display value for the date or empty cell */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OtherTable;
