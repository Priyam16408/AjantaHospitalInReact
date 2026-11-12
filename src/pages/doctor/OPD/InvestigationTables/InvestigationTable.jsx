import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { DoctorPrescriptionPrintGetPatientManualEntry } from '../../../../networkServices/DoctorApi';



const InvestigationTable = ({ setOtherTable, style, porpsData, callme }) => {

  const [allEntries, setAllEntries] = useState([])
  const [firstTests, setFirstTests] = useState([])
  // const [otherTests, setOtherTests] = useState([])
  //unique values for table headers 
  const [uniqueVal, setUniqueVal] = useState(null)

  const getManualEntries = async () => {
    const TransactionID = porpsData?.patientDetail?.currentPatient?.TransactionID || "";

    let payload = { transactionID: TransactionID };

    try {
      const response = await DoctorPrescriptionPrintGetPatientManualEntry(payload);

      if (response.success) {
        const allEntries = response.data || [];
        setAllEntries(allEntries);
        // console.log(response.data)
        // Filtering tests
        const filteredOtherTests = allEntries.filter(test => test.IsOther === 1);
        setOtherTable(filteredOtherTests);

        const filteredTests = allEntries.filter(test => test.IsOther === 0);
        // console.log(allEntries)


        setFirstTests(filteredTests);
        // Logic for unique thead
        const result = {};
        filteredTests.forEach(({ DisplayName, NAME }) => {
          if (DisplayName && NAME) {
            result[DisplayName] = result[DisplayName] || [];
            if (!result[DisplayName].includes(NAME)) result[DisplayName].push(NAME);
          }
        });

        console.log("result uniquie n func", result)

        setUniqueVal(result);
      } else {
        console.error("API response unsuccessful:", response);
        setAllEntries([]);
      }
    } catch (error) {
      console.error("Error fetching manual entries:", error);
      setAllEntries([]);
    }
  };


  useEffect(() => {
    getManualEntries()
  }, [callme])

  const dateHeaders = [...new Set(firstTests.flatMap(test =>
    Object.keys(test).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/))
  ))];



  return (
    <div className="table-responsive" style={style}>
      <Table className="table table-bordered" hover>
        <thead className='background-theme-color text-white align-items-center theme-color' style={
          {
            position: 'sticky',
            top: 0, // For header
            left: 0, // For first column
            backgroundColor: '#fff', // Ensure visibility
            zIndex: 1010, // Ensure they stay on top
          }
        }>
          <tr>
            <th colSpan={2} className="text-center my-auto">
              INVESTIGATION
            </th>
            {dateHeaders.map((date, index) => (
              <th key={index} >{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* CBC Section */}
          {/* <tr>
            <td rowSpan={4} className="fw-bold font-weight-bold">
              CBC
            </td>
            <td>Hb:</td>
            {results.map((result, index) => (
              <td key={index} className="text-center">
                {result.values.hb || ''}
              </td>
            ))}
          </tr> */}

          {uniqueVal
            ? Object.keys(uniqueVal).map((displayName) => {
              const testNames = uniqueVal[displayName];

              return testNames.map((testName, index) => {
                const testData = firstTests.find(item => item.DisplayName === displayName && item.NAME === testName);

                return (
                  <tr key={`${displayName}-${testName}`} >
                    {index === 0 ? (
                      <td rowSpan={testNames.length} style={
                        {
                          position: 'sticky',
                          // For header
                          left: 0, // For first column
                          backgroundColor: '#fff', // Ensure visibility
                          zIndex: 1000, // Ensure they stay on top
                        }
                    }>{displayName}</td>
                    ) : null}
                    <td
                    style={
                      {
                        position: 'sticky',
                        
                        left: 0, // For first column
                        backgroundColor: '#fff', // Ensure visibility
                        zIndex: 1000, // Ensure they stay on top
                      }
                  }
                    >{testName}</td>
                    {dateHeaders.map((date, i) => (
                      <td key={i} >{testData && testData[date] ? testData[date] : ''}</td>
                    ))}
                  </tr>
                );
              });
            })
            : ""}

        </tbody>
      </Table>
    </div>
  );
};

export default InvestigationTable;