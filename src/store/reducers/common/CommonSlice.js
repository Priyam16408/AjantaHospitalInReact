import { createSlice } from "@reduxjs/toolkit";
import { isArrayFunction, notify, renameKeys } from "../../../utils/utils";
import {
  CentreWiseCacheByCenterID,
  GetBindDepartment,
  GetBindMenu,
  GetBindReferDoctor,
  GetBindReferalType,
  GetRoleListByEmployeeIDAndCentreID,
  getEmployeeWise,
  getNotification,
  BindFrameMenuByRoleID,
  GetPanelDocument,
  GetPatientUploadDocument,
  CentreWisePanelControlCache,
  GetAdvanceReason,
  GetBindResourceList,
  GetAllDoctor,
  GetBindAllDoctorConfirmation,
  BindSeeMoreList,
  GetBindSubCatgeory,
  getBindCentre,
  getBindSpeciality,
  getBindPanelList,
  getLoadOPDDiagnosisItems,
  GetAuthorization,
} from "./CommonExportFunction";

const initialState = {
  CentreWiseCache: [],
  ReasonWiseCache: [],
  CentreWisePanelControlCacheList: [],
  GetEmployeeWiseCenter: [],
  GetMenuList: [],
  GetRoleList: [],
  GetBindReferDoctorList: [],
  GetReferTypeList: [],
  GetDepartmentList: [],
  GetPanelDocumentList: [],
  BindSeeMoreListData: [],
  GetNotifications: [],
  BindFrameMenuByRoleIDS: [],
  GetDoctorDeptList: [],
  BindResource: {},
  GetAllDoctorList: [],
  GetBindAllDoctorConfirmationData: [],
  GetBindSubCatgeoryData: [],
  getbindCentreData: [],
  getBindSpecialityData: [],
  getBindPanelListData: [],
  getLoadOPDDiagnosisItemsData: [],
  GetAuthorizationDetails: [],
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const CommonSlice = createSlice({
  name: "CommonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CentreWiseCacheByCenterID.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(CentreWiseCacheByCenterID.fulfilled, (state, { payload }) => {
        state.CentreWiseCache = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(CentreWiseCacheByCenterID.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // getEmployeeWIseCenter
      .addCase(getEmployeeWise.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getEmployeeWise.fulfilled, (state, { payload }) => {
        state.GetEmployeeWiseCenter = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getEmployeeWise.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // getMenuList
      .addCase(GetBindMenu.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindMenu.fulfilled, (state, { payload }) => {
        state.GetMenuList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindMenu.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // Notification Detail
      .addCase(getNotification.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getNotification.fulfilled, (state, { payload }) => {
        state.GetNotifications = isArrayFunction(payload.data);
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getNotification.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      // Billing Roll
      .addCase(BindFrameMenuByRoleID.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(BindFrameMenuByRoleID.fulfilled, (state, { payload }) => {
        state.BindFrameMenuByRoleIDS = isArrayFunction(payload.data);
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(BindFrameMenuByRoleID.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // getRoleList

      .addCase(GetRoleListByEmployeeIDAndCentreID.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(
        GetRoleListByEmployeeIDAndCentreID.fulfilled,
        (state, { payload }) => {
          state.GetRoleList = payload?.data;
          state.loading = false;
          state.success = true;
          state.error = "";
          state.message = payload?.Message;
        }
      )
      .addCase(
        GetRoleListByEmployeeIDAndCentreID.rejected,
        (state, { error }) => {
          console.log(error.message);
          state.loading = false;
          state.error = error.message;
          state.success = false;
          state.message = error.message;
          notify(error.message, "error");
        }
      )

      // CentreWisePanelControlCache
      .addCase(CentreWisePanelControlCache.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(CentreWisePanelControlCache.fulfilled, (state, { payload }) => {
        state.CentreWisePanelControlCacheList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.Message;
      })
      .addCase(CentreWisePanelControlCache.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      .addCase(GetBindReferDoctor.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindReferDoctor.fulfilled, (state, { payload }) => {
        state.GetBindReferDoctorList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindReferDoctor.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // get ReferType
      .addCase(GetBindReferalType.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindReferalType.fulfilled, (state, { payload }) => {
        state.GetReferTypeList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindReferalType.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // getDoctorDepartment
      .addCase(GetBindDepartment.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindDepartment.fulfilled, (state, { payload }) => {
        state.GetDepartmentList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindDepartment.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      // BindSeeMoreList
      .addCase(BindSeeMoreList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(BindSeeMoreList.fulfilled, (state, { payload }) => {
        state.BindSeeMoreListData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(BindSeeMoreList.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // GetPanelDocument
      .addCase(GetPanelDocument.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetPanelDocument.fulfilled, (state, { payload }) => {
        state.GetPanelDocumentList = payload?.data?.map((val)=>{
          val.image="" 
          return val
        });
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetPanelDocument.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // GetPatientUploadDocument
      .addCase(GetPatientUploadDocument.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetPatientUploadDocument.fulfilled, (state, { payload }) => {
        state.GetPatientUploadDocumentList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetPatientUploadDocument.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      // GetAdvanceReason
      .addCase(GetAdvanceReason.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetAdvanceReason.fulfilled, (state, { payload }) => {
        const arrayOfObjects = payload?.data?.map((item) => {
          return { label: item?.Reason, value: item?.Reason };
        });

        state.ReasonWiseCache = arrayOfObjects;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetAdvanceReason.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      // GetBindResourceList
      .addCase(GetBindResourceList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindResourceList.fulfilled, (state, { payload }) => {
        state.BindResource = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindResourceList.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // GetAllDoctor
      .addCase(GetAllDoctor.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetAllDoctor.fulfilled, (state, { payload }) => {
        state.GetAllDoctorList = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetAllDoctor.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // GetAllDoctorConfirmation
      .addCase(GetBindAllDoctorConfirmation.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindAllDoctorConfirmation.fulfilled, (state, { payload }) => {
        state.GetBindAllDoctorConfirmationData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindAllDoctorConfirmation.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // GetBindSubCatgeory
      .addCase(GetBindSubCatgeory.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetBindSubCatgeory.fulfilled, (state, { payload }) => {
        state.GetBindSubCatgeoryData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetBindSubCatgeory.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      // Token Management

      .addCase(getBindCentre.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindCentre.fulfilled, (state, { payload }) => {
        state.getbindCentreData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindCentre.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      .addCase(getBindSpeciality.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindSpeciality.fulfilled, (state, { payload }) => {
        state.getBindSpecialityData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindSpeciality.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })

      .addCase(getBindPanelList.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindPanelList.fulfilled, (state, { payload }) => {
        state.getBindPanelListData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindPanelList.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        // notify(error.message, "error");
      })

      .addCase(getLoadOPDDiagnosisItems.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getLoadOPDDiagnosisItems.fulfilled, (state, { payload }) => {
        state.getLoadOPDDiagnosisItemsData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getLoadOPDDiagnosisItems.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      // billing
      .addCase(GetAuthorization.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(GetAuthorization.fulfilled, (state, { payload }) => {
        console.log(payload?.data)
        state.GetAuthorizationDetails = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(GetAuthorization.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      });
  },
});

export default CommonSlice.reducer;
