import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";


//Fetching Purchase Approval Department
  export const bindDepartments = async () => {
    try {
      const url = `${apiUrls.ApprovalBindDepartment}`;
      const data = await makeApiRequest(url, {
        method: "get",
      });
      return data;
    } catch (error) {
      throw error;
    }
  };


  export const approvalGetPurchaseRequests = async (storetype,ledgerNumber) => {
    try {
      const url = `${apiUrls.ApprovalBindPRRequest}?LedgerNumber=${storetype}&ledgerNO=${ledgerNumber}`;
      const data = await makeApiRequest(url, {
        method: "get",
      });
      return data;
    } catch (error) {
      throw error;
    }
  };


  export const approvalBindLedger = async () => {
    try {
      const url = `${apiUrls.ApprovalBindLedger}`;
      const data = await makeApiRequest(url, {
        method: "get",
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
  export const LoadApprovalRight = async () => {
    try {
      const url = `${apiUrls.ApprovalLoadApprovalRight}`;
      const data = await makeApiRequest(url, {
        method: "get",
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

// Rejct order request
  export const ApprovalGRNAppovalCancel= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.ApprovalGRNAppovalCancel}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  // get PR Items on TR click 
  export const ApprovalGetSelectedItems= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.ApprovalGetSelectedItems}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  // update Purchase approval -- approve, reject, forward
  export const ApprovalSavePurchaseApproval= async (payload) => {

    try {
      const option = {
        method: "POST",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.ApprovalSavePurchaseApproval}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  //Reject request detail
  export const ApprovalRejectItem= async (payload) => {

    try {
      const option = {
        method: "POST",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.ApprovalRejectItem}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  // UPdate Purcahse item

  export const ApprovalUpdatePurchaseApproval= async (payload) => {

    try {
      const option = {
        method: "POST",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.ApprovalUpdatePurchaseApproval}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


// Purchase order Approval

export const PurchaseOrderApprovalGetPurchaseItems= async (payload) => {

  try {
    const option = {
      method: "POST",
      data: payload,
    };
    
    const data = await makeApiRequest(
      `${apiUrls?.PurchaseOrderApprovalGetPurchaseItems}`,
      option
    );
    
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

// Purchse order Reject

export const PurchaseOrderApprovalRejectPurchaseOrder= async (payload) => {

  try {
    const option = {
      method: "POST",
      data: payload,
    };
    
    const data = await makeApiRequest(
      `${apiUrls?.PurchaseOrderApprovalRejectPurchaseOrder}`,
      option
    );
    
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

// Purchase order update order quantity details

export const PurchaseOrderApprovalUpdatePurchaseOrder= async (payload) => {

  try {
    const option = {
      method: "POST",
      data: payload,
    };
    
    const data = await makeApiRequest(
      `${apiUrls?.PurchaseOrderApprovalUpdatePurchaseOrder}`,
      option
    );
    
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};


// Purchase order get order details

export const PurchaseOrderApprovalGetPurchaseOrderDetails = async (purchaseOrderNumber) => {
  try {
    const url = `${apiUrls.PurchaseOrderApprovalGetPurchaseOrderDetails}?purchaseOrderNumber=${purchaseOrderNumber}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Purchase order approval

export const CancelPurchaseOrderItems = async (payload) => {
  try {
    const url = `${apiUrls.CancelPurchaseOrderItem}`;
    const data = await makeApiRequest(url, {
      method: "Post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PurchaseOrderApprovalApprovedPurchaseOrder = async (payload) => {
  try {
    const url = `${apiUrls.PurchaseOrderApprovalApprovedPurchaseOrder}`;
    const data = await makeApiRequest(url, {
      method: "Post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// terms And Conditions
export const PurchaseTermsandConditionSave= async (payload) => {

  try {
    const option = {
      method: "POST",
      data: payload,
    };
    
    const data = await makeApiRequest(
      `${apiUrls?.PurchaseTermsandConditionSave}`,
      option
    );
    
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const PurchaseTermsandConditionUpdate= async (payload) => {

  try {
    const option = {
      method: "POST",
      data: payload,
    };
    
    const data = await makeApiRequest(
      `${apiUrls?.PurchaseTermsandConditionUpdate}`,
      option
    );
    
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const PurchaseTermsandConditionSearch = async () => {
  try {
    const url = `${apiUrls.PurchaseTermsandConditionSearch}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PurchaseTermsandConditionDelete = async (ID) => {
  try {
    const url = `${apiUrls.PurchaseTermsandConditionDelete}?Id=${ID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};