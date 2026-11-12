import React, { useEffect, useState } from 'react';
import { DoctorPrescriptionPrintGetUltraSoundTest, DoctorPrescriptionPrintSaveUltraSound } from '../../../networkServices/DoctorApi';
import Heading from '../../../components/UI/Heading';
import { t } from 'i18next';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import { Button } from 'primereact/button'; // Import PrimeReact Button
import { notify } from '../../../utils/utils';

const UltraSound = ({ patientDetail }) => {

  console.log(patientDetail)
  const [tableData, setTableData] = useState([]);
  const [uniqueTestName, setUniqueTest] = useState([]);
  const [additionalInputs, setAdditionalInputs] = useState({}); // State to track additional TextAreaInputs
  const [inputValues, setInputValues] = useState({}); // State to manage TextAreaInput values

  // Function to get unique ItemNames
  function getUniqueItemNames(data) {
    const uniqueItemNames = new Set();
    data.forEach(item => {
      uniqueItemNames.add(item.ItemName);
    });
    return Array.from(uniqueItemNames);
  }

  // Fetch data from API
  const getEntries = async () => {
    try {
      let payload = {
        PatientID: patientDetail.PatientID,
      };
      const response = await DoctorPrescriptionPrintGetUltraSoundTest(payload);
      if (response.success) {
        setTableData(response.data);
        const filteredTests = getUniqueItemNames(response.data);
        setUniqueTest(filteredTests);
        console.log('Unique tests:', filteredTests);
        console.log('API response data:', response.data);
      } else {
        console.error('API returned success as false or invalid response:', response);
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
      setTableData([]);
    }
  };

  // Handle changes in TextAreaInput
  const handleChange = (test, index, value) => {
    setInputValues((prev) => ({
      ...prev,
      [test]: {
        ...prev[test],
        [index]: value, // Update the value for the specific test and input index
      },
    }));
  };

  // Save entries
  const saveEntries = async () => {
    try {
      const payload = [];
  
      // Loop through all tests
      uniqueTestName.forEach((test) => {
        const testData = tableData.filter(item => item.ItemName === test);
        const additionalInputCount = additionalInputs[test] || 0;
  
        // Get the itemID from the first default input (if available)
        const itemID = testData.length > 0 ? testData[0].ID : null;
  
        // Process default inputs
        testData.forEach((item, idx) => {
          const value = inputValues[test]?.[idx] || item.DefaultValue || '';
          if (value) {
            payload.push({
              itemID: itemID, // Use the same itemID for all inputs under this test
              patientID: patientDetail?.PatientID,
              transactionID: patientDetail?.TransactionID,
              app_ID: patientDetail?.App_ID,
              itemName: item.ItemName,
              value: value,
              // reportDate: new Date().toISOString(),
            });
          }
        });
  
        // Process additional inputs
        for (let i = 0; i < additionalInputCount; i++) {
          const value = inputValues[test]?.[`additional-${i}`] || '';
          if (value) {
            payload.push({
              itemID: itemID, // Use the same itemID for all inputs under this test
              patientID: patientDetail?.PatientID,
              transactionID: patientDetail?.TransactionID,
              app_ID: patientDetail?.App_ID,
              itemName: test,
              value: value,
              // reportDate: new Date().toISOString(),
            });
          }
        }
      });
  
      // Send payload to API
      if (payload.length > 0) {
        const response = await DoctorPrescriptionPrintSaveUltraSound(payload);
        if (response.success) {
          getEntries();
          notify(response.message, "success");
        } else {
          console.error('API returned success as false or invalid response:', response);
        }
      } else {
        notify("No data to save", "warning");
      }
    } catch (error) {
      console.error('Error saving data:', error);
      notify("Error saving data", "error");
    }
  };

  // Function to handle adding a new TextAreaInput for a specific test
  const handleAddInput = (test) => {
    setAdditionalInputs((prev) => ({
      ...prev,
      [test]: (prev[test] || 0) + 1, // Increment the count of additional inputs for this test
    }));
  };

  useEffect(() => {
    getEntries();
  }, []);

  return (
    <>
    <div className='d-flex justify-content-end '>
        <button
          className="btn btn-sm btn-success  active-tab-menu" 
          style={{ width: "80px", }}   
          type="button"
          onClick={saveEntries}
        >
          {t("Save")}
        </button>
      </div>
    
    <div className="card patient_registration border mt-2">
      

      {uniqueTestName.map((test, index) => {
        // Filter tableData for the current test
        const testData = tableData.filter(item => item.ItemName === test);

        return (
          <div key={index} className="w-100 mb-2">
            <Heading
              title={t(test)}
              isBreadcrumb={false}
              className="w-100"
              secondTitle={
                <div style={{ }}>
                  <Button
                    icon="pi pi-plus"
                    style={{
                      padding: 0, // Remove padding
                      width: '1.5rem', // Fixed width
                      height: '1.25rem', // Fixed height
                      borderRadius: '50%', // Make it fully rounded
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => handleAddInput(test)} // Add click handler
                  />
                </div>
              }
            />
            {/* Render TextAreaInput for each item with DefaultValue */}
            {testData.map((item, idx) => (
              <TextAreaInput
                key={`default-${idx}`}
                removeFormGroupClass={true}
                className="col-12"
                name={test}
                value={inputValues[test]?.[idx] || item.DefaultValue || ''}
                rows={3}
                readOnly={!!item.DefaultValue} 
                onChange={(e) => handleChange(test, idx, e.target.value)} 
              />
            ))}
            {/* Render additional TextAreaInputs if any */}
            {Array.from({ length: additionalInputs[test] || 0 }).map((_, idx) => (
              <TextAreaInput
                key={`additional-${idx}`}
                removeFormGroupClass={true}
                className="col-12"
                name={test}
                value={inputValues[test]?.[`additional-${idx}`] || ''}
                rows={3}
                readOnly={false} // Additional inputs are always editable
                onChange={(e) => handleChange(test, `additional-${idx}`, e.target.value)} // Handle change
              />
            ))}
          </div>
        );
      })}
    </div>
    </>
  );
};

export default UltraSound;