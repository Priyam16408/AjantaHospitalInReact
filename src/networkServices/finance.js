import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const BindVoucherBillingScreenControls = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.bindVoucerListURL}?filterType=${type}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const BindCOGBankDetails = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: {
      filterType: 1,
      coalID: 0,
      coName: ""
    }
  };
  try {
    const data = await makeApiRequest(`${apiUrls.bindCOGGroupsBackendData}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const LoadCentreChartOfAccountAPI = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload
  };
  try {
    const data = await makeApiRequest(`${apiUrls.LoadCentreChartOfAccountURL}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const GetCurrencyConversionFactorAPI = async (currencyCode, voucherDate) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.GetCurrencyConversionFactorURL}?currencyCode=${currencyCode}&voucherDate=${voucherDate}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const GetPeriodClosed = async (voucherDate) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.GetPeriodClosedURL}?voucherDate=${voucherDate}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const BindGroupTable = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.BindGroupTableURL}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const BindChartOfAccount = async (params) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.BindChartOfAccountURL}?GroupCode=${params}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const bindMainGroupAPI = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.LoadGroupRecordsURL}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const SaveNewGroupAPI = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload
  };
  try {
    const data = await makeApiRequest(`${apiUrls.SaveNewGroupAPI}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const searchGetParentsData = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
    // data: payload
  };
  try {
    const data = await makeApiRequest(`${apiUrls.GetParentsData}?parentsID=${payload?.ParentsID}&branchCentreID=${payload?.BranchCentreID}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const CentreWiseGroup = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get"
  };
  try {
    const data = await makeApiRequest(`${apiUrls.SearchGroupTableURL}?CID=${payload}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ChartOfGroupUpdateStatus = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "post",
    data: payload
  };
  try {
    const data = await makeApiRequest(`${apiUrls.ChartOfGroupUpdateStatusURL}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ChartOfGroupExcel = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get"
  };
  try {
    const data = await makeApiRequest(`${apiUrls.ChartOfGroupExcelURL}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ChartOfUpdateGroupName = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "post",
    data: payload
  };
  try {
    const data = await makeApiRequest(`${apiUrls.UpdateGroupNameURL}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};



export const bindCOGGroupsBackendData = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: {
      filterType: 2,
      coalID: 0,
      coaName: ""
    }
  };
  try {
    const data = await makeApiRequest(`${apiUrls.bindCOGGroupsBackendData}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }

};



export const handlbindCOGGroupsBackendData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.bindCOGGroupsBackendData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




// ActionChartOfAccount 

export const ActionChartOfAccount = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.ActionChartOfAccount}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};







export const BindMappingData = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.BindMappingData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// SaveMapping


export const SaveMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// ActionChartOfAccount 

export const SaveNewAccountType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveNewAccountType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// SaveChartOfAccount

export const SaveChartOfAccount = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveChartOfAccount}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const Bindglobalresources = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.Bindglobalresources}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// master start 



export const BindBranchCentre = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceConsumptionBindBranchCentre}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindHisDerpatments = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindHisDerpatment}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindTransactionTypes = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindTransactionType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindScreenControl = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindScreenControls}?filterType=1`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const ConSaveMapping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveVoucherTypeMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const FinanceBindVoucherTypeMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindVoucherTypeMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceGetCountry = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.GetCountry}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindCurrencyMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindCurrencyMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceCentreWise_Coa_Mapping = async (centreId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.CentreWise_Coa_Mapping}?centreID=${centreId}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const FinanceSaveMappingData = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveMappingData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceCostSaveMapping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.CostSaveMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const FinanceDeActiveVoucherTypeMaster = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.DeActiveVoucherTypeMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceCostBindMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.CostBindMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceBindHREmployeeDepartment = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindHREmployeeDepartment}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceBindDoctorDepartment = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindDoctorDepartment}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceSaveCurrencyMaster = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveCurrencyMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const FinanceSaveVoucherTypeMaster = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveVoucherTypeMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceSaveMasterCreation = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveMasterCreation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FInanceBindMainCenter = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindMainCenter}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinaceCopyMapping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.CopyMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const deleteChangeStatus = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.ChangeStatus}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindMasterCreation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceBindMasterCreation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceLoadType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceLoadType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceCostLoadGroupRecords = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.CostLoadGroupRecords}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceFinanceAccount = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceAccount}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const FinanceCostChangeStatus = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.CostChangeStatus}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const FinanceConsumptionSaveMapping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.ConsumptionSaveMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// approval start 

export const LimitBindMapping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.VoucherLimitBindMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const VoucherLimitSaveMapping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.VoucherLimitSaveMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
// approval End

export const FinanceSaveVoucher = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceSaveVoucher}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const FinanceBindAuditBackendData = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceBindAuditBackendData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const FinanceSaveVoucherAudit = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceSaveVoucherAudit}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const BindReconciliationBank = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindReconciliationBank}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}

// approval End


// Voucher Audit Start here 

export const BindAuditBackendData = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.BindAuditBackendData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}

export const BindReportControlsAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.BindReportControlsURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const BindPayableGroup = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.BindPayableGroup}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}

// cost-center-access Controller Start
export const bindCCMappingBackendData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.bindCCMappingBackendData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// GetBankReconciliationReport

export const GetBankReconciliationReport = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.GetBankReconciliationReport}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveCostCentreemployeeMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveCostCentreemployeeMapping}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveChequeDeposit = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = { method: "post", data: payload };
    const data = await makeApiRequest(`${apiUrls.SaveChequeDeposit}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const SaveChequeBounce = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = { method: "post", data: payload };
    const data = await makeApiRequest(`${apiUrls.SaveChequeBounce}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const SupplierBindBackendData = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = { method: "post", data: payload };
    const data = await makeApiRequest(`${apiUrls.SupplierBindBackendData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}

export const SearchVoucher = async (filterType, voucherNo) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchVoucher}?filterType=${filterType}&voucherNo=${voucherNo}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}


export const FinanceUpdateStatusBulk = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = { method: "post", data: payload };
    const data = await makeApiRequest(`${apiUrls.FinanceUpdateStatusBulk}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const UpdateVoucherPostingReview = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = { method: "post", data: payload };
    const data = await makeApiRequest(`${apiUrls.UpdateVoucherPostingReview}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const SaveMapAdvanceWithPurchase = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = { method: "post", data: payload };
    const data = await makeApiRequest(`${apiUrls.SaveMapAdvanceWithPurchase}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}

export const getVoucherNoListAPI = async (AccountID, Type) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.LoadAccountDetailsURL}?AccountID=${AccountID}&Type=${Type}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const getReplicateVoucherHistoryAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.ReplicateVoucherHistoryURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const GetPendingCheque = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.GetPendingCheque}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const GetDepositCheque = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.GetDepositCheque}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindReconciliationVerifyDetails = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.BindReconciliationVerifyDetails}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const SearchReconcileDetails = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchReconcileDetails}?entryDetailID=${params}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const SearchForBoucherPostingBatch = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SearchForBoucherPostingBatch}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const FinanceSearchVoucher = async (params) => {
  // console.log("params",params)
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.FinanceSearchVoucher}?filterType=${"1"}&voucherNo=${params?.VoucherNo}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const GetBalanceSheetReport = async (payload) => {
  // console.log("params",params)
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.GetBSReportURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const FinanceBindBranchCentre = async (params) => {
  // console.log("params",params)
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.FinanceBindBranchCentre}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}

// voucher end

// Report start
export const GetTrialBalanceReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.GetTrialBalanceReport}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const GetGLReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.GetGLReport}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const PurchaseBillDueReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.PurchaseBillDueReport}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const PaybleAgingSummary = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.PaybleAgingSummary}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const GetStatementReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.GetStatementReport}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
export const FinanceReceibleAgingSummary = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.FinanceReceibleAgingSummary}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
}
// export const GetGLReport = async (payload) => {
//   store.dispatch(setLoading(true));
//   try {
//     const options = {
//       method: "post",
//       data: payload,
//     };
//     const data = await makeApiRequest(`${apiUrls.GetGLReport}`, options);
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error Found", error);
//   }
// }
