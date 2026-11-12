import moment from "moment";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const ValidateDuplicatePatientEntry = async (values,Ids) => {
  try {
    let documentIds = []
    Ids?.length > 0 && Ids?.map((val) => {
      let obj = {}
      obj.idProofID = val?.name?.value ? val?.name?.value?.split('#')[0] : ""
      obj.idProofName = val?.name?.label
      obj.idProofNumber = val?.id
      documentIds.push(obj)
    })
    const data = await makeApiRequest(apiUrls.ValidateDuplicatePatientEntry, {
      method: "post",
      data: {
        "patientID": values?.Barcode?values?.Barcode:"",
        "firstName": values?.PFirstName?values?.PFirstName:"",
        "lastName": values?.PLastName?values?.PLastName:"",
        "mobileNumber": values?.Mobile?values?.Mobile:"",
        "IDProofs": documentIds
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
export const findAgeByDOB = async (dob) => {
  try {
    
    const data = await makeApiRequest(`${apiUrls.GetAgeByDateOfBirth}?Date=${moment(new Date(dob)).format('YYYY-MM-DD')}`, {
      method: "get"
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// ========================ECHS APIS=======================
export const getECHSDoctorsListApi = async (params) => {
  try {
    const data = await makeApiRequest(`${apiUrls.getECHSDoctorListApi}`, {
      method: "get"
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getECHSPolyclinicListApi = async (doctorId) => {
  try {
    const data = await makeApiRequest(`${apiUrls.getECHSPolyclinicsListApi}?DoctorId=${doctorId}`, {
      method: "get"
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// ========================GET REFER EMPLOYEE APIS=======================
export const getReferEmployeesListApi = async (params) => {
  try {
    const data = await makeApiRequest(`${apiUrls.getReferEmployees}`, {
      method: "get"
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PatientRegistrationAPI = async (params) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveReg, {
      method: "post",
      data: params,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
export const PatientUpdateRegistrationAPI = async (params) => {
  try {
    const data = await makeApiRequest(apiUrls.UpdateRegistration, {
      method: "post",
      data: params,
    });

    return data;
  } catch (error) {
    throw error;
  }
};