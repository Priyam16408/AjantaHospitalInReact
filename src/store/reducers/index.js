import { default as authSlice } from "./loginSlice/loginSlice";
import { default as loadingSlice } from "./loadingSlice/loadingSlice";
import { default as reloadDoctor } from "./DoctorModule/patientDetailsReload";
import { default as CommonSlice } from "./common/CommonSlice";
import { default as logoutSlice } from "./AuthSlice/logoutSlice";
import { default as TokenManagementSlice } from "./TokenManagementSlice/TokenManagementSlice";
import { default as DashboardSlices } from "./dashboardSlice/DashboardSlices";
import { default as vitalSignSlice } from "./DoctorModule/VitalSign";

export {
  authSlice,
  loadingSlice,
  CommonSlice,
  logoutSlice,
  TokenManagementSlice,
  DashboardSlices,
  vitalSignSlice,
  reloadDoctor
};
