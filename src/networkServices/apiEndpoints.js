import { BindVendor } from "./InventoryApi";
import { getPatientIndentAPI } from "./pharmecy";

export const apiUrls = {
  // Auth
  login: "Login/Login",
  logout: "MasterPage/Logout",
  ReportAIChatPdf: "ReportAI/ReportAIChatPdf",

  // claim update

  UpdateCliam: "Claims/UpdateCliam",

  // Language Api End Points
  SaveLanguage: "LanguageMaster/SaveLangauge",
  GetLangaugeURL: "LanguageMaster/GetLangauge",
  UpdateLangaugeURL: "LanguageMaster/UpdateLangauge",

  // master api
  UpdateUserTheme: "MasterPage/UpdateUserTheme",
  ChangePassword: "MasterPage/ChangePassword",
  UpdateEmployeeProfile: "MasterPage/UpdateEmployeeProfile",
  getRoleList: "MasterPage/CentreWiseRoleList",
  EmployeeWiseCentreList: "MasterPage/EmployeeWiseCentreList",
  BindMenuList: "MasterPage/BindMenu",
  getNotificationDetail: "MasterPage/Notification",
  BindFrameMenuByRoleID: "MasterPage/BindFrameMenuByRoleID",
  StoreState: "PatientControl/StateInsert",
  StateInsert: "PatientControl/StateInsert",
  DistrictInsert: "PatientControl/DistrictInsert",
  CityInsert: "PatientControl/CityInsert",
  CentreWiseCacheByCenterID: "PatientControl/CentreWiseCache",
  CentreWiseCacheByCenterID: "PatientControl/CentreWiseCache",

  // DirectPatientReg Mayank START 
  CentreWisePanelControlCache: "PanelControl/CentreWisePanelControlCache",
  GetPanelDocument: "PanelControl/GetPanelDocument",
  // GetPatientUploadDocument: "PatientControl/GetMasterDocuments",
  GetPatientDocument: "PatientControl/GetPatientDocumentUpload",

  GetPatientUploadDocument: "PatientControl/GetMasterDocument",
  CreateTypeOfReference: "PatientControl/CreateTypeOfReference",
  BindSeeMoreList: "CommonAPI/BindSeeMoreList",
  CommonAPIGetEmpBirthDay: "CommonAPI/GetEmpBirthDay",
  HIMSDashboardUserRightsURL: "Dashboard/HIMSDashboardUserRights",
  HIMSDashboardGraphicalURL: "Dashboard/HIMSDashboardGraphical",
  ValidateDuplicatePatientEntry: "PatientControl/ValidateDuplicatePatientEntry",
  GetAgeByDateOfBirth: "CommonAPI/GetAgeByDateOfBirth",
  SaveReg: "Registration/SaveReg",
  UpdateRegistration: "Registration/UpdateRegistration",
  DirectDepartmentIssue: "DirectDepartmentIssue/DirectDepartmentIssueReport",
  // DirectPatientReg Mayank END

  // FRONT OFFICE API
  getECHSDoctorListApi: "PatientControl/BindECHSDoctor",
  getECHSPolyclinicsListApi: "PatientControl/BindECHSPolyclinic",
  getReferEmployees: "CommonAPI/GetReferralEmployee",
  OPDDoctorConsulationData: "OPD/DoctorConsulationData",
  OPDGetChangeBillDetails: "OPD/GetChangeBillDetails",
  OPDUpdateBillDetails: "OPD/UpdateBillDetails",
  ChangeTransactionalPanel: "OPD/ChangeTransactionalPanel",
  ChangePatientRelationDetail: "OPD/ChangePatientRelationDetail",
  OPDPatientRelationDetail: "OPD/PatientRelationDetail",
  OPDChangeTransactionalDoctor: "OPD/ChangeTransactionalDoctor",
  OPDGetIsFollowUpExist: "OPD/GetIsFollowUpExist",
  PatientFeedBackReport: "FeedBack/FeedBack/PatientDetailFeedBack",
  PatientFeedBackReportPrint: "FeedBack/FeedBack/PatientFeedBackReport",


  // payment control ----- Arshad Pathaan Khan-----
  LoadCurrencyDetail: "PaymentControl/LoadCurrencyDetail",
  PaymentControlBindPaymentModePanelWise:
    "PaymentControl/BindPaymentModePanelWise",
  GetSwipMachine: "PaymentControl/GetSwipMachine",
  GetBankMaster: "PaymentControl/GetBankMaster",
  getConvertCurrecncy: "PaymentControl/getConvertCurrecncy",
  GetConversionFactor: "PaymentControl/GetConversionFactor",
  // opdServiceBooking ----sahil--
  Oldpatientsearch: "PatientControl/Oldpatientsearch",
  PatientSearchbyBarcode: "PatientControl/PatientSearchbyBarcode",
  BindReferDoctor: "PatientControl/BindReferDoctor",
  bindPanelByPatientID: "CommonAPI/bindPanelByPatientID",
  BindRefferalType: "CommonAPI/bindReferalType",
  BindPRO: "PatientControl/bindPRO",
  BindDepartment: "CommonAPI/bindDepartment",
  BindDoctorDept: "CommonAPI/bindDoctorDept",
  CommonAPIGetDoctorIDByEmployeeID: "CommonAPI/GetDoctorIDByEmployeeID",
  bindHashCode: "CommonAPI/bindHashCode",
  RoleWiseOPDServiceBookingControls:
    "OPDServiceBooking/RoleWiseOPDServiceBookingControls",
  LoadOPD_All_ItemsLabAutoComplete:
    "CommonAPI/LoadOPD_All_ItemsLabAutoComplete",
  PackageExpirayDate: "OPDServiceBooking/PackageExpirayDate",
  ValidateDoctorMap: "OPDServiceBooking/ValidateDoctorMap",
  ValidateDoctorLeave: "OPDServiceBooking/ValidateDoctorLeave",
  GetDiscountWithCoPay: "CommonAPI/GetDiscountWithCoPay",
  getAlreadyPrescribeItem: "OPDServiceBooking/getAlreadyPrescribeItem",
  BindLabInvestigationRate: "PatientControl/BindLabInvestigationRate",
  GetAuthorization: "CommonAPI/GetAuthorization",
  BindResourceList: "CommonAPI/BindResourceList",
  GetAppointmentCount: "OPDServiceBooking/GetAppointmentCount",

  GetDoctorAppointmentTimeSlotConsecutive:
    "OPDServiceBooking/GetDoctorAppointmentTimeSlotConsecutive",

  DeleteMedicineTemplate: "PrescriptionAdvice/DeleteMedicineTemplate",
  GetMedicineTemplateDetails: "PrescriptionAdvice/GetMedicineTemplateDetails",
  SampleCollectionDiagonsis: "SampleCollection/SampleCollectionDiagonsis",
  SampleCollectionType: "SampleCollection/SampleCollectionType",
  GetBarcodeInfo: "SampleCollection/GetBarcodeInfo",

  BindPackageItemDetailsNew: "OPDServiceBooking/BindPackageItemDetailsNew",
  checkblacklist: "PatientControl/Checkblacklist",
  BindDisApproval: "PaymentControl/BindDisApproval",
  GetEligiableDiscountPercent: "PaymentControl/GetEligiableDiscountPercent",
  GetInvestigationTimeSlot: "OPDServiceBooking/GetInvestigationTimeSlot",
  BindModality: "CommonAPI/BindModality",
  HoldTimeSlot: "OPDServiceBooking/HoldTimeSlot",
  BindInvestigation: "OPDServiceBooking/BindInvestigation",
  HoldTimeSlot: "OPDServiceBooking/HoldTimeSlot",
  GetLastVisitDetail: "OPDServiceBooking/GetLastVisitDetail",
  LastVisitDetails: "OPDServiceBooking/LastVisitDetails",
  OPDCheckPanelWiseRate: "OPD/CheckPanelWiseRate",
  OPDCheckDoctorWiseRate: "OPD/CheckDoctorWiseRate",
  StickerPrintVisitWiseReport: "Sticker_Print/VisitWiseReport",

  SaveLabPrescriptionOPD: "OPDServiceBooking/SaveLabPrescriptionOPD",
  //expense voucher API --Arshad--
  GetEmployeeDoctors: "ExpenseVoucher/GetEmployeeDoctors",
  GetExpenceHead: "ExpenseVoucher/GetExpenceHead",
  GetExpenceSubHead: "ExpenseVoucher/GetExpenceSubHead",
  getApproveBy: "ExpenseVoucher/GetApprovalBy",
  addNewExpense: "ExpenseVoucher/NewExpenceTo",
  getExpenseList: "ExpenseVoucher/GetExpenceList",
  saveExpense: "ExpenseVoucher/SaveExpence",
  // Opd Advance
  GetAdvanceReason: "OPDAdvance/GetAdvanceReason",
  CreateAdvanceReason: "OPDAdvance/CreateAdvanceReason",
  SaveAdvanceAmount: "OPDAdvance/SaveAdvanceAmount",
  CommonAPIBindOPDAdvanceMaster: "CommonAPI/BindOPDAdvanceMaster",

  // end OPD Advance

  // opd Settlement
  SearchOPDBills: "OPDSettlement/SearchOPDBills",
  SaveOPDSettlement: "OPDSettlement/SaveOPDSettlement",
  // end opd settlement

  // Confirmation
  getAppointmentDetails: "Confirmation/GetApppointmentDetails",
  updateAppointmentShedule: "Confirmation/UpdateDoctorAppointmentSchedule",
  UpdateRadiologySchedule: "Confirmation/UpdateRadiologySchedule",
  GetPatientDoctorAppointmentDetails:
    "OPDServiceBooking/GetPatientDoctorAppointmentDetails",
  // Receipt_Reprint
  GetReceiptDetailnew: "ReceiptRePrint/GetReceiptDetailnew",
  OPDBillClosed: "OPD/BillClosed",
  UpdateAppointmentStatus: "Confirmation/UpdateAppointmentStatus",
  // Card Print
  searchCardPrint: "CardPrint/Binddetail",
  UploadPhoto: "CardPrint/UploadPhoto",
  ViewPhoto: "CardPrint/ViewPhoto",
  getRadiologyAppointmentDetails:
    "Confirmation/GetRadiologyApppointmentDetails",
  getBindSubCategory: "CommonAPI/BindSubCategory",
  bindAppointmentDetail: "Confirmation/bindAppointmentDetail",
  UpdatePatientDetailInAppointmentByAppID:
    "Confirmation/UpdatePatientDetailInAppointmentByAppID",

  // debitCreditNote
  SearchPatientCreditDebit: "DebitCredit/SearchPatient",
  GetDepartmentWiseDetails: "DebitCredit/GetDepartmentWiseDetails",
  GetDepartmentItemDetails: "DebitCredit/GetDepartmentItemDetails",
  GetPanelList: "DebitCredit/GetPanelList",
  SaveCreditDebitDetails: "DebitCredit/SaveCreditDebitDetails",
  BillingToolBillClaimDetails: "Billing/Tool/BillClaimDetails",
  BillingToolSaveBillClaimDetails: "Billing/Tool/SaveBillClaimDetails",
  BillingToolChemoPatientDetail: "Billing/Tool/ChemoPatientDetail",
  BillingToolSaveChemoPatientDetail: "Billing/Tool/SaveChemoPatientDetail",
  BillingToolSearchChemoHistory: "Billing/Tool/SearchChemoHistory",
  BillingToolRemoveChemoPatientDetail: "Billing/Tool/RemoveChemoPatientDetail",

  // doctor Timming

  DoctorAppointmentStatusByDoctorID:
    "PrescriptionAdvice/DoctorAppointmentStatusByDoctorID",

  // Token Management
  getBindCenterAPI: "CommonAPI/BindCentre",
  getBindFloorAPI: "ModalityMaster/BindFloor",
  saveModality: "ModalityMaster/SaveModality",
  SearchModality: "ModalityMaster/SearchModality",
  GetCounter: "ExamCounterMaster/GetCounter",
  SaveCounter: "ExamCounterMaster/SaveCounter",
  deleteCounter: "ExamCounterMaster/UpdateActive",
  updateCounter: "ExamCounterMaster/UpdateCounter",
  CheckCenterExists: "ExamCounterMaster/CheckCenterExists",
  BindCategory: "CommonAPI/BindCategory",
  SearchInvestigationSlotSchedule:
    "OnlineInvSlotMaster/SearchInvestigationSlotSchedule",
  BindDocTimingShift: "OnlineInvSlotMaster/BindDocTimingShift",
  GetBindDetail: "RecieptTokenMaster/BindDetail",
  GetCategoryName: "RecieptTokenMaster/GetCategoryName",
  SaveTokenmasterDetail: "RecieptTokenMaster/SaveTokenmasterDetail",
  IsGroupNameExists: "RecieptTokenMaster/IsGroupNameExists",
  CheckTokenPrefixExist: "RecieptTokenMaster/CheckTokenPrefixExist",
  GetSubCategoryName: "RecieptTokenMaster/GetSubCategoryName",
  GetGroupName: "RecieptTokenMaster/GetGroupName",
  GetPanelName: "CommonAPI/GetPanel",
  GetCountryList: "CommonAPI/getCountry",
  GetStateList: "CommonAPI/getState",
  GetDistrictList: "CommonAPI/getDistrict",
  GetCityList: "CommonAPI/getCity",
  EDPCityInsert: "EDP/LocationMaster/CityInsert",
  EDPDeleteCity: "EDP/LocationMaster/DeleteCity",
  EDPUpdateCity: "EDP/LocationMaster/UpdateCity",

  // Reports
  // BindDetailUser: "DailyCollection/BindUser",
  // BindTypeOfTnx: "DailyCollection/BindTypeOfTnx",
  // BindSpeciality: "CommonAPI/BindSpeciality",
  LoadOPDDiagnosisItems: "CommonAPI/LoadOPDDiagnosisItems",

  // Reports

  BindDetailUser: "DailyCollection/BindUser",
  BindTypeOfTnx: "DailyCollection/BindTypeOfTnx",
  BindSpeciality: "CommonAPI/BindSpeciality",
  //Doctor Prescription Preview
  DoctorUpdatePrescriptionview: "Doctor/UpdatePrescriptionview",
  DoctorGetPrescriptionview: "Doctor/GetPrescriptionview",
  GetAllEyeFrameByPatinetId: "Doctor/GetAllEyeFrameByPatinetId",


  //GET DOCTOR DEPARTMENTS
  getDoctorDepartments: "PrescriptionAdvice/GetDoctorDepartment",

  // View Consultation // Doctor API
  // SearchList: "ViewConsultation/SearchList",
  SearchList: "Doctor/SearchPatientConsultation",
  UpdateCall: "ViewConsultation/UpdateCall",
  UpdateUncall: "ViewConsultation/UpdateUncall",
  UpdateIn: "ViewConsultation/UpdateIn",
  LoadPrescriptionView: "PrescriptionAdvice/LoadPrescriptionView",
  SearchChiefComplaintTemplate:
    "PrescriptionAdvice/SearchChiefComplaintTemplate",
  SearchPastHistory: "PrescriptionAdvice/SearchPastHistory",
  SearchTreatmentHistory: "PrescriptionAdvice/SearchTreatmentHistory",
  SearchPersonalHistory: "PrescriptionAdvice/SearchPersonalHistory",
  SearchGeneralExamination: "PrescriptionAdvice/SearchGeneralExamination",
  SystematicExamination: "PrescriptionAdvice/SystematicExamination",
  BindGroup: "ExaminationRoom/BindGroup",
  UpdateTemperatureRoomOut: "CPOE/UpdateTemperatureRoomOut",
  TemperatureRoomSearch: "ExaminationRoom/TemperatureRoomSearch",
  SearchProvisionalDiagnosis: "PrescriptionAdvice/SearchProvisionalDiagnosis",
  SearchDoctorAdvoice: "PrescriptionAdvice/SearchDoctorAdvoice",
  LoadInvestigation: "PrescriptionAdvice/LoadInvestigation",
  SearchPrescribeMedicine: "PrescriptionAdvice/SearchPrescribeMedicine",
  SearchDietTemplate: "PrescriptionAdvice/SearchDietTemplate",
  MedicineItemSearch: "PrescriptionAdvice/MedicineItemSearch",
  GetMedicineDose: "PrescriptionAdvice/GetMedicineDose",
  BindCPOEMenu: "Doctor/BindCPOEMenu",
  FileClose: "PrescriptionAdvice/FileClose",
  FileOpen: "PrescriptionAdvice/FileOpen",
  SaveTemplate: "PrescriptionAdvice/SaveTemplate",
  DeleteTemplate: "PrescriptionAdvice/DeleteLabTemplate",
  getHoldAPI: "PrescriptionAdvice/Hold",
  OutPatient: "PrescriptionAdvice/OutPatient",
  DoctorNotes: "PrescriptionAdvice/DoctorNotes",
  VaccinationStatus: "PrescriptionAdvice/VaccinationStatus",
  ProcedureItemSearch: "Doctor/ProcedureItemSearch",
  GetSignAndSymptoms: "Doctor/GetSignAndSymptoms",
  GetMolecular: "Doctor/GetMolecular",
  GetDoctor: "Doctor/GetDoctor",
  BindConsentType: "ConsentForm/BindConsentType",
  BindTemplateContent: "ConsentForm/BindTemplateContent",
  BindPatientConsent: "ConsentForm/BindPatientConsent",
  BindTemplate: "ConsentForm/BindTemplate",
  SaveConsentType: "ConsentForm/SaveConsentType",
  SavePatientConsent: "ConsentForm/SavePatientConsent",
  DeleteSelectedTemplate: "ConsentForm/DeleteSelectedTemplate",
  ConsentFormBindPatientConsentReport: "ConsentForm/BindPatientConsentReport",
  SaveMedicineTemplate: "PrescriptionAdvice/SaveMedicineTemplate",
  GetDoctorAddedMedicineList: "PrescriptionAdvice/GetDoctorAddedMedicineList",
  ViewDischargeSummaryBind: "ViewDischargeSummary/Bind",
  SaveVitals: "VitalSign/SaveVitals",
  UpdateVitals: "VitalSign/UpdateVitals",
  BindDetails: "VitalSign/BindDetails",
  SavePrescription: "PrescriptionAdvice/SavePrescription",
  SaveSMS: "PrescriptionAdvice/SaveSMS",
  SendEmailToPatient: "PrescriptionAdvice/SendEmailToPatient",
  SearchByICDDesc: "FinalDiagnosis/SearchByICDDesc",
  SearchByICDCode: "FinalDiagnosis/SearchByICDCode",
  GetPatientDiagnosis: "FinalDiagnosis/GetPatientDiagnosis",
  DiagnosisInformationSave: "FinalDiagnosis/DiagnosisInformationSave",
  DeleteDiagnosis: "FinalDiagnosis/DeleteDiagnosis",
  SearchPatient: "ViewLabReports/SearchPatient",
  SearchPatient: "ViewLabReports/SearchPatient",
  GetPrescription: "PrescriptionAdvice/GetPrescription",
  SavePrescriptionDraft: "PrescriptionAdvice/SavePrescriptionDraft",
  GetOldAppointentData: "PrescriptionAdvice/GetOldAppointentData",
  SaveDoctorLeave: "Doctor/SaveDoctorLeave",
  BindLeave: "Doctor/BindLeave",
  UpdateDoctorLeave: "Doctor/UpdateDoctorLeave",
  BindPendingPages: "Doctor/BindPendingPages",
  BindAvailablePages: "Doctor/BindAvailablePages",
  MenuInsert: "Doctor/MenuInsert",
  MenuUpdate: "Doctor/MenuUpdate",
  SequenceUpdate: "Doctor/SequenceUpdate",
  SaveDoctorNA: "Doctor/SaveDoctorNA",
  BindDoctorNA: "Doctor/BindDoctorNA",
  BindProMaster: "DoctorRealtedOpdReports/BindProMaster",
  UpdateDoctorNA: "Doctor/UpdateDoctorNA",

  //Doctor Prescription multi print Api

  getAppointDetailsSearch: "PrescriptionAdvice/AppointDetailsSearch",
  getPrescriptionPrint: "DoctorPrescriptionPrint/MultipleDoctorPrescriptionReportPdf",

  // Dashboard API

  HIMSDashboard: "Dashboard/HIMSDashboard",
  HIMSDashboardTYPEID: "Dashboard/HIMSDashboardDetail",
  DashboardMISUserWiseGraphSetting: "Dashboard/MISUserWiseGraphSetting",

  // IPDHelpDesk
  IPDDetail: "IPDHelpDesk/IPDDetail",
  Report: "IPDHelpDesk/Report",

  // PackageDetailOPD
  BindOPDPackage: "OPDPackageDetail/BindOPDPackage",
  PackageDetail: "OPDPackageDetail/PackageDetail",
  BindPackageRate: "OPDPackageDetail/BindPackageRate",
  GetOpdPackageDetail: "OPD/GetOpdPackageDetail",
  // PanelDetail

  BindPanelGroup: "PanelDetail/BindPanelGroup",
  PanelSearch: "PanelDetail/PanelSearch",

  // CostEstimateBilling
  BindRoomType: "SurgeryEstimate/BindRoomType",
  BindIPDPackage: "SurgeryEstimate/BindIPDPackage",
  BindSurgery: "SurgeryEstimate/BindSurgery",
  BindPredefinedEstimation: "SurgeryEstimate/BindPredefinedEstimation",
  BindPreEstimateCost: "SurgeryEstimate/BindPreEstimateCost",
  BindEstimationByDefault: "SurgeryEstimate/BindEstimationByDefault",
  SaveCostEstimation: "SurgeryEstimate/SaveCostEstimation",

  // Billings
  AdmissionType: "IPDDetail/AdmissionType",
  RoomType: "IPDDetail/RoomType",
  BillingCategory: "IPDDetail/BillingCategory",
  BindRoomBed: "IPDDetail/BindRoomBed",
  BindFloor: "IPDDetail/BindFloor",
  PatientSearch: "IPDDetail/PatientSearch",
  SaveIPDAdmission: "IPDDetail/SaveIPDAdmission",
  IPDAdmissionReport: "CurrentStock/IPDAdmissionReport",
  bindPanelRoleWisePanelGroupWise: "IPDDetail/bindPanelRoleWisePanelGroupWise",
  GetPatientAdmissionDetails: "IPDDetail/GetPatientAdmissionDetails",
  UpdatePatientAdmissionDetails: "IPDDetail/UpdatePatientAdmissionDetails",
  IsReceivedPatient: "IPDDetail/IsReceivedPatient",
  GetBillDetails: "PatientBilling/GetBillDetails",
  GetBindDepartment: "PatientBilling/GetBindDepartment",
  GetAllAuthorization: "PatientBilling/GetAllAuthorization",
  PatientBillingBindItem: "PatientBilling/BindItem",
  LoadDetails: "Clearance/LoadDetails",
  CheckDetails: "Clearance/CheckDetails",
  SaveClearance: "Clearance/SaveClearance",
  BindCurrencyDetails: "Clearance/BindCurrencyDetails",
  LoadMedetail: "Clearance/LoadMedetail",
  BindIPDPatientDetails: "IPDAdvance/BindIPDPatientDetails",
  getCTBRequestDetail: "IPDAdvance/getCTBRequestDetail",
  SelectIPDDetail: "IPDAdvance/SelectIPDDetail",
  GetDiscReason: "PaymentControl/GetDiscReason",
  SaveDiscReason: "IPDAdvance/SaveDiscReason",
  SaveIPDAdvance: "IPDAdvance/SaveIPDAdvance",
  SendPanelApprovalEmail: "PanelRequest/SendPanelApprovalEmail",
  GetPanelApprovalDetails: "PanelRequest/GetPanelApprovalDetails",
  BindPanelDetail: "PanelRequest/BindPanelDetail",
  BindPanels: "PanelRequest/BindPanels",
  IPDAdvanceBindPatientDetails: "IPDAdvance/BindPatientDetails",
  BillingShowItemDetails: "Billing/ShowItemDetails",
  BindItemSurgery: "InvesigationRequisition/BindItemSurgery",
  BindDocType: "IPDAdvance/BindDocType",
  Rate: "IPDAdvance/Rate",
  SaveSurgery: "IPDAdvance/SaveSurgery",
  PatientBillingGetDiscount: "PatientBilling/GetDiscount",
  BillingGetRateFromFollowedPanel: "Billing/GetRateFromFollowedPanel",
  BillingSaveSaveServicesBilling: "BillingSave/SaveServicesBilling",
  PatientBillingEditPackage: "PatientBilling/EditPackage",
  BillingRemarkLoadRemarks: "BillingRemark/LoadRemarks",
  BillingRemarkSaveRemark: "BillingRemark/SaveRemark",
  IPDAdvanceLoadSurgeryDetail: "IPDAdvance/LoadSurgeryDetail",
  IPDAdvanceLoadSurgery: "IPDAdvance/LoadSurgery",
  ReportMenu: "Billing/ReportMenu",
  ReportSubMenu: "Billing/ReportSubMenu",
  BindSupplier: "Billing/BindSupplier",
  CurrentStockSelfDeclaration: "CurrentStock/SelfDeclaration",
  CurrentStockDischargeSlip: "CurrentStock/DischargeSlip",
  CurrentStockGeneralConsertForm: "CurrentStock/GeneralConsertForm",

  //PanelApproval
  BindApprovalData: "PanelRequest/BindApprovalData",
  PanelApprovalReject: "PanelRequest/PanelApprovalReject",
  GetPanelAprovalAmount: "PanelRequest/GetPanelAprovalAmount",
  UpdateBilling: "PanelRequest/UpdateBilling",
  BindStoreDepartment: "MedicineRequisition/BindStoreDepartment",
  ToolBindDepartment: "Tool/BindDepartment",
  BindItem: "MedicineRequisition/BindItem",
  BindSubcategory: "MedicineRequisition/BindSubcategory",
  BindRoute: "MedicineRequisition/BindRoute",
  GetTimeDuration: "MedicineRequisition/GetTimeDuration",
  PatientBillingReject: "PatientBilling/Reject",
  PatientBillingSaveEdit: "/PatientBilling/SaveEdit",
  PatientBillingAllTabSave: "PatientBilling/AllTabSave",
  PatientBillingGetPackage: "PatientBilling/GetPackage",
  getAlreadyPrescribeItem: "OPDServiceBooking/getAlreadyPrescribeItem",
  LoadIndentMedicine: "MedicineRequisition/LoadIndentMedicine",
  LoadMedicineSet: "MedicineAdviceOld/LoadMedicineSet",
  LoadMedSetItems: "MedicineRequisition/LoadMedSetItems",
  LoadIndentItems: "MedicineRequisition/LoadIndentItems",
  SaveIndent: "MedicineRequisition/SaveIndent",
  GetMedicineStock: "MedicineRequisition/GetMedicineStock",
  BindRequisitionType: "MedicineRequisition/BindRequisitionType",
  PatientBillingItemPackageSave: "PatientBilling/ItemPackageSave",
  PatientBillingPayable: "PatientBilling/Payable",
  MISBedManagementSummary: "MIS/BedManagementSummary",
  MISBindBedStatus: "MIS/BindBedStatus",
  SaveRequisition: "MedicineRequisition/SaveRequisition",
  MedBindDetails: "MedicineReturnRequisition/BindDetails",
  BillingCTBDetail: "Billing/IPD/CTBDetail",
  BillingIPDSaveCTBDetail: "Billing/IPD/SaveCTBDetail",
  BillingIPDGetCTBDetails: "Billing/IPD/GetCTBDetails",
  DoctorAndRoomShift: "DoctorShift/DoctorAndRoomShift",
  BindDocDetails: "DoctorShift/BindDocDetails",
  IPDAdvanceGetCTBList: "IPDAdvance/GetCTBList",
  IPDAdvanceGetCTBDetails: "IPDAdvance/GetCTBDetails",
  IPDAdvanceGetCTBDetailsReport: "IPDAdvance/GetCTBDetailsReport",
  BindRoomDetails: "DoctorShift/BindRoomDetails",
  SaveInvestigationRequisition:
    "InvesigationRequisition/SaveInvestigationRequisition",
  LoadDiffPanelRates: "TariffChange/LoadDiffPanelRates",
  SaveTariffic: "TariffChange/SaveTariffic",
  BindBloodGroup: "BloodBank/BindBloodGroup",
  LoadItems: "BloodBank/LoadItems",
  SaveReturnReuisition: "MedicineReturnRequisition/SaveReturnReuisition",
  UpdateBloodgroup: "BloodBank/UpdateBloodgroup",
  SaveBloodBank: "BloodBank/SaveBloodBank",
  BindRequestDetails: "BloodBank/BindRequestDetails",
  GetPatientAdjustmentDetails: "IPDAdvance/GetPatientAdjustmentDetails",
  GetPatientReceipt: "IPDAdvance/GetPatientReceipt",
  GetApproval: "Approval/GetApproval",
  UpdateApproval: "Approval/UpdateApproval",
  CommonReceiptPdf: "CommonReciept_PDF/CommonReceiptPdf",
  GetStickersReceipt: "Sticker_Print/Sticker_PrintPDF",
  BindHospLedgerAccount: "IPDAdvance/BindHospLedgerAccount",
  RevenueAnalysisDetail: "IPDBillingStatus/RevenueAnalysisDetail",
  PatientAdmittedList: "IPDBillingStatus/PatientAdmittedList",
  DischargeIntimation: "IPDBillingStatus/DischargeIntimation",
  BillFreezedButNotDischarged: "IPDBillingStatus/BillFreezedButNotDischarged",
  PatientDischarged: "IPDBillingStatus/PatientDischarged",
  DischargedButBillNotGenerated:
    "IPDBillingStatus/DischargedButBillNotGenerated",
  BillGenerated: "IPDBillingStatus/BillGenerated",
  IPDBillRegisterSummary: "IPDBillingStatus/IPDBillRegisterSummary",
  getStoreBindDepartment: "Requisition/BindDepartment",
  GetCategoryByStoreType: "Requisition/GetCategoryByStoreType",
  GetSubCategoryByCategory: "Requisition/GetSubCategoryByCategory",
  GetStore: "Requisition/GetStore",
  BindSubGroup: "IssueDepartment/BindSubGroup",
  // BindStoreDepartment :"CommonAPI/BindStoreDepartment",
  GetItems: "Requisition/GetItems",
  GetItemStockDetailsRequisition: "Requisition/GetItemStockDetails",
  BindStoreRequisitionDepartment: "Requisition/BindDepartment",
  getCreateRequisition: "Requisition/CreateRequisition",
  GetAutoPurchaseRequestItemsApi: "Requisition/GetAutoPurchaseRequestItems",

  //======================GET BILL API=======================
  getIncludeBill: "OPD/GetBillDetails",
  saveOPDSaveLabPackageDetails: "OPD/OPDSaveLabPckageDetails",

  //Discharge Tracker
  LoadDetailsTracker: "DischargeTracker/LoadDetails",
  DischargeTrackerReport: "DischargeTracker/DischargeTrackerReport",

  // NurseAssignment
  bindAvailablenurse: "NurseAssignment/bindAvailablenurse",
  RoomTypeNurse: "IPDDetail/RoomType",
  BindFloorNurse: "IPDDetail/BindFloor",
  SearchNurse: "NurseAssignment/Search",
  SaveNurseAssignment: "NurseAssignment/SaveNurseAssignment",

  // sampleCOllection
  SearchSampleCollectionWord: "NursingWard/SearchSampleCollectionWord",
  SearchInvestigation: "SampleCollection/SearchInvestigation",
  BindSampleType: "SampleCollection/BindSampleType",
  SaveSamplecollection: "SampleCollection/SaveSamplecollection",
  SampleRejection: "SampleCollection/SampleRejection",
  SampleCollUploadDocument: "NursingWard/UploadDocument",
  bindSampleColleDocumentURL: "NursingWard/bindAttachment",
  SampleCollOpenDocumentURL: "NursingWard/bindAttachment",

  // reports Api start here

  SampleCollectionReport: "SampleCollectionReport/SearchSampleCollection",
  SampleOutSource: "SampleCollectionReport/SearchOutSourceCollection",
  LabCountReport: "LaboratoryCountReport/LabReport",
  BindDepartmentCount: "LaboratoryCountReport/BindDepartment",


  // SampleCollection Module
  // SearchSampleCollection: "SampleCollection/SearchSampleCollection",
  SearchSampleCollection: "SampleCollection/SearchSampleCollections",
  BindCentre: "SampleCollection/BindCentre",
  SampleTransferSearchInvestigation:
    "SampleCollection/SampleTransferSearchInvestigation",
  SaveSampleTransfer: "SampleCollection/SaveSampleTransfer",
  SampleDispatchSearch: "SampleCollection/SampleDispatchSearch",
  LogisticReceiveSearch: "LogisticReceive/SearchInvestigation",

  // Category Medication Record
  CategoryMedicationRecord: "NursingWard/BindCategoryMedicationRecordNew",
  BindMedicineGrid: "NursingWard/BindMedicineGrid",
  BindMedicineDetail: "NursingWard/BindMedicineDetail",
  MedicineTimes: "NursingWard/MedicineTimes",
  FreQuency: "NursingWard/FreQuency",
  Route: "NursingWard/Route",
  MedicineDetailsSave: "NursingWard/MedicineDetailsSave",
  SaveDoseDetails: "NursingWard/SaveDoseDetails",
  MedicineDetailsCancel: "NursingWard/MedicineDetailsCancel",

  // vitalSign
  SearchVitalSignChart: "NursingWard/SearchVitalSignChart",
  SaveVitalSignChart: "NursingWard/SaveVitalSignChart",
  UpdateVitalSignChart: "NursingWard/UpdateVitalSignChart",
  PrintVitalSignChart: "NursingWard/PrintVitalSignChart",
  // Nusing progressnote
  SearchNursingProgress: "NursingWard/SearchNursingProgress",
  SaveNursingProgress: "NursingWard/NursingProgress",
  UpdateClickNursingProgress: "NursingWard/UpdateClickNursingProgress",
  PrintNurNote: "NursingWard/PrintNurNote",
  NursingWardSaveRoomShiftRequset: "NursingWard/Nursing/SaveRoomShiftRequset",
  NursingWardGetRoomShiftRequset: "NursingWard/Nursing/GetRoomShiftRequset",
  NursingWardRejectRoomShiftRequset: "NursingWard/Nursing/RejectRoomShiftRequset",

  // oxygen Record form
  bindOxygenData: "NursingWard/bindOxygenData",
  bindOxygenRecord: "NursingWard/bindOxygenRecord",
  validateOxygenRecord: "NursingWard/validateOxygenRecord",
  SaveOxygenRecord: "NursingWard/SaveOxygenRecord",
  UpdateOxygenRecord: "NursingWard/UpdateOxygenRecord",

  // Blood Gas Chart
  bindGasBloodChart: "NursingWard/GrdNursingbind",
  BloodGasChartSave: "NursingWard/BloodGasChartSave",
  BloodGasChartUpdate: "NursingWard/BloodGasChartUpdate",
  BloodGasChartPrintURL: "NursingWard/BloodGasChartPrint",

  // PhysiologicalEarlyWarning
  BindPhysiologicalEarlyWarning: "NursingWard/BindPhysiologicalEarlyWarning",
  PhysiologicalSearchAssessmentData:
    "NursingWard/PhysiologicalSearchAssessmentData",
  SaveEarlyWarningScoringDetails: "NursingWard/SaveEarlyWarningScoringDetails",

  // nurseWard
  BindDiabiaticParticular: "NursingWard/BindDiabiaticParticular",
  DiabeticChartSave: "NursingWard/DiabeticChartSave",
  BindDiabiaticChart: "NursingWard/BindDiabiaticChart",
  DiabeticChartUpdate: "NursingWard/DiabeticChartUpdate",
  DiabeticChartPrintURL: "NursingWard/DiabeticChartPrint",

  // intake and outputchart
  NursingWardBindData: "/NursingWard/BindData",
  NursingWardSaveIntake: "/NursingWard/SaveIntake",
  NursingWardIntakeOutPutChartPrintURL: "/NursingWard/IntakeOutPutChartPrint",

  // NursesDischargeNote

  NursingWardBindDetails: "/NursingWard/BindDetails",
  NursingWardNursingDischargeSave: "NursingWard/NursingDischargeSave",
  NursingWardNursingDischargeDeleting: "NursingWard/NursingDischargeDeleting", //pending

  // needle injury

  NursingWardBindNeedleName: "NursingWard/BindNeedleName",
  NursingWardNeedleInjurySave: "NursingWard/NeedleInjurySave",
  NursingWardBindInjury: "NursingWard/BindInjury",

  // NICU Serum

  NursingWardBindGraphTemp: "NursingWard/BindGraphTemp",
  NursingWardSerumBilirubinSave: "NursingWard/SerumBilirubinSave",

  // Bady Charts
  NursingWardGetBabyCharDetails: "NursingWard/GetBabyCharDetails",
  NursingWardSaveBabyChart: "NursingWard/SaveBabyChart",
  NursingWardBabyChartPrintURL: "NursingWard/BabyChartPrint",

  // discharge checklist

  NursingWardBindPatientDetail: "NursingWard/BindPatientDetail",
  NursingWardSaveCheckList: "NursingWard/SaveCheckList",
  NursingWardUpdateCheckList: "NursingWard/UpdateCheckList",
  NursingWardDischargeCheckListPrintURL: "NursingWard/DischargeCheckListPrint",

  // DeceasedPatientDetail

  NursingWardBindDeceasedPatientDetail: "NursingWard/BindDeceasedPatientDetail",
  NursingWardDeceasedPrint: "NursingWard/DeceasedPrint",
  NursingWardDeceasedUpdateCheckList: "NursingWard/DeceasedUpdateCheckList",
  NursingWardDeceasedSaveCheckList: "NursingWard/DeceasedSaveCheckList",

  // adult fall Risk Assesment

  NursingWardSaveAssessMentRecord: "NursingWard/SaveAssessMentRecord",
  NursingWardSearchAssessmentData: "NursingWard/SearchAssessmentData",
  NursingWardUpdateAssessMentRecord: "NursingWard/UpdateAssessMentRecord",

  // update Patient Documents
  NursingWardPatientDocumentDetail: "/NursingWard/PatientDocumentDetail",
  NursingWardSaveViewUploadDocument: "NursingWard/SaveViewUploadDocument",

  // BindBabyFeeding

  NursingWardBindBabyFeeding: "NursingWard/BindBabyFeeding",
  NursingWardSaveBabyFeeding: "NursingWard/SaveBabyFeeding",

  // credit Control

  // genreate Invoice

  CreditControlSearch: "CreditControl/Search",
  CreditControlSaveDispatch: "CreditControl/SaveDispatch",

  // cancel invoice

  CreditControlInvoiceSearch: "CreditControl/InvoiceSearch",
  CreditControldispatchData: "CreditControl/dispatchData",
  CreditControlDispatchCancel: "CreditControl/DispatchCancel",

  // invoice settlement
  CreditControlPanelInvoiceSearch: "CreditControl/PanelInvoiceSearch",
  CreditControlBindInoviceData: "CreditControl/BindInoviceData",

  // discharge summary

  DischargeSummaryBindReportHeader: "/DischargeSummary/BindReportHeader",
  DischargeSummaryBindConsultant: "DischargeSummary/BindConsultant",
  DischargeSummaryConsultantAdd: "DischargeSummary/ConsultantAdd",
  DischargeSummaryDeleteConsultant: "DischargeSummary/DeleteConsultant",
  DischargeSummaryDRHeader: "DischargeSummary/DRHeader",
  DischargeSummaryBindRoute: "DischargeSummary/BindRoute",
  DischargeSummaryBindTimeofNextDose: "DischargeSummary/BindTimeofNextDose",
  DischargeSummaryBindMeal: "DischargeSummary/BindMeal",
  DischargeSummaryBindTime: "DischargeSummary/BindTime",
  DischargeSummaryEMRMedicine: "DischargeSummary/EMRMedicine",
  DischargeSummaryICDDescriptionSave: "DischargeSummary/ICDDescriptionSave",
  DischargeSummaryBindPatient: "DischargeSummary/BindPatient",
  DischargeSummaryICDCodeRemove: "DischargeSummary/ICDCodeRemove",
  DischargeSummaryICDMasterSave: "DischargeSummary/ICDMasterSave",
  BindEMRMedicine: "DischargeSummary/BindEMRMedicine",
  DeleteEMRMedicine: "DischargeSummary/DeleteEMRMedicine",
  BindEMRInvItem: "DischargeSummary/BindEMRInvItem",
  SaveEMRInvItem: "DischargeSummary/SaveEMRInvItem",

  NuclearMedicine: "DischargeSummary/SaveNuclearMedTest",
  GetNuclearMedicineTable: "DischargeSummary/GetNuclearMedTest",
  UpdateNuclearMedTest: "DischargeSummary/UpdateNuclearMedTest",

  // Discharge Report
  DRDetailsLoadHeaders: "DRDetails/LoadHeaders",
  DRDetailsGetDRDetails: "DRDetails/GetDRDetails",
  DRDetailsLoadTemplates: "DRDetails/LoadTemplates",
  DRDetailsBindDetails: "DRDetails/BindDetails",
  DRDetailsBindApprovalDoctor: "DRDetails/BindApprovalDoctor",
  DRDetailsTemplateChange: "DRDetails/TemplateChange",
  DRDetailsTemplateDelete: "DRDetails/TemplateDelete",
  DRDetailsSaveDischargeSummary: "DRDetails/SaveDischargeSummary",
  DRDetailsPatientTemplateDelete: "DRDetails/PatientTemplateDelete",
  // DRDetailsBindApprovalDoctor: "DRDetails/BindApprovalDoctor",
  DRDetailsApproveDischargeSummary: "DRDetails/ApproveDischargeSummary",

  // dischargeSummary master

  DischargeSummarySaveEMRHeader: "DischargeSummary/SaveEMRHeader",
  DischargeSummaryBindEMRHeader: "DischargeSummary/BindEMRHeader",
  DischargeSummarySaveEMRHeaderTable: "DischargeSummary/SaveEMRHeaderTable",

  // dischargeSummary setHeaderDeptWise

  DischargeSummaryBindHeaderList: "DischargeSummary/BindHeaderList",
  DischargeSummarySaveSetHeaderDeptWise:
    "DischargeSummary/SaveSetHeaderDeptWise",

  // dischargeSummary setHeaderMandoratoy

  DischargeSummaryBindHeader: "DischargeSummary/BindHeader",
  DischargeSummaryBindDischargeType: "DischargeSummary/BindDischargeType",

  // MRD
  MRDBindPatientType: "MRD/BindPatientType",
  MRDBindCaseType: "MRD/BindCaseType",
  MRDBindPanelIPD: "MRD/BindPanelIPD",
  MRDBindParentPanel: "MRD/BindParentPanel",
  MRDBindDischargeType: "MRD/BindDischargeType",
  MRDSearchGrid: "MRD/SearchGrid",
  MRDPatientSearchMRDRecieved: "MRD/PatientSearchMRDRecieved",
  MRDBindDocuments: "MRD/BindDocuments",
  MRDFileRegisterSave: "/MRD/FileRegisterSave",
  MRDBindgrd: "MRD/Bindgrd",
  MRDScanFileUpload: "MRD/ScanFileUpload",
  MRDScanFileView: "MRD/ScanFileView",
  MRDBindRoomCMB: "MRD/BindRoomCMB",
  MRDBindAlmirah: "MRD/BindAlmirah",
  MRDBindShelf: "MRD/BindShelf",
  MRDSetLocation: "MRD/SetLocation",
  MRDSearchPatient: "MRD/SearchPatient",
  MRDSaveSentFile: "MRD/SaveSentFile",
  MRDMRDSentfilestatus: "MRD/MRDSentfilestatus",
  MRDMRDRequisitionSearch: "/MRD/MRDRequisitionSearch",
  MRDSaveMRDRequisition: "MRD/SaveMRDRequisition",
  SaveMRDReturnFile: "MRD/SaveMRDReturnFile",
  MRDGetFileStatus: "MRD/GetFileStatus",
  MRDMLCDetailUpdate: "MRD/MLCDetailUpdate",
  MRDBindDetails: "MRD/BindDetails",
  MRDSearchMRDRequisition: "MRD/SearchMRDRequisition",
  MRDApprovedRequisition: "MRD/ApprovedRequisition",
  MRDSearchRequisition: "MRD/SearchRequisition",
  MRDSearchIssueFile: "MRD/SearchIssueFile",
  MRDBindPatientDetails: "MRD/BindPatientDetails",
  MRDBindPatientDetail: "MRD/BindPatientDetail",
  MRDBindFileDetailURL: "MRD/BindFileDetail",
  MRDBindRequisitionDetailURL: "MRD/BindRequisitionDetail",
  MRDBindFileDocURL: "MRD/BindFileDoc",
  MRDBindEmployeeURL: "MRD/BindEmployee",
  MRDFileIssueSaveURL: "MRD/FileIssueSave",
  MRDFileReturnSave: "/MRD/FileReturnSave",
  EnDisableSave: "/MRD/EnDisableSave",
  MRDSearch: "MRD/Search",
  MRDSavedocument: "MRD/Savedocument",
  MRDBindDocumentlist: "MRD/BindDocumentlist",
  MRDEditDcouementName: "MRD/EditDcouementName",
  MRDBindRoom: "MRD/BindRoom",
  MRDSaveNewRoom: "MRD/SaveNewRoom",
  MRDBindMRDRack: "MRD/BindMRDRack",
  MRDSaveNewRack: "MRD/SaveNewRack",
  MRDBindRackDetail: "MRD/BindRackDetail",
  MRDSaveLoation: "MRD/SetLocationSave",
  BindNABH: "MRD/BindNABH",
  // pdf url
  CommonReciept_PDFCommonReceiptPdf: "CommonReciept_PDF/CommonReceiptPdf",
  NursingWardDeceasedPrint: "NursingWard/DeceasedPrint",
  NursingWardPrintNurNote: "NursingWard/PrintNurNote",
  NursingWardDischargeCheckListPrint: "NursingWard/DischargeCheckListPrint",
  NursingWardDiabeticChartPrint: "NursingWard/DiabeticChartPrint",
  NursingWardIntakeOutPutChartPrint: "NursingWard/IntakeOutPutChartPrint",
  PrintSticker: "CardPrint/PrintSticker",
  ViewReqEmgPrintURL: "Emergency/PatientRequisitionReportPdf",
  PrintCard: "CardPrint/PrintCard",
  PhysiologicalEWSPrint: "NursingWard/PhysiologicalEWSPrint",
  BloodGasChartPrint: "NursingWard/BloodGasChartPrint",
  NursingWardAdultFallRiskPrint: "NursingWard/AdultFallRiskPrint",
  NursingWardNeedleInjuryPrint: "NursingWard/NeedleInjuryPrint",
  NursingWardBabyChartPrint: "NursingWard/BabyChartPrint",
  DoctorPrescriptionPrint:
    "DoctorPrescriptionPrint/DoctorPrescriptionReportPdf",

  //top 5 suggestion by doctor ID - Akhilesh
  DoctorPrescriptionPrintGetSuggestion: "DoctorPrescriptionPrint/GetSuggestion",

  //investigation Manual Entry
  GetInvestigationManualEntries:
    "DoctorPrescriptionPrint/GetInvestigationManualEntries",
  DoctorPrescriptionPrintCreateInvestigationManualEntries:
    "DoctorPrescriptionPrint/CreateInvestigationManualEntries",
  DoctorPrescriptionPrintGetPatientManualEntry:
    "DoctorPrescriptionPrint/GetPatientManualEntry",
  DoctorPrescriptionPrintGetInvestigationManualEntriesbyDate:
    "DoctorPrescriptionPrint/GetInvestigationManualEntriesbyDate",

  //eye form ----------------
  DoctorSaveEyeFrame: "Doctor/SaveEyeFrame",

  //ULtraSound
  DoctorPrescriptionPrintGetUltraSoundTest: "DoctorPrescriptionPrint/GetUltraSoundTest",
  DoctorPrescriptionPrintSaveUltraSound: "DoctorPrescriptionPrint/SaveUltraSound",

  // Child vaccination chat
  PrescriptionAdviceGetChildVaccineChart:
    "PrescriptionAdvice/GetChildVaccineChart",
  PrescriptionAdviceGiveVaccineToChild: "PrescriptionAdvice/GiveVaccineToChild",

  PrescriptionAdviceGetNewChildVaccineChart: "PrescriptionAdvice/GetNewChildVaccineChart",

  // baby growth chart
  DoctorAddBabyGrowth: "Doctor/AddBabyGrowth",
  DoctorGetBabyGrowthRecords: "Doctor/GetBabyGrowthRecords",
  DoctorUpdateBabyGrowth: "Doctor/UpdateBabyGrowth",
  DoctorBindchartWeight: "Doctor/BindchartWeight",

  ReportsRegistrationDetail: "Reports/RegistrationDetail",
  OPDAdvanceOutStandingReport: "Reports/OPDAdvanceOutStandingReport",
  DoctorRealtedOpdReportsRefundReport:
    "DoctorRealtedOpdReports/AppointmentConfirmationReport",
  RefundReport: "Reports/RefundReport",
  DailyCollectionDailyCollection: "DailyCollection/DailyCollection",
  OPDBillRegisterReports: "Reports/OPDBillRegister",
  CreditControlInvoiceSettlementReport: "CreditControl/InvoiceSettlementReport",
  CreditControlInvoiceSettlementPdf: "CreditControl/InvoiceSettlementPdf",
  PatientHistoryDetails: "Reports/PatientHistoryDetails",
  //  doctor department mapping
  CreatDepartmentMapping: "PrescriptionAdvice/CreatDepartmentMapping",
  GetDoctorDepartmentMapping: "PrescriptionAdvice/GetDoctorDepartmentMapping",
  UpdateIsdefaulDepartmentMapping:
    "PrescriptionAdvice/UpdateIsdefaulDepartmentMapping",

  //by Aakash start
  GetOpdPrintOptions: "DoctorPrescriptionPrint/GetPrecriptionPreviewSetting",
  getInvestigationFavrateTemplates: 'PrescriptionAdvice/GetLabTemplete',
  saveInvestigationFavrateTemplates: 'PrescriptionAdvice/CreateSummaryWithDetails',
  getInvestigationFavrateTemplatesDetails: 'PrescriptionAdvice/GetLabTempleteDetails',
  getLabRadiolozyCategory: 'MachineResultEntry/GetRadiologyLabCateogry',
  getLabRadiolozySubCategory: 'MachineResultEntry/GetRadiologyLabSubCategory',
  saveSaveLabTemplateAndComment: "MachineResultEntry/SaveLabTemplateAndComent",
  dietPatientSearch: "KichenDiet/KitchenPatientSearch",
  savePatientDiet: "KichenDiet/AddPatientIssue",
  getPatientKitchenDietType: "KichenDiet/DietMasterList",
  getPatientKitchenDietList: "KichenDiet/PatientIssueDetails",
  bindDietSchedular: "KichenDiet/CreatePreviousDay",
  getPatientRequestType: "KichenDiet/GetNatureOfRequisition",
  SavePatientRequest: "KichenDiet/PatientDietRequesition",
  getPatientRequestList: "KichenDiet/getDietRequesition",
  updatePatientStatusRequisition: "KichenDiet/UpdatePatientDietRequesitionStatus",
  wardWisePatientAsDate: "KitchenDietReport/WardWisePatientAsDate",
  dietRequisitionReport: "KitchenDietReport/DietRequisitionReport",
  dietReport: "KitchenDietReport/DietReport",
  getPatientIndentApproval: "KichenDiet/GetDietRequesitionDateWise",
  getBloodGroups: "MachineResultEntry/GetBloodGroup",
  updateLabBloodGroup: 'MachineResultEntry/UpdateBloodgroup',
  getPatientBloodBankIndentApproval: "BloodRequisition/GetBloodRequisitionDateWise",
  updatePatientStatusBloodRequisition: "BloodRequisition/UpdatePatientBloodRequisitionStatus",
  getPatientBloodDetails: "MachineResultEntry/GetBloodDetail",
  saveInvoiceSettlement: "creditcontrol/savesettlement",
  getDefaultMachine:"MachineResultEntry/GetDefaultMachine",
  saveMedicineTreatmentAndPrescription:"NursingWard/Nursing/TreatmentPrescriptionInsrt",
  getMedicineTreatmentAndPrescription:"NursingWard/Nursing/GetTreatmentPrescription",
  saveNursingWardCrossConsultations: "NursingWard/CrossConsultations",
  getNursingWardCrossConsultations: "NursingWard/GetCrossconsultation",




  //Aakash End

  // discharge summary

  DRDetailsPrintDischargeReport: "DRDetails/PrintDischargeReport",


  // MRD API
  PrintCurrentIPPatientRegister: "MRD/PrintCurrentIPPatientRegister",
  RefundReport: "Reports/RefundReport",
  MRDPrintMRDAllReports: "MRD/PrintMRDAllReports",
  PrintMRDAnalysisDetail: "MRD/PrintMRDAnalysisDetail",
  PrintFileLocationInMRD: "MRD/PrintFileLocationInMRD",
  PrintFileIssuesStatus: "MRD/PrintFileIssuesStatus",
  PrintBedOccupancyReport: "MRD/PrintBedOccupancy",
  PrintPatientICDCodeReport: "MRD/PrintPatientICDCodeReport",
  PrintNBHReport: "MRD/PrintNBHReport",
  // Emergency API URL START
  EmergencyAdmissionFeildSearchPatientDropDown:
    "EmergencyAdmission/FeildSearchPatientDropDown",
  EmergencyAdmissionbindEmergencyRoomType:
    "EmergencyAdmission/bindEmergencyRoomType",
  EmergencyAdmissionBindAllRoomDetail: "EmergencyAdmission/BindAllRoomDetail",
  SaveEmergencyAdmission: "EmergencyAdmission/SaveEmergencyAdmission",
  EmergencyPatientSearch: "Emergency/PatientSearch",
  SaveEmergencyServices: "Emergency/SaveEmergencyServices",
  EmergencyRelaseForIPD: "Emergency/RelaseForIPD",
  getEmergencyBillItemDetails: "EmergencyAdmission/getEmergencyBillItemDetails",
  EmergencyBtnDischarge_Click: "Emergency/BtnDischarge_Click",
  shiftEmergencyBed: "EmergencyAdmission/shiftEmergencyBed",
  EmgBindItemMed: "MedicineRequisition/BindItemMed",
  SaveEMGMedReq: "Emergency/SaveIndent",
  GetUrgencyLevelsReq: "MedicineRequisition/GetUrgencyLevels",
  BindSubcategoryMedReq: "MedicineRequisition/BindSubcategory",
  GetTimeRouteDurationMedReq: "MedicineRequisition/GetTimeRouteDuration",
  ViewEmgRequisition: "Emergency/BindDetailsPatientRequisitionSearch",
  getEmergencyPatientDetails: "EmergencyAdmission/getEmergencyPatientDetails",
  CheckDoctorClearanceEMG: "Emergency/CheckDoctorClearance",
  CheckNursingClearanceEMG: "Emergency/CheckNursingClearance",
  CheckBillingClearanceEMG: "Emergency/CheckBillingClearance",
  ShiftToIPDEmg: "EmergencyAdmission/ShiftToIPD",
  IPDDetailBillingCategory: "IPDDetail/BillingCategory",

  SaveBillingClearanceEMG: "Emergency/btnBillingClearance_Click",
  SaveNursingClearanceEMG: "Emergency/btnnurseSave_Click",
  SaveDoctorClearanceEMG: "Emergency/btnDoctorClean_Click",
  BindInvestigationViewListEMG: "Emergency/getLabToPrintNew",
  LoadMedSetIndentMedURL: "MedicineAdviceOld/LoadMedSetItems",
  SaveEmergencyVisitURL: "EmergencyAdmission/SaveEmergencyVisit",
  MedicineRequisitionGrdRequsition_RowCommandURL:
    "MedicineRequisition/GrdRequsition_RowCommand",
  EMGGetItemRateByType_IDURL: "MedicineRequisition/GetItemRateByType_ID",
  handleSaveDialysisURL: "Emergency/SaveDialysisForm",
  bindDialysisFormListURL: "Emergency/BindDialysis",
  dialysisFormDeleteURL: "Emergency/SMDelete",
  bindDoctorCarePlanURL: "CpoeCarePlan/BindData",
  EMGSaveDoctorProgressNoteURL: "CpoeCarePlan/SaveCarePlan",
  BloodBankGetCategoriesURL: "BloodBank/GetCategories",
  getBloodGroupURL: "BloodBank/BindBloodGroup",
  getBloodBankLoadURl: "BloodBank/LoadItems",
  GetEmergencyRateURL: "BloodBank/GetEmergencyRate",
  BindRequestDetailsURL: "BloodBank/BindRequestDetails",
  BindItemStockDetailURL: "BloodBank/BindItemStockDetail",
  SaveBloodBankURL: "BloodBank/SaveBloodBank",
  UpdatePanelEMGURL: "Emergency/UpdatePanel",
  EmgRegReportURL: "EmergencyRegistration/GetEmergencyRegister",

  // Emergency API URL END

  // Pharmecy API URL STart
  PharmacyPatientURL: "Pharmacy/BindData",
  PHMedicineItemSearchURL: "Pharmacy/MedicineItemSearch",
  PharmacyAddItemURL: "Pharmacy/AddItem",
  PharmacyAddItemByItemIDURL: "Pharmacy/AddItemByItemID",
  PharmacyClinicalTrialURL: "Pharmacy/ClinicalTrial",
  PharmacyGetAllPendingIndentsURL: "Pharmacy/GetAllPendingIndents",
  bindFromDepartmentsURL: "Pharmacy/BindDepartmentFrom",
  PendingDraftListURL: "Pharmacy/GetDrafts",
  BindIndentDetailsURL: "Pharmacy/GetIndentItemsStockDetails",
  BindDraftDetailsURL: "Pharmacy/GetDemandItemDetails",
  GetPatientIndentLISTURL: "Pharmacy/GetPatientIndent",
  BindPrescribeDetailsURL: "Pharmacy/GetPrescribedItemStockDetails",
  SaveOPDPharmacyURL: "Pharmacy/SaveOPDPharmacy",
  PharmacyDraftBillURL: "Pharmacy/DraftBill",
  PharmacyOPDReturnSearch: "Pharmacy/OPDReturnSearch",
  PharmacyRejectIndentItemURL: "Pharmacy/RejectIndentItem",
  PharmacySaveOPDReturnURL: "Pharmacy/SaveOPDReturn",
  SaveIPDReurnURL: "Pharmacy/PatientReturnItemSave",
  PharmacySearchIPDReturnURL: "Pharmacy/Search",
  PharmacyBindIPDPatientDetailsURL: "Pharmacy/BindPatientDetails",
  PharmacyIPDReturnItemURL: "Pharmacy/ReturnItem",
  CurrentStockInvoiceURL: "CurrentStock/Invoice",
  BindPharmacySubcategory: "Pharmacy/BindSubcategory",
  ReferDoctorReportList: "Pharmacy/PharmacyReferDoctorReport",
  GetIPDSearchSalesURL: "Pharmacy/SearchIPDSales",
  PharmacyBindDoseItemURL: "Pharmacy/BindDose",

  BillGenerationSearchDetail: "BillGeneration/SearchDetail",
  SavePharmacyIssue: "Pharmacy/PharmacyIssue/SavePharmacyIssue",
  GetDetailsAgainstRecieptNO: "Pharmacy/PharmacyIssue/GetDetailsAgainstRecieptNO",
  UpdatePaymentMode: "Pharmacy/PharmacyIssue/UpdatePaymentMode",
  PharmacyBillReturnCredit: "BillGeneration/CashToCredit",

  // Pharmecy API URL END

  // Finace API URL Start
  bindVoucerListURL: "Finance/BindVoucherBillingScreenControls",
  bindCOGGroupsBackendData: "Finance/BindCOGGroupsBackendData",
  BindGroupTableURL: "Finance/BindGroupTable",
  BindChartOfAccountURL: "Finance/BindChartOfAccount",
  LoadGroupRecordsURL: "Finance/LoadGroupRecords",
  SaveNewGroupAPI: "Finance/SaveNewGroup",
  GetParentsData: "Finance/GetParentsData",
  SearchGroupTableURL: "Finance/SearchGroupTable",
  ChartOfGroupUpdateStatusURL: "Finance/UpdateStatus",
  ChartOfGroupExcelURL: "Finance/ChartOfGroupExcel",
  UpdateGroupNameURL: "Finance/UpdateGroupName",
  LoadCentreChartOfAccountURL: "Finance/LoadCentreChartOfAccount",
  GetCurrencyConversionFactorURL: "Finance/GetCurrencyConversionFactor",
  GetPeriodClosedURL: "Finance/GetPeriodClosed",
  BinduploadOpeningBalanceControls: "Finance/BinduploadOpeningBalanceControls",
  BindReconciliationDetails: "Finance/BindReconciliationDetails",
  BankReconciliationURL: "Finance/BindReconciliationBank",
  SearchVoucher: "Finance/SearchVoucher",
  UpdateReconciliation: "Finance/UpdateReconciliation",
  GetBankChargesUploadExcel: "Finance/GetBankChargesUploadExcel",
  BalanceTransaferControls: "Finance/BalanceTransaferControls",
  GetBalanceToTransafer: "Finance/GetBalanceToTransafer",
  UploadBalanceTransfer: "Finance/UploadBalanceTransfer",
  GetBankReconciliationExcel: "Finance/GetBankReconciliationExcel",
  GetOpeningBalanceToUpload: "Finance/GetOpeningBalanceToUpload",
  GetOpeningBalanceExcell: "Finance/GetOpeningBalanceExcell",
  SaveOpeningBalance: "Finance/SaveOpeningBalance",
  SearchAccountBookReport: "Finance/SearchAccountBookReport",
  // Finance API URL END

  // Chat API URL START

  ChatHubChatTicket: "Chat/ChatTicket",
  ChatHubSaveChat: "Chat/SaveChat",

  // Chat API URL END

  // medical Store API URL START
  SearchDirectDepartment: "DirectDepartmentIssue/SearchDirectDepartment",

  //Gate Entry1
  GateEntryGetPurchaseOrders: "GRN/GetPurchaseOrders",
  GateEntrySaveGateEntry: "GateEntry/GateEntry/SaveGateEntry",
  EDPGateEntrySearchGetEntry: "GateEntry/GateEntry/SearchGateEntry",
  GateEntryUserValidate: "GateEntry/GateEntry/UserValidate",
  GateEntryBindGateEntryItems: "GateEntry/GateEntry/BindGateEntryItems",
  GateEntryGateEntryGateEntryReport: "GateEntry/GateEntry/GateEntryReport",
  GateEntryBindGateEntryItems: "GateEntry/GateEntry/BindGateEntryItems",
  GateEntryUpdateGateEntry: "GateEntry/GateEntry/UpdateGateEntry",
  SearchGateEntryItem: "GateEntry/GateEntry/SearchGateEntryItem",
  GateEntryGRNPost: "GateEntry/GateEntry/GRNPost",
  GateEntryGRNUnPost: "GateEntry/GateEntry/GRNUnPost",
  GateEntryViewDetailGRNItem: "GateEntry/GateEntry/ViewDetailGRNItem",
  GateEntryPostToGRN: "GateEntry/GateEntry/PostToGRN",
  GRNCancel: "GRN/GRNCancel",

  //GRN API
  GetItemList: "GRN/GetItemList",
  GetTaxGroups: "GRN/GetTaxGroups",
  GetManufacturer: "GRN/GetManufactures",
  SaveGRN: "GRN/SaveGRN",


  GetGRNList: "GRN/GetGRNList",
  DirectGRNReport: "GRN/GetDirectGRNReport",
  updateInvoiceDetails: "GRN/updateInvoiceDetails",
  GRNPost: "GRN/GRNPost",
  GRNReject: "GRN/GRNCancel",
  BindGRNItems: "GRN/BindGRNItems",
  BindVendor: "GRN/BindVendor",
  UpdateGRN: "GRN/UpdateGRN",
  GetPurchaseOrders: "GRN/GetPurchaseOrders",
  GetPurchaseOrderItems: "GRN/GetPurchaseOrderItems",
  ReprintGRN: "GRN/GetDirectGRNReport",
  GRNSameStateBuyierSupplier: "GRN/SameStateBuyierSupplier",

  // Tools API
  GetDataToFill: "StockTake/GetDataToFill",
  StockTakeSaveData: "StockTake/SaveData",
  BindPhysicalData: "StockTake/BindPhysicalData",
  GridView1_RowCommand: "StockTake/GridView1_RowCommand",
  // consume
  ConsumeBindItem: "Consume/BindItem",
  ShowStock: "Consume/ShowStock",
  BindStock: "Consume/BindStock",
  SaveConsume: "Consume/SaveConsume",
  SearchStock: "Consume/SearchStock",
  SearchDetail: "IssueDepartment/SearchDetail",
  BindSubGroup: "IssueDepartment/BindSubGroup",
  View: "IssueDepartment/View",
  ViewDetail: "IssueDepartment/ViewDetail",
  SaveIssueDepartment: "IssueDepartment/SaveIndentData",
  PrintIssue: "CurrentStock/PrintIssue",
  GetStockItem: "IssueDepartment/GetStockItem",

  // viewRequisition

  ViewRequisition: "ViewRequisition/ViewRequisition",
  ViewIndent: "ViewRequisition/ViewIndent",
  Reject: "ViewRequisition/Reject",
  Approve: "ViewRequisition/Approve",
  PrintRequisition: "CurrentStock/PrintRequisition",
  medViewRequisition: "ViewRequisition/ViewRequisition",
  viewItem: "ViewRequisition/View",

  // medical Store API URL END

  // LABORATORY API end point start
  BindInvListBox: "Laboratory/BindInvListBox",
  BindSampleType: "Laboratory/BindSampleType",
  BindAnatomicSite: "Laboratory/BindAnatomicSite",
  UpdateInvestigation: "Laboratory/UpdateInvestigation",

  // by akash print pending list in lab
  PrintResultEntryPendingList: "LabReports/GetLabReport",

  // *Department API Start Here**
  BindDepartmentLab: "DepartmentReceiving/BindDepartment",
  SaveDeptReceiveLab: "DepartmentReceiving/SaveDeptReceive",
  SaveSampleReciveLab: "DepartmentReceiving/SaveSampleReceive",
  SaveTransferDataLab: "DepartmentReceiving/savetranferdata",
  RejectDepartmentDataLab: "/SampleCollection/SampleRejection",
  SampleRejectionReport: "SampleCollectionReport/SampleRejectionReport",

  // SampleSendOutsouceLab API end here

  SaveDeptReceive: "SampleSendOutsouceLab/SaveDeptReceive",
  BindDepartmentOutsourceLab: "SampleSendOutsouceLab/BindDepartmentOutsouceLab",
  BindLabOutSource: "SampleSendOutsouceLab/BindlabOutSource",
  SaveOutsourceSample: "SampleSendOutsouceLab/SaveOutsourceSample",
  getSampleRejectReasonOption: "SampleCollection/SampleCollectionResion",
  SaveSampleRejectReasonOption: "SampleCollection/SaveSampleReason",


  // *ResultEntry API Start Here**
  BindDepartmentResultEntryLab: "MachineResultEntry/BindDepartmentMachineResult",
  GetRadiologyAndDoctor: "MachineResultEntry/GetRadiologyAndDoctor",
  GetAmendmentReportsByTestId: "MachineResultEntry/GetAmendmentReportsByTestId",
  TestResultEntryLab: "MachineResultEntry/GetTestMaster",
  SearchResultEntryLab: "MachineResultEntry/PatientSearchMachineResult",
  LabObservationSearch: "MachineResultEntry/LabObservationSearch",
  GetPatientInvsetigationsNameOnly:
    "MachineResultEntry/GetPatientInvsetigationsNameOnly",
  SaveResultEntryLab: "MachineResultEntry/SaveLabObservationOpdData",
  BindAttachmentLab: "MachineResultEntry/ProcessRequest",
  DispatchResultEntryLab: "/LabReportDispatch/SearchPatientLab",
  BindAttachment: "MachineResultEntry/BindAttachment",
  BindAttachmentPdf: "MachineResultEntry/BindAttachmentPdf",
  BindPatientDetailsImage: "MachineResultEntry/BindPatientDetailsImage",
  BindDepartmentDispatch: "LabReportDispatch/BindCentreLab",
  BindDoctor: "MachineResultEntry/BindDoctorToForward",
  ProvisionalTatReport: "MachineResultEntry/ProvisionalTatReport",
  // "LaboratoryCountReport/LabReport",
  // Dispatch API end here

  LabObservationSearch: "MachineResultEntry/LabObservationSearch",
  GetPatientInvsetigationsNameOnly:
    "MachineResultEntry/GetPatientInvsetigationsNameOnly",
  ApprovedapI: "LabReports/GetLabApprovalReport",
  BindTestDdlLab: "MachineResultEntry/BindTestDDL",
  BindTestResultEntryLab: "MachineResultEntry/GetTestMaster",
  BindSampleinfo: "MachineResultEntry/Bindsampleinfo",
  LabSampleRejection: "SampleCollection/SampleRejection",
  BindLabReport: "MachineResultEntry/BindMultipleLabReport",
  BindPatientDetails: "MachineResultEntry/BindPatientDetails",
  BindInvestigationLabURL: "LabReportDispatch/BindInvestigationLab",
  BindApprovedBy: "MachineResultEntry/BindApprovedBy",
  BindMachine: "MachineResultEntry/BindMachine",
  GetCommentsDropdown: "MachineResultEntry/GetComments_labobservation",
  CommentlabObservation: "MachineResultEntry/Comments_LabObservation",
  HoverHeaderresultEntry: "MachineResultEntry/HoverHeader",
  HoverDeltaCheck: "MachineResultEntry/HoverDeltaCheck",
  Getpatientlabobservationopdtext: "MachineResultEntry/Getpatient_labobservation_opd_text",
  SaveSampleRejectReasonApi: "MachineResultEntry/SaveUnApproveReason",
  holdReason: "MachineResultEntry/GetUnHoldReason",
  SaveUnHoldReason: "MachineResultEntry/SaveUnHoldReason",
  ddlCommentsLabObservation1: "MachineResultEntry/ddlCommentsLabObservation1",
  GetUnApproveReason: "MachineResultEntry/GetUnApproveReason",
  SaveSampleRejectReasonApi: "MachineResultEntry/SaveUnApproveReason",
  // ResultEntry API End Here

  // Report Dispatch Api Start here

  DispatchLabReports: "LabReportDispatch/DispatchLabReport",

  // MachineResultEntry Culture API start here

  PatientSearchMachineResult: "MicroCultureLabResult/PatientSearchLabCultrure",
  CultureLabObservationSearch: "MicroCultureLabResult/LabObservationSearch",
  SaveLabObservationOpdData: "MicroCultureLabResult/SaveLabObservationOpdData",
  BindOrganism: "MicroCultureLabResult/BindOrganism",
  BindobsAntibiotic: "MicroCultureLabResult/BindobsAntibiotic",
  // LabWorkSheet API Start Here 
  SearchLabSeet: "LabWorkSheet/SearchLabSeet",
  LabWorkSheet: "LabWorkSheet/GenerateWorksheet",
  LabOutsource: "LabReports/GetOutsourceReport",
  BindDepartmentSeet: "LabWorkSheet/BindDepartmentSeet",
  WorkSheetGetPanel: "MicroCultureLabResult/GetPanel",
  // MicroLabEntry API Start Here
  MicroLabEntry: "MicroLabEntry/SearchData",
  GetMicroScopyData: "MicroLabEntry/GetMicroScopyData",
  MicroEntrySavedData: "MicroLabEntry/GetSavedData",
  SaveMicroScopicdata: "MicroLabEntry/SaveMicroScopicdata",
  SavePlatingdata: "MicroLabEntry/SavePlatingdata",
  SaveIncubationdata: "MicroLabEntry/SaveIncubationdata",
  UpdateAllMicroLab: "MicroLabEntry/UpdateAllData",
  GetMicroScopyDataAfterSave: "MicroLabEntry/GetMicroScopyDataAfterSave",
  // LABORATORY API end point end

  // Radiology API end point start here


  RadiologyAcceptance: "RadiologyAcceptance/SearchAcceptance",
  RadiologyBindLabDepartment: "RadiologyAcceptance/BindLabDepartment",
  RadiologybindRoomList: "RadiologyAcceptance/bindRoomList",
  RadiologyCallToken: "RadiologyAcceptance/CallToken",
  RadiologyUnCallToken: "RadiologyAcceptance/UncallTokens",
  RadiologySaveAcceptance: "RadiologyAcceptance/SaveAcceptance",
  RadiologyRemoveSample: "RadiologyAcceptance/RemoveSample",
  //IPDBillPrint start
  IPDBillPrints: "Reports/IPDBillPrint",
  NabhManualGetNabhDetail: "/NabhManual/GetNabhDetail",

  //IPDBillPrint End
  // inventry

  BindMedicineStoreDepartment: "Return/BindDepartment",
  BindStoreGroup: "Return/BindCategory",
  BindStoreSubCategory: "Return/BindSubCategory",
  BindStoreItems: "Return/BindItems",
  IssueDetail: "Return/BindDepartmentIssue",
  SearchSales: "IssueReturn/SearchSales",
  BindUser: "IssueReturn/BindUser",
  BindSearchSalesItem: "IssueReturn/BindSearchSalesItem",
  StoreCommonReceiptPdf: "CommonReciept_PDF/CommonReceiptPdf",
  BindItemForLabelPrint: "Pharmacy/BindItemForLabelPrint",
  ReportDetail: "IssueReturn/ReportDetail",
  LoadStock: "DirectDepartmentIssue/LoadStock",
  BindDepartmentItemIssueToDept: "DirectDepartmentIssue/BindDepartment",
  SearchItem: "DirectDepartmentIssue/SearchItem",
  getBindDetails: "ViewRequisition/BindDetails",
  SaveDirectMedicalIssue: "DirectDepartmentIssue/SaveDirectMedicalIssue",
  ReturnBindItem: "Return/BindItem",
  FromDepartment: "Return/FromDepartment",
  SearchDepartmet: "Return/SearchDepartmet",
  BarCode: "Return/BarCode",
  PatientReturnReport: "CurrentStock/PatientReturnReport",
  ReturnBindVendor: "Return/BindVendor",
  SaveFromDepartment: "Return/SaveFromDepartment",
  BindItemSupplair: "Return/BindItemSupplair",
  SearchSupplair: "Return/SearchSupplair",
  SaveSupplair: "Return/SaveSupplair",
  RGPSaveRGP: "MedicalStore/RGP/SaveRGP",
  consignmentReturnSearch: "Return/Search",
  ConsignmentBindItem: "Return/ConsignmentBindItem",
  BindPatientReturn: "Return/BindPatient",
  ReturnItem: "Return/ReturnItem",
  IPDPrintSticker: "CurrentStock/IPDPrintSticker",
  ConsignmentSave: "Return/ConsignmentSave",
  GetDrugFormularyPdf: "NabhManual/GetDrugFormularyPdf",
  NabhManualGetNabhpdf: "NabhManual/GetNabhpdf",
  GetDrugFormulary: "NabhManual/GetDrugFormulary",

  // purchase start
  QuotationGetCategories: "QuotationAndCompare/GetCategories",
  QuotationGetSubCategories: "QuotationAndCompare/GetSubCategories",
  QuotationGetManufacturers: "QuotationAndCompare/GetManufacturers",
  QuotationGetVendors: "CommonAPI/GetVendors",
  QuotationAddItems: "QuotationAndCompare/GetPurchaseItems",
  SearchQuotation: "QuotationAndCompare/SearchQuotation",
  AddItems: "QuotationAndCompare/AddItems",
  SaveQuotation: "QuotationAndCompare/SaveQuotation",
  QuotationSetDefault: "QuotationAndCompare/SetDefault",
  GetCurrencyFactor: "CommonAPI/GetCurrencyFactor",
  GetTaxGroup: "CommonAPI/GetTaxGroup",
  QuotationGetTaxAmount: "CommonAPI/GetTaxAmount",
  SearchPurchaseRequestBindItem: "SearchPurchaseRequest/BindItem",
  POApprovalMasterBindEmployee: "POApprovalMaster/BindEmployee",
  POApprovalMasterSaveApprovalMaster: "POApprovalMaster/SaveApprovalMaster",
  POApprovalMasterBindApprovalMaster: "POApprovalMaster/BindApprovalMaster",
  PODeleteApprovalMaster: "POApprovalMaster/DeleteApprovalMaster",
  POBindCategoryApprovalMaster: "POApprovalMaster/BindCategoryApprovalMaster",
  GetPurchaseMarkUpPercent: "QuotationAndCompare/GetPurchaseMarkUpPercent",
  ViewPurchaseOrderBindPORemark: "ViewPurchaseOrder/BindPORemark",


  PurchaseReportPrint: "ItemMaster/ItemMasterReport",
  ItemMasterBindDetail: "ItemMaster/BindDetail",

  //✔ ---> Approval
  ApprovalBindDepartment: "Approval/BindDepartment",
  ApprovalBindPRRequest: "Approval/BindPRRequest",
  ApprovalBindLedger: "Approval/BindLedger",
  ApprovalGRNAppovalCancel: "Approval/GRNAppovalCancel",
  ApprovalGetSelectedItems: "Approval/GetSelectedItems",
  ApprovalSavePurchaseApproval: "Approval/SavePurchaseApproval",
  ApprovalRejectItem: "Approval/RejectItem",
  ApprovalLoadApprovalRight: "Approval/LoadApprovalRight",
  ApprovalUpdatePurchaseApproval: "Approval/UpdatePurchaseApproval",

  // Purchase order approval

  // PurchaseOrderApprovalGetPurchaseItems:"PurchaseOrderApproval/GetPurchaseItems",
  PurchaseOrderApprovalGetPurchaseItems: "PurchaseOrderApproval/GetRequestions",
  PurchaseOrderApprovalRejectPurchaseOrder: "PurchaseOrderApproval/RejectPurchaseOrder",
  ApprovedPurchaseOrder: "PurchaseOrderApproval/ApprovedPurchaseOrde",


  // purchase end

  // CreatePurchaseRequest Start

  GetBindAllCenter: "/CommonAPI/BindAllCenter",
  GetItemsByCategory: "CommonAPI/GetCategorysByStoreType",
  GetCategorysByStoreType: "CommonAPI/GetCategorysByStoreType",
  GetSubCategoryByCategory: "CreatePurchaseOrder/GetSubCategoryByCategory",
  GetDepartMent: "CommonAPI/GetDepartMent",
  GetAutoPurchaseRequestItems:
    "CreatePurchaseRequest/GetAutoPurchaseRequestItems",
  PurchaseGetItems: "CreatePurchaseRequest/GetItems",
  SavePurchaseRequest: "CreatePurchaseRequest/SavePurchaseRequest",
  GetItemStockDetails: "CreatePurchaseRequest/GetItemStockDetails",
  GetPurchaseRequest: "CreatePurchaseRequest/GetPurchaseRequest",
  OnEditPurchaseRequest: "CreatePurchaseRequest/OnEditPurchaseRequest",

  // CreatePurchaseRequest End

  // Create Purchase Order start
  PurchaseOrderGetCategorys: "CreatePurchaseOrder/GetCategorys",
  ViewPurchaseOrderSearchPO: "ViewPurchaseOrder/SearchPO",
  PurchaseOrderGetSubCategoryByCategory:
    "CreatePurchaseOrder/GetSubCategoryByCategory",
  PurchaseOrderGetPurchaseItems: "CreatePurchaseOrder/GetPurchaseItems",
  PurchaseOrderGetPOList: "CreatePurchaseOrder/GetPOList",
  PurchaseOrderGetSavePODraftDetails: "CreatePurchaseOrder/SavePODraftDetails",
  CreatePurchaseOrderSave: "CreatePurchaseOrder/SavePurchaseOrder",
  CreatePOGetPurchaseRequests: "CreatePurchaseOrder/GetPurchaseRequests",
  GetPurchaseRequestItems: "CreatePurchaseOrder/GetPurchaseRequestItems",
  GetPurchaseOrderItemDetailsTerms: "CreatePurchaseOrder/GetPurchaseOrderItemDetailsTerms",
  POGetTermAndConditions: "CreatePurchaseOrder/GetTermAndConditions",
  GetPurchaseOrderItemDetails: "CreatePurchaseOrder/GetPurchaseOrderItemDetails",
  GetPOpuchaseTermsAndConditon: "TermsandCondition/GetTermsAndConditon",
  CreatePurchaseOrderGetPOByTermsandCondition: "CreatePurchaseOrder/GetPOByTermsandCondition",
  ViewPurchaseOrderAddRemark: "ViewPurchaseOrder/AddRemark",

  // Create Purchase Order End

  // View purchse request start
  SearchPRSummary: "SearchPurchaseRequest/SearchPRSummary",
  BindEmployee: "SearchPurchaseRequest/BindEmployee",
  PRBindLedger: "SearchPurchaseRequest/BindLedger",
  PRGetPRDetailsByPRNo: "SearchPurchaseRequest/GetPRDetailsByPRNo",
  PRSearchPRDetails: "SearchPurchaseRequest/SearchPRDetails",
  CreatePurchaseOrderGetPOItemsDetails: "CreatePurchaseOrder/GetPOItemsDetails",


  // View purchse request end

  // purchase order approval start
  PurchaseOrderApprovalUpdatePurchaseOrder: "PurchaseOrderApproval/UpdatePurchaseOrder",
  PurchaseOrderApprovalGetPurchaseOrderDetails: "PurchaseOrderApproval/GetPurchaseOrderDetails",
  PurchaseOrderApprovalApprovedPurchaseOrder: "PurchaseOrderApproval/ApprovedPurchaseOrder",
  CancelPurchaseOrderItem: "PurchaseOrderApproval/CancelPurchaseOrderItem",


  // purchase order approval End

  //purchase Tools Start
  PurchaseOrderApprovalPOReport: "PurchaseOrderApproval/POReport",
  PRGetPRDetailsReport: "CreatePurchaseRequest/GetPRDetailsReport",
  //terms and condition

  PurchaseTermsandConditionSave: "TermsandCondition/Save",
  PurchaseTermsandConditionSearch: "TermsandCondition/Search",
  PurchaseTermsandConditionUpdate: "TermsandCondition/Update",
  PurchaseTermsandConditionDelete: "TermsandCondition/Delete",

  // GRN Analysis start
  GRNGetStore: "Requisition/GetStore",
  GRNBindRequisitionType: "MedicineRequisition/BindRequisitionType",
  GRNGetVendor: "PRPOGRNAnalysis/GetVendor",
  GRNSearch: "PRPOGRNAnalysis/Search",
  PRPOGRNAnalysisBindItemapp: "PRPOGRNAnalysis/BindItemapp",
  // GRN Analysis End

  //purchase Tools End

  // Consignment Start

  GetConsignmentList: "Consignment/GetConsignmentList",
  BindConsignmentItemList: "Consignment/BindConsignmentItemList",
  ConsignmentPost: "Consignment/ConsignmentPost",
  ConsignmentCancelAll: "Consignment/ConsignmentCancelAll",
  ConsignmentRejectItem: "Consignment/ConsignmentRejectItem",
  GetConsignmentEditDetails: "Consignment/GetConsignmentEditDetails",
  PatientSearchList: "ConsignmentStockTransfer/PatientSearchList",
  BindPatientDetailsList: "ConsignmentStockTransfer/BindPatientDetails",
  ConsignmentStockItemList: "ConsignmentStockTransfer/BindItemList",
  AddConsignmentStockItemList: "ConsignmentStockTransfer/AddItemList",
  SaveConsignmentStockTransfer: "ConsignmentStockTransfer/Save",
  BindConsignmentVendorList: "OrderAnalysis/OrderAnalysisStore",
  ConsignmentReturnSearchList: "ConsignmentReturn/ConsignmentReturnSearchList",
  SaveConsignmentItemReturnList:
    "ConsignmentReturn/SaveConsignmentItemReturnList",
  ConsignmentReturnPrint: "ConsignmentReturn/ConsignmentReturnPrint",
  ConsignmentReceivePrint: "ConsignmentReturn/ConsignmentReceivePrint",
  PrintIndent: "IPDBillingStatus/PrintIndent",
  ItemAnalysisDetail: "IPDBillingStatus/ItemAnalysisDetail",
  EDPBasicMasterSavePro: "EDP/BasicMaster/SavePro",
  EDPBasicMasterBindPro: "EDP/BasicMaster/BindPro",
  BillingIPDSaveReferDoctor: "Billing/IPD/SaveReferDoctor",
  searchUnderMaintenance: "Billing/IPD/SearchUnderMaintenance",
  bindMaintenance: "Billing/IPD/BindMaintenance",
  saveRoomMaintenance: "Billing/IPD/SaveRoomMaintenance",
  searchRoomMaintenance: "Billing/IPD/SearchRoomMaintenance",
  saveRoomCleaningMaintenance: "Billing/IPD/SaveRoomCleaningMaintenance",
  requestRoomDetail: "Billing/IPD/RequestRoomDetail",
  saveRequestRoomDetail: "Billing/IPD/SaveRequestRoomDetail",

  // Master
  MasterSearchItem: "ManufactureMaster/SearchItem",
  SaveManufacture: "ManufactureMaster/SaveManufacture",
  UpdateManufacture: "ManufactureMaster/UpdateManufacture",
  ManufactureReportList: "ManufactureMaster/ManufactureReportList",

  //Vendor
  SearchVendor: "VendorDetail/SearchVendor",
  SaveVendor: "VendorDetail/SaveVendor",
  UpdateVendor: "VendorDetail/UpdateVendor",
  BindTerms: "VendorDetail/BindTerms",
  VendorForExcelReport: "VendorDetail/SearchVendorForExcelReport",

  // Item Master
  ItemMasterBindGroup: "ItemMaster/BindGroup",
  BindManufactureData: "ItemMaster/BindManufactureData",
  BindVatType: "ItemMaster/BindVatType",
  BindVatLine: "ItemMaster/BindVatLine",
  BindSaleVatType: "ItemMaster/BindSaleVatType",
  BindSaleVatLine: "ItemMaster/BindSaleVatLine",
  BindDrugCategoryMaster: "ItemMaster/BindDrugCategoryMaster",
  BindMajorUnit: "ItemMaster/BindMajorUnit",
  BindMinorUnit: "ItemMaster/BindMinorUnit",
  BindServiceItems: "ItemMaster/BindServiceItems",
  Bind_Active_salt: "ItemMaster/Bind_Active_salt",
  BindInventoryGrid: "ItemMaster/BindInventoryGrid",
  SaveNewItem: "ItemMaster/SaveNewItem",
  BindSaltItem: "ItemMaster/BindSaltItem",
  // reports

  StockStatusReport: "CurrentStock/StockStatusReport",
  StockLedgerReport: "CurrentStock/StockLedgerReport",
  CurrentStockReport: "CurrentStock/CurrentStockReport",
  IssueDetailReport: "CurrentStock/IssueDetail",
  StockBinCardReport: "CurrentStock/StockBinCardReport",
  ABCAnalysis: "CurrentStock/ABCAnalysis",
  LowStockDetail: "CurrentStock/LowStockDetail",
  ItemExpiryReport: "CurrentStock/ItemExpiryReport",
  ItemMovementReport: "CurrentStock/ItemMovementReport",
  AdjustmentDetailReport: "CurrentStock/AdjustmentDetailReport",
  ConsumptionReport: "CurrentStock/ConsumptionReport",
  PurchaseSummaryReport: "CurrentStock/PurchaseSummaryReport",
  BindGroupIndentStatusReport: "Return/BindGroupIndentStatusReport",
  ItemBindIndentStatusReport: "Return/ItemBindIndentStatusReport",
  GRNDetailReport: "CurrentStock/GRNDetailReport",
  SupplierReturnReport: "CurrentStock/SupplierReturnReport",
  IndentStatusReport: "CurrentStock/IndentStatusReport",
  getGSTReport: "GSTReport/GSTReport",
  GetBankReconciliationReport: "Finance/GetBankReconciliationReport",

  // Generic Master

  BindGeneric: "GenericMaster/BindGeneric",
  SaveGenericEdit: "GenericMaster/SaveGenericEdit",
  AddNewGeneric: "GenericMaster/AddNewGeneric",
  SearchGenericItem: "GenericMaster/SearchGenericItem",
  BindUnitMaster: "GenericMaster/BindUnitMaster",
  SaveGeneric: "GenericMaster/SaveGeneric",
  BindItemIdList: "GenericMaster/BindItemIdList",
  GenericDeleteitem: "GenericMaster/GenericDeleteitem",
  ReportList: "GenericMaster/ReportList",
  GenericReport: "GenericMaster/GenericReport",

  //Consignment End

  // Tools Start

  GetExpiryItems: "Tool/GetExpiryItems",
  SaveItemExpiry: "Tool/SaveItemExpiry",
  SearchChangeMRP: "Tool/SearchChangeMRP",
  SaveChangeMRP: "Tool/SaveChangeMRP",
  BindToolItem: "Tool/BindItem",
  SaveDepartmentWiseRack: "Tool/SaveDepartmentWiseRack",

  // Tools End
  BindDepartments: "MedicineReturnRequisition/BindDepartments",

  // Display Management Start 
  DisplayBindRoom: "Display/BindRoom",
  serachBindRoom: "Display/BindDoctorData",
  bindCurrentPatient: "Display/bindCurrentPatient",
  // BindDoctorData:"Display/BindDoctorData",
  BindDisplayToken: "Display/BindDisplayToken",
  BindRoomdata: "Display/GetDisplayToken",
  DisplayBindUser: "Display/BindUser",
  DisplayFloorName: "Display/FloorName",
  DisplayWardData: "Display/BindWardData",

  // Finance API start here 
  BindMainCenter: "Finance/BindMainCentre",
  SavePCDeptRequest: "Finance/SavePCDeptRequest",
  BindBackendData: "/Finance/BindBackendData",
  AccessMasterSaveMapping: "Finance/AccessMasterSaveMapping",
  getSessionDate: "Finance/getSessionDate",
  getCurrencyConversionFactor: "Finance/getCurrencyConversionFactor",
  bindVoucherBillingScreenControls: "Finance/BindVoucherBillingScreenControls",
  GetCOACurrentClosingBalance: "Finance/GetCOACurrentClosingBalance",
  SearchPettyCashRequest: "Finance/SearchPettyCashRequest",
  UpdateRequestStatus: "Finance/UpdateRequestStatus",
  SearchPendingPettyCashRequest: "Finance/SearchPendingPettyCashRequest",
  SavePCRequestApproval: "Finance/SavePCRequestApproval",
  searchPendingPettyCashApproval: "Finance/searchPendingPettyCashApproval",
  updatePettyCashApprovalStatus: "Finance/updatePettyCashApprovalStatus",
  SavePCEntry: "Finance/SavePCEntry",
  searchPettyCashEntry: "/Finance/searchPettyCashEntry",
  updatePettyCashEntryStatus: "/Finance/updatePettyCashEntryStatus",
  BindMappingData: "/Finance/BindMappingData",
  SaveMapping: "/Finance/SaveMapping",
  ActionChartOfAccount: "Finance/ActionChartOfAccount",
  SaveNewAccountType: "Finance/SaveNewAccountType",
  SaveChartOfAccount: "Finance/SaveChartOfAccount",
  Bindglobalresources: "Finance/Bindglobalresources",

  // Master Start 
  FinanceConsumptionBindBranchCentre: "Finance/ConsumptionBindBranchCentre",
  BindHisDerpatment: "Finance/BindHisDerpatment",
  BindTransactionType: "Finance/BindTransactionType",
  BindScreenControls: "Finance/BindScreenControls",
  ConsumptionSaveMapping: "Finance/ConsumptionSaveMapping",
  ChangeStatus: "Finance/ChangeStatus",
  CopyMapping: "Finance/CopyMapping",
  FinanceLoadType: "Finance/LoadType",
  SaveMasterCreation: "Finance/SaveMasterCreation",
  FinanceBindMasterCreation: "Finance/BindMasterCreation",
  SaveVoucherTypeMaster: "Finance/SaveVoucherTypeMaster",
  BindVoucherTypeMaster: "Finance/BindVoucherTypeMaster",
  GetCountry: "Finance/GetCountry",
  BindCurrencyMaster: "Finance/BindCurrencyMaster",
  SaveMappingData: "Finance/SaveMappingData",
  CentreWise_Coa_Mapping: "Finance/CentreWise_Coa_Mapping",
  CostBindMapping: "Finance/CostBindMapping",
  CostSaveMapping: "Finance/CostSaveMapping",
  DeActiveVoucherTypeMaster: "Finance/DeActiveVoucherTypeMaster",
  SaveCurrencyMaster: "Finance/SaveCurrencyMaster",
  BindHREmployeeDepartment: "Finance/BindHREmployeeDepartment",
  BindDoctorDepartment: "Finance/BindDoctorDepartment",
  CostLoadGroupRecords: "Finance/CostLoadGroupRecords",
  FinanceAccount: "Finance/FinanceAccount",
  CostChangeStatus: "Finance/CostChangeStatus",
  // Master End

  // finance approval start
  VoucherLimitBindMapping: "Finance/VoucherLimitBindMapping",
  BindReconciliationBank: "Finance/BindReconciliationBank",
  VoucherLimitSaveMapping: "Finance/VoucherLimitSaveMapping",
  BindReconciliationVerifyDetails: "Finance/BindReconciliationVerifyDetails",
  LoadAccountDetailsURL: "Finance/LoadAccountDetails",
  SearchReconcileDetails: "Finance/SearchReconcileDetails",
  UpdateVoucherPostingReview: "Finance/UpdateVoucherPostingReview",
  FinanceUpdateStatusBulk: "Finance/UpdateStatusBulk",
  FinanceBindAuditBackendData: "Finance/BindAuditBackendData",
  FinanceSaveVoucherAudit: "Finance/SaveVoucherAudit",
  // finance approval end

  // finance voucher start
  GetPendingCheque: "Finance/GetPendingCheque",
  SaveChequeDeposit: "Finance/SaveChequeDeposit",
  // finance voucher end
  // Finance Voucher Audit Api Start 

  BindAuditBackendData: "Finance/BindAuditBackendData",
  BindReportControlsURL: "Finance/BindReportControls",



  FinanceSaveVoucher: "Finance/SaveVoucher",
  ReplicateVoucherHistoryURL: "Finance/SearchReplicateVoucher",
  // finance voucher end
  helpMenu: "MachineResultEntry/BindMapping",

  // finance Report start
  GetTrialBalanceReport: "Finance/GetTrialBalanceReport",
  GetGLReport: "Finance/GetGLReport",
  PurchaseBillDueReport: "Finance/PurchaseBillDueReport",
  BindPayableGroup: "Finance/BindPayableGroup",
  PaybleAgingSummary: "Finance/PaybleAgingSummary",
  GetStatementReport: "Finance/GetStatementReport",
  // finance Report end
  // finance report Start 
  FinanceBindBranchCentre: "Finance/BindBranchCentre",
  FinanceReceibleAgingSummary: "Finance/ReceibleAgingSummary",

  // finance report End


  // EDP Start
  // Centre Management STart
  SaveCentreEDP: "EDP/CentreSetUp/SaveCentre",
  UpdateCentreEDP: "EDP/CentreSetUp/UpdateCentre",
  EDPAllMappingsURL: "EDP/CentreSetUp/GetAllMappings",
  SavesRolesMappingsDetailsURL: "EDP/CentreSetUp/SavesRolesMappingsDetails",
  SavesDoctorMappingsDetailsURL: "EDP/CentreSetUp/SavesDoctorsMappingsDetails",
  CentreWiseItemSearchURL: "EDP/CentreSetUp/GetItems",
  CentreWiseItemSaveURL: "EDP/CentreSetUp/SaveItems",
  // Centre Management End
  GetCategory: "EDP/ServicesSetup/GetCategory",
  GetSubCategory: "EDP/ServicesSetup/GetSubCategory",
  GetDepartment: "EDP/ServicesSetup/GetDepartment",
  GetGST: "EDP/ServicesSetup/GetGST",
  SaveItem: "EDP/ServicesSetup/SaveItem",
  LoadItems: "EDP/ServicesSetup/LoadItem",
  EDPBindAllCentre: "EDP/CentreSetUp/BindAllCentre",
  GetSubScreenMenuByRoleURL: "MasterPage/GetSubScreenMenuByRole",
  CentreManagementSearchURL: "EDP/CentreSetUp/SearchCenter",
  EDPLoadPrescriptionViewURL: "EDP/CentreSetUp/LoadPrescriptionView",
  ServicesSetupBindDisplayName: "EDP/ServicesSetup/BindDisplayName",
  ServicesSetupSaveDisplayName: "EDP/ServicesSetup/SaveDisplayName",
  ServicesSetupUpdateDisplayName: "EDP/ServicesSetup/UpdateDisplayName",
  BindCategoryType: "EDP/ServicesSetup/BindCategoryType",
  SaveCategory: "EDP/ServicesSetup/SaveCategory",
  BindReturn: "EDP/ServicesSetup/BindReturn",
  EditCategory: "EDP/ServicesSetup/EditCategory",
  EDPBindCategoryURL: "EDP/ServicesSetup/BindCategory",
  LoadDisplayName: "EDP/ServicesSetup/LoadDisplayName",
  SaveDepartment: "EDP/ServicesSetup/SaveDepartment",
  UpdateItem: "EDP/ServicesSetup/UpdateItem",
  EdpSearchEmployee: "EDP/EmployeeSetUp/SearchEmp",
  EDPLoadPrescriptionView: "EDP/EmployeeSetUp/LoadPrescriptionView",
  SaveSubCategory: "EDP/ServicesSetup/SaveSubCategory?",
  BindGrid: "EDP/ServicesSetup/BindGrid",
  EditSaveSubCategory: "EDP/ServicesSetup/EditSaveSubCategory",

  // Laboratory Mangagement 
  ManagementBindInvestigation: "EDP/LaboratorySetup/BindInvestigation",
  SaveInvestigation: "EDP/LaboratorySetup/SaveInvestigation",
  BindCategorylabortarymanagment: "EDP/LaboratorySetup/BindCategory",
  SaveObservation: "EDP/LaboratorySetup/SaveObservation",
  BindObservationType: "EDP/LaboratorySetup/BindObservationType",
  UpdateObservation: "EDP/LaboratorySetup/UpdateObservation",
  GetDocTypeList: "EDP/LaboratorySetup/GetDocTypeList",
  // Formula Master 
  Formula: "EDP/LaboratorySetup/Formula",

  // HelpObservation 
  BindInvestigationHelp: "EDP/LaboratorySetup/BindInvestigationHelp",
  BindHelp: "EDP/LaboratorySetup/BindHelp",
  BindMapping: "EDP/LaboratorySetup/BindMapping",
  RemoveObservationHelp: "EDP/LaboratorySetup/RemoveObservationHelp",
  SaveObservationHelp: "EDP/LaboratorySetup/SaveObservationHelp",
  AddObservationHelp: "EDP/LaboratorySetup/AddObservationHelp",
  UpdateObservationHelp: "EDP/LaboratorySetup/UpdateObservationHelp",
  BindPayrollDepartment: "EDP/EmployeeSetUp/BindPayrollDepartment",
  EPDsaveEmployee: "EDP/EmployeeSetUp/SaveEmployee",
  EDPBindPayrollDesignation: "EDP/EmployeeSetUp/BindPayrollDesignation",
  BindEmployeeGroup: "EDP/EmployeeSetUp/BindEmployeeGroup",
  BindUserType: "EDP/EmployeeSetUp/BindUserType",
  BindQualification: "EDP/EmployeeSetUp/BindQualification",
  BloodBank: "BloodBank/BindBloodGroup",
  BindTitleWithGender: "EDP/EmployeeSetUp/BindTitleWithGender",
  EDPGetEmployee: "EDP/EmployeeSetUp/GetEmployee",
  EDPupdateEmployee: "EDP/EmployeeSetUp/UpdateEmployee",
  EDPGetCenter: "EDP/CentreSetUp/GetCenter",
  EDPgetSetCentre: "EDP/EmployeeSetUp/GetSetCentre",
  EDPGetUserAccess: "EDP/EmployeeSetUp/GetUserAccess",
  EDPSaveUserRoles: "EDP/EmployeeSetUp/SaveUserRoles",

  // rate setup Start
  ServicesRateSetupLoadCategory: "EDP/ServicesRateSetup/LoadCategory",
  RateSetupLoadSubCategory: "EDP/ServicesRateSetup/LoadSubCategory",
  EDPGetDeptWiseAuth: "EDP/EmployeeSetUp/GetDeptWiseAuth",
  ServicesRateSetup: "EDP/ServicesRateSetup/PanelChange",
  SaveRateSchedule: "EDP/ServicesRateSetup/SaveRateSchedule",
  UpdateRateSchedule: "EDP/ServicesRateSetup/UpdateRateSchedule",
  // RateSetupCaseTypeBind:"EDP/ServicesRateSetup/CaseTypeBind",
  RateSetupLoadItems: "EDP/ServicesRateSetup/LoadItems",
  RateSetupBindCentre: "EDP/ServicesRateSetup/BindCentre",
  ServicesRateSetupBindModelCentre: "EDP/ServicesRateSetup/BindModelCentre",
  RateSetupLoadRates: "EDP/ServicesRateSetup/LoadRates",
  RateSetupSaveSetItemRate: "EDP/ServicesRateSetup/SaveSetItemRate",
  RateSetupCaseTypeBind: "EDP/ServicesRateSetup/CaseTypeBind",
  RateSetupLoadSubCategorySurgery: "EDP/ServicesRateSetup/LoadSubCategorySurgery",
  RateSetupLoadItemSurgery: "EDP/ServicesRateSetup/LoadItemSurgery",
  RateSetupLoadRatesSurgery: "EDP/ServicesRateSetup/LoadRatesSurgery",
  ServicesRateSetupCopyToIPD: "EDP/ServicesRateSetup/CopyToIPD",
  ServicesRateSetupCopyToOPD: "EDP/ServicesRateSetup/CopyToOPD",
  ServicesRateSetupCopyFromIPD: "EDP/ServicesRateSetup/CopyFromIPD",
  ServicesRateSetupCopyFromOPD: "EDP/ServicesRateSetup/CopyFromOPD",
  ServicesRateSetupBindFromCentreIPD: "EDP/ServicesRateSetup/BindFromCentreIPD",
  ServicesRateSetupBindFromCentreOPD: "EDP/ServicesRateSetup/BindFromCentreOPD",
  ServicesRateSetupBindToCentreOPD: "EDP/ServicesRateSetup/BindToCentreOPD",
  ServicesRateSetupBindToCentreIPD: "EDP/ServicesRateSetup/BindToCentreIPD",
  handleSubCategoryRateListURL: "EDP/ServicesRateSetup/BindSubCategoryIPD",
  SaveEDPSetRateURL: "EDP/ServicesRateSetup/SaveCopyRateList",
  // rate setup End

  EDPGetRoleWisePages: "EDP/EmployeeSetUp/GetRoleWisePages",
  EDPSearchEmpforCopyFromBind: "EDP/EmployeeSetUp/SearchEmpforCopyFromBind",
  EDPSearchEmpforCopyToBind: "EDP/EmployeeSetUp/SearchEmpforCopyToBind",
  EDPUpdateCentre: "EDP/EmployeeSetUp/UpdateCentre",
  EDPGetCenter: "EDP/EmployeeSetUp/GetCenter",
  EDPResetPassword: "EDP/EmployeeSetUp/ResetPassword",
  EDPSavePageAccess: "EDP/EmployeeSetUp/SavePageAccess",
  EDPSaveUserAuth: "EDP/EmployeeSetUp/SaveUserAuth",
  EDPLoadEmployee: "EDP/EmployeeSetUp/LoadEmployee",
  EDPLoadDoctor: "EDP/EmployeeSetUp/LoadDoctor",
  EDPanelMaster: "EDP/ServicesSetup/BindPanel",
  EDPSurgeryItem: "EDP/ServicesSetup/LoadSurgeryItem",
  EDPActDeactEmpSave: "EDP/EmployeeSetUp/ActDeactEmpSave",
  EDPSaveSurgeryGrouping: "EDP/ServicesSetup/SaveSurgeryGrouping",
  SaveSurgeryGroupName: "EDP/ServicesSetup/SaveSurgeryGroupName",
  BindGroupSurgery: "EDP/ServicesSetup/BindGroupSurgery",

  // MapInvestigationObservationNew
  BindInvestigationMaster: "EDP/LaboratorySetup/Bind_Investigation",
  BindObservationInvestigation: "EDP/LaboratorySetup/BindObservationInvestigation",
  SaveObservationInvestigation: "EDP/LaboratorySetup/SaveObservationInvestigation",
  SaveNewObservation: "EDP/LaboratorySetup/SaveNewObservation",
  GetObservationData: "EDP/LaboratorySetup/GetObservationData",
  RemoveObservationInvestigation: "EDP/LaboratorySetup/RemoveObservationInvestigation",
  SaveObservationInvestigationMapping: "EDP/LaboratorySetup/SaveMapping",
  BindInvestigationOrder: "EDP/LaboratorySetup/BindInvestigationOrder",
  BindinvestigationLabOutSource: "EDP/LaboratorySetup/BindLabOutSource",
  LoadHeadDepartment: "EDP/LaboratorySetup/LoadHead",
  SaveInvestigationOrder: "EDP/LaboratorySetup/SaveInvestigationOrder",
  BindinvestigationTamplate: "EDP/LaboratorySetup/BindinvestigationTamplate",
  LoadTamplate: "EDP/LaboratorySetup/LoadTamplate",
  RejectTamplate: "EDP/LaboratorySetup/RejectTamplate",
  RejectComment: "EDP/LaboratorySetup/RejectComment",
  SaveTamplateInv: "EDP/LaboratorySetup/SaveTamplate",
  SaveUpdateTamplate: "EDP/LaboratorySetup/SaveUpdateTamplate",
  EditTamplate: "EDP/LaboratorySetup/EditTamplate",
  EditComment: "EDP/LaboratorySetup/EditComment",
  BindObservationLabcomment: "EDP/LaboratorySetup/BindObservationLabcomment",
  SaveComment: "EDP/LaboratorySetup/SaveComment",
  EDPBindUserGroup: "EDP/EmployeeSetUp/BindUserGroup",
  EDPSaveUserGroup: "EDP/EmployeeSetUp/SaveUserGroup",
  EDPEmployeeSetUpSaveUserType: "EDP/EmployeeSetUp/SaveUserType",
  EDPCommonMasterBindUserType: "EDP/EmployeeSetUp/CommonMasterBindUserType",
  EDPBindDesignationtableinMaster: "EDP/EmployeeSetUp/BindDesignationtableinMaster",
  EDPBindGrade: "EDP/EmployeeSetUp/BindGrade",
  EDPSaveDesignation: "EDP/EmployeeSetUp/SaveDesignation",
  EDPBindJobType: "EDP/EmployeeSetUp/BindJobType",
  EDPSaveJobType: "EDP/EmployeeSetUp/SaveJobType",
  EDPSaveSurgeryType: "EDP/ServicesSetup/SaveSurgeryType",
  EDPSearchSurgeryType: "EDP/ServicesSetup/SearchSurgeryType",
  EDPUpdateSurgeryType: "EDP/ServicesSetup/UpdateSurgeryType",
  LoadComment: "EDP/LaboratorySetup/LoadComment",
  SearchSurgeryItem: "EDP/ServicesSetup/SearchSurgeryItem",
  BindManageApprovalDetail: "/EDP/LaboratorySetup/BindDetail",
  BindDoctorApproval: "EDP/LaboratorySetup/Bind_Employee",
  BindEmployeeApproval: "EDP/LaboratorySetup/BindEmployee",
  BindRoleApproval: "EDP/LaboratorySetup/BindRole",
  SaveManageApproval: "EDP/LaboratorySetup/SaveManageApproval",
  BindDetailApproval: "EDP/LaboratorySetup/BindDetail",
  RemoveSignApproval: "EDP/LaboratorySetup/RemoveSign",
  manageDeliveryBindCentre: "EDP/LaboratorySetup/BindCentre",
  GetDeliveryDays: "EDP/LaboratorySetup/GetDeliveryDays",
  SaveOutSourceLab: "EDP/LaboratorySetup/SaveOutSourceLab",
  UpdateOutSourceLab: "/LaboratorySetup/UpdateOutSourceLab",
  EDPBindAllItems: "EDP/ServicesSetup/BindAllItems",
  EDPSaveLocation: "EDP/LocationMaster/SaveLocation",
  EDPLoadLocationDetail: "EDP/LocationMaster/LoadLocationDetail",

  //satish start 

  GetInvCheckListMaster: "MachineResultEntry/GetInvCheckListMaster",
  SaveInvItemCheckList: "MachineResultEntry/SaveInvItemCheckList",
  GetAllEyeFramePrintReport: "Doctor/GetAllEyeFramePrintReport",
  SaveNewInvestigation: "Laboratory/SaveNewInvestigation",
  SaveNewInvestigation: "Laboratory/SaveNewInvestigation",
  UpdateSerialMarkViewLab: "MachineResultEntry/UpdateSerialMarkViewLab",
  updatePatientIssue: "KichenDiet/UpdatePatientIssue",
  deletePatientIssue: "KichenDiet/DeletePatientIssue",
  getBloodVolumeOfRequisition: "BloodRequisition/GetBloodVolumeOfRequisition",
  getProductOfRequisition: "BloodRequisition/GetProductOfRequisition",
  getBloodNatureOfRequisition: "BloodRequisition/GetBloodNatureOfRequisition",
  patientBloodRequisition: "BloodRequisition/PatientBloodRequisition",
  getBloodRequisition: "BloodRequisition/GetBloodRequisition",
  updatePatientBloodRequisitionStatus: "BloodRequisition/UpdatePatientBloodRequisitionStatus",
  getBloodRequisitionReport: "BloodRequisition/GetBloodRequisitionReport",
  getCtbNo:"BloodRequisition/GetCTBNo",
  getBloodRequisitionIndentReport:"BloodRequisition/BloodRequisitionIndentReportPDF",
  // getCollectionReport:"CommonReports/commonReports/getFields/getFields/collectionreport",
  createDiagnosisTreatment:"VitalSign/CreateDiagnosisTreatment",
  getPatientAllergiesDiagnosisAllById:"VitalSign/GetPatientAllergiesDiagnosisAllById",
  deleteDiagnosisTreatment:"VitalSign/DeleteDiagnosisTreatment",
  getAllVitalMaster:"VitalSign/GetAllVitalMaster",
  getChildVaccinationStatus:"PrescriptionAdvice/GetChildVaccinationStatus",

  //satish end

  // Karan Start

  // Karan Start
  BindOutSourceLabOutSourceLab: "EDP/LaboratorySetup/BindOutSourceLab",
  BindColours: "EDP/LaboratorySetup/BindColours",
  SaveSampleContainer: "EDP/LaboratorySetup/SaveSampleContainer",
  BindGridsampleContainer: "EDP/LaboratorySetup/BindGrid",
  UpdateSampleContainer: "EDP/LaboratorySetup/UpdateSampleContainer",
  BindContainer: "EDP/LaboratorySetup/BindContainer",
  SaveSampleType: "EDP/LaboratorySetup/SaveSampleType",
  BindSampleTypeMaster: "EDP/LaboratorySetup/BindSampleTypeMaster",
  UpdateSampleType: "EDP/LaboratorySetup/UpdateSampleType",
  DeleteSampleType: "EDP/LaboratorySetup/DeleteSampleType",
  UpdateOutSourceLab: "EDP/LaboratorySetup/UpdateOutSourceLab",
  SaveInvDeliveryDays: "EDP/LaboratorySetup/SaveInvDeliveryDays",
  SaveNewInvestigation: "Laboratory/SaveNewInvestigation",
  GetObservationBindData: "/Laboratory/GetObservationData",
  SaveObservationMap: "Laboratory/SaveObservation",
  // Doctor Management Start 

  DoctorReg: "EDP/DoctorSetUp/DoctorReg",


  //  Formula Master Start here 

  BindInvestigations: "EDP/LaboratorySetup/BindInvestigations",
  LoadObservations: "EDP/LaboratorySetup/LoadObservations",
  formulamasterSaveFormula: "EDP/LaboratorySetup/SaveFormula",
  formulamasterDelete: "EDP/LaboratorySetup/Delete",

  // Doctor Managment Start here 
  BindDoctorGroupmanagement: "EDP/DoctorSetUp/BindDoctorGroup",
  GetDocTypeList: "EDP/LaboratorySetup/GetDocTypeList",
  GetNablInvestigations: "EDP/LaboratorySetup/Get_NablInvestigations",
  SaveIsNABLInv: "EDP/LaboratorySetup/SaveIsNABLInv",
  GetDoctorReportData: "EDP/DoctorSetUp/GetDoctorReportData", // for excel 
  // Doctor Details Start here 

  GetDoctorDetail: "EDP/DoctorSetUp/GetDoctorDetail",
  BindDoctorDetail: "EDP/DoctorSetUp/BindDoctorDetail",



  // MemberShip Start here 
  InsertCardItem: "EDP/MemberShipCardSetUp/InsertCardItem",
  edpMemberShipGetBindData: "EDP/MemberShipCardSetUp/GetBindData",
  UpdatedCardItem: "EDP/MemberShipCardSetUp/UpdatedCardItem",
  GetBindConfig: "/EDP/MemberShipCardSetUp/GetBindConfig",
  GetBindDataCard: "EDP/MemberShipCardSetUp/GetBindDataCard",
  EDPBindOPdPackage: "EDP/MemberShipCardSetUp/BindOPdPackage",
  GetBindItem: "EDP/MemberShipCardSetUp/GetBindItem",


  // Ot Start here 
  OTImagesUpload: "OT/OTImagesUpload",
  BindOTImages: "OT/BindOTImages",
  ViewOTImagesURL: "OT/ViewOTImages",
  UpdateOTImages: "OT/UpdateOTImages",
  RemoveOTImages: "OT/RemoveOTImages",
  otPatientSearch: "OT/OldPatientSearch",


  // Donor Regestration Start here 
  CityInsert: "BloodBank/CityInsert",
  bloodBankSaveData: "BloodBank/SaveData",
  BindQuestions: "BloodBank/BindQuestions",
  BinddonorBloodGroup: "EDP/BBStock/BindBloodGroup",
  donorBindOrganisation: "EDP/BBStock/BindOrganisation",
  DonorGetCity: "BloodBank/GetCity",
  DonorGetCountry: "CommonAPI/GetCountry",


  //  Blood Collection Start here 

  bloodCollectionSearchData: "BloodBank/SearchData",
  SaveCollectionRecord: "BloodBank/SaveCollectionRecord",

  // Grouping Start Here 
  BloodGroupSerach: "BloodBank/BloodGroupSerach",
  // Karan End





  // Govind Start 
  EDPBindDepartmenttableinMaster: "EDP/EmployeeSetUp/BindDepartmenttableinMaster",
  EDPBindDepartmentHead: "EDP/EmployeeSetUp/BindDepartmentHead",
  EDPBindDocumentMaster: "EDP/EmployeeSetUp/BindDocumentMaster",
  EDPSaveDocumentMaster: "EDP/EmployeeSetUp/SaveDocumentMaster",
  EDPBindDesignationDocumentMap: "EDP/EmployeeSetUp/BindDesignationDocumentMap",
  EDPBindDesignation: "EDP/EmployeeSetUp/BindDesignation",
  EDPBindDocumentForMap: "EDP/EmployeeSetUp/BindDocumentForMap",
  EDPSaveDesigDocMap: "EDP/EmployeeSetUp/SaveDesigDocMap",
  EDPDeleteDocumentMap: "EDP/EmployeeSetUp/DeleteDocumentMap",
  EDPSaveDepartment: "EDP/EmployeeSetUp/SaveDepartment",
  EDPGetDepratmentHeadID: "EDP/EmployeeSetUp/GetDepratmentHeadID",
  EDPGetRole: "EDP/RoleAndDepartmentSetUp/GetRole",
  GetCentreWithPanelGroupMappings: "EDP/RoleAndDepartmentSetUp/GetCentreWithPanelGroupMappings",
  BindDepartmentBelong: "EDP/RoleAndDepartmentSetUp/BindDepartmentBelong",
  EDPSaveRoleWiseCentrePanelGroup: "EDP/RoleAndDepartmentSetUp/SaveRoleWiseCentrePanelGroup",
  UpdateStatusmark: "MachineResultEntry/UpdateStatusmark",
  EDPSaveDiscountReasonMaster: "EDP/BasicMaster/SaveDiscountReasonMaster",
  EDPBasicMasterSavePro: "EDP/BasicMaster/SavePro",
  EDPBindPro: "EDP/BasicMaster/BindPro",
  EDPBindGrid: "EDP/BasicMaster/BindGrid",
  EDPUpdateDiscountReasonMaster: "EDP/BasicMaster/UpdateDiscountReasonMaster",
  EDPBindMappedProDoctor: "EDP/BasicMaster/BindMappedProDoctor",
  EDPUpdateMappedPRODoctor: "EDP/BasicMaster/UpdateMappedPRODoctor",
  EDPSaveMapPRoToDoctor: "EDP/BasicMaster/SaveMapPRoToDoctor",
  EDPUpdatePRODetail: "EDP/BasicMaster/UpdatePRODetail",
  EDPSearchMessage: "EDP/BasicMaster/SearchMessage",
  EDPSaveMessage: "EDP/BasicMaster/SaveMessage",
  EDPUpdateMessage: "EDP/BasicMaster/UpdateMessage",
  EDPThresholdLimitSave: "EDP/BasicMaster/ThresholdLimitSave",
  EDPThresholdLimitSearch: "EDP/BasicMaster/ThresholdLimitSearch",
  EDPBillCancellationSearch: "EDP/Utilities/BillCancellationSearch",
  EDPCancelAdmitDischargeSearch: "EDP/Utilities/CancelAdmitDischargeSearch",
  EDPCancelAdmitDischargeSave: "EDP/Utilities/CancelAdmitDischargeSave",
  EDPBillCancel: "EDP/Utilities/BillCancel",
  EDPAdmitDischSearch: "EDP/Utilities/AdmitDischSearch",
  EDPBindDischargeType: "EDP/Utilities/BindDischargeType",
  EDPAdmitDischUpdate: "EDP/Utilities/AdmitDischUpdate",
  EDPBindProcessStep: "EDP/Utilities/BindProcessStep",
  EDPUpdateProcessStep: "EDP/Utilities/UpdateProcessStep",
  EDPPaymentSearch: "EDP/Utilities/PaymentSearch",
  EDPBindPaymentMode: "EDP/Utilities/BindPaymentMode",
  EDPSavePaymentMode: "EDP/Utilities/SavePaymentMode",
  EDPLoadPanel: "EDP/PanelSetUp/LoadPanel",
  EDPLoadDocument: "EDP/PanelSetUp/LoadDocument",
  EDPSaveDoc: "EDP/PanelSetUp/SaveDoc",
  EDPUpdatePanelForDocuments: "EDP/PanelSetUp/UpdatePanelForDocuments",
  EDPSavePanelDoc: "EDP/PanelSetUp/SavePanelDoc",
  EDPSavePanelDocument: "EDP/PanelSetUp/SavePanelDocument",
  EDPLoadDocumentDetail: "EDP/PanelSetUp/LoadDocumentDetail",
  EDPEmailBindTemplate: "EDP/EmailSetUp/EmailBindTemplate",
  EDPBindEmailId: "EDP/EmailSetUp/BindEmailId",
  EDPEmailTemplateType: "EDP/EmailSetUp/EmailTemplatetype",
  EDPBindColumnField: "EDP/EmailSetUp/BindColumnField",
  EDPBindEmailDetails: "EDP/EmailSetUp/BindEmailDetails",
  EDPBindPanel: "EDP/EmailSetUp/BindPanel",
  EDPBindRole: "EDP/EmailSetUp/BindRole",
  EDPCreateOT: "EDP/OTMaster/CreateOT",
  EDPGetExitingOT: "EDP/OTMaster/GetExitingOT",
  EDPSaveDoctorSlotAllocations: "EDP/OTMaster/SaveDoctorSlotAllocations",
  EDPGetDoctorBookedSlots: "EDP/OTMaster/GetDoctorBookedSlots",
  EDPGetOTs: "EDP/OTMaster/GetOTs",
  EDPBindDocDepartment: "EDP/DoctorSetUp/BindDocDepartment",
  EDPDoctorSetupSaveDoc: "EDP/DoctorSetUp/SaveDocDepartment",
  EDPUpdateDocDepartment: "EDP/DoctorSetUp/UpdateDocDepartment",
  OTGetOTSlots: "OT/GetOTSlots",
  EDPSaveRefDoc: "EDP/DoctorSetUp/SaveRefDoc",
  EDPLoadRefDoc: "EDP/DoctorSetUp/LoadRefDoc",
  EDPUpdateRefDoc: "EDP/DoctorSetUp/UpdateRefDoc",
  EDPBindOPdPackage: "EDP/MemberShipCardSetUp/BindOPdPackage",
  EDPGetBindItem: "EDP/MemberShipCardSetUp/GetBindItem",
  EDPSaveData: "EDP/MemberShipCardSetUp/SaveData",
  EDPSaveItemData: "EDP/MemberShipCardSetUp/SaveItemData",

  EDPBindPkgCategory: "EDP/ServicesSetup/BindPkgCategory",
  EDPBindPkgSubCategory: "EDP/ServicesSetup/BindPkgSubCategory",
  EDPBindIPDPackageMaster: "EDP/ServicesSetup/BindIPDPackageMaster",
  EDPLoadPanelCompany: "EDP/ServicesSetup/LoadPanelCompany",
  EDPLoadRoomType: "EDP/ServicesSetup/LoadRoomType",
  EDPBindAllCategory: "EDP/ServicesSetup/BindAllCategory",
  EDPBindAllSubCategory: "EDP/ServicesSetup/BindAllSubCategory",
  EDPSavePackage: "EDP/ServicesSetup/SavePackage",
  EDPBindPackageDetails: "EDP/ServicesSetup/BindPackageDetails",
  EDPGetStateByCountryID: "EDP/LocationMaster/GetStateByCountryID",
  EDPDeleteState: "EDP/LocationMaster/DeleteState",
  EDPGetDistrictByCountryAndStateID: "EDP/LocationMaster/GetDistrictByCountryAndStateID",
  EDPInsertState: "EDP/LocationMaster/InsertState",
  EDPDistrictInsert: "EDP/LocationMaster/DistrictInsert",
  EDPDeleteDistrict: "EDP/LocationMaster/DeleteDistrict",
  EDPUpdateDistrict: "EDP/LocationMaster/UpdateDistrict",
  EDPUpdateState: "EDP/LocationMaster/UpdateState",
  EDPGetCityByCountryStateDistrictID: "EDP/LocationMaster/GetCityByCountryStateDistrictID",
  EDPBindEmployee: "EDP/UserRightsSetup/BindEmployee",
  EDPApprDisMastSave: "EDP/UserRightsSetup/ApprDisMastSave",
  EDPPurchaseMangeApprBindEmployee: "EDP/UserRightsSetup/PurchaseMangeApprBindEmployee",
  EDPPurchaseMangeApprBindListTable: "EDP/UserRightsSetup/PurchaseMangeApprBindListTable",
  EDPPurchaseMangeApprDelete: "EDP/UserRightsSetup/PurchaseMangeApprDelete",
  EDPPurchaseMangeApprSave: "EDP/UserRightsSetup/PurchaseMangeApprSave",
  EDPuserRightsLoadEmployee: "EDP/UserRightsSetup/LoadEmployee",
  EDPIPDBillGenBindEmployee: "EDP/UserRightsSetup/IPDBillGenBindEmployee",
  EDPSaveBillAuthorized: "EDP/UserRightsSetup/SaveBillAuthorized",
  OTBindLastUpdateddetail: "OT/BindLastUpdateddetail",
  OTBindCancelled: "OT/BindCancelled",
  OTBindMedicine: "OT/BindMedicine",
  OTBindPrep: "OT/BindPrep",
  OTBindBelong: "OT/BindBelong",
  OTBindRoom: "OT/BindRoom",
  OTOPFlowSheetSave: "OT/OPFlowSheetSave",
  OTBindFlowSheetGrid: "OT/BindFlowSheetGrid",
  OTLoadTemplates: "OT/LoadTemplates",
  OTOPProcedureTemplateSave: "OT/OPProcedureTemplateSave",
  OTOPProcedureTemplateUpdate: "OT/OPProcedureTemplateUpdate",
  OTOPProcedureFillGrid: "OT/OPProcedureFillGrid",
  OTAEdit: "OT/AEdit",
  OTADelete: "OT/ADelete",
  OTCountSheetSave: "OT/CountSheetSave",
  OTCountSheetSearch: "OT/CountSheetSearch",
  OTPostAnesthesiaOrderSave: "OT/PostAnesthesiaOrderSave",
  OTGetPostAnesthesiaMonitoring: "OT/GetPostAnesthesiaMonitoring",
  GetPostAnesthesiaOrder: "OT/GetPostAnesthesiaOrder",


  // ot notes

  OTNotesSave: "OT/OTNotesSave",
  OTGetBookingTAT: "OT/GetBookingTAT",
  BindCirculatingNurse: "OT/BindCirculatingNurse",
  BindAnesthetist: "OT/BindAnesthetist",
  SavepreopinstructionURL: "OT/Savepreopinstruction",
  getpreopinstructionURL: "OT/Getpreopresultdetails",
  editpreopresultdetailsURL: "OT/editpreopresultdetails",
  LoadAllOTItemURL: "OT/LoadAllItem",
  RemovegetpreopURL: "OT/Removegetpreop",
  SaveOTPACURL: "OT/SavePAC",
  UpdatePACURL: "OT/UpdatePAC",
  GetpacresultdetailsURL: "OT/Getpacresultdetails",
  EditpacresultdetailURL: "OT/Editpacresultdetails",
  RemovepacURL: "OT/Removepac",
  OTEditSurgerySafety: "OT/EditSurgerySafety",
  OTGetSurgerySafety: "OT/GetSurgerySafety",
  OTRemove: "OT/Remove",
  OTSaveSurgerySafety: "OT/SaveSurgerySafety",
  UpdateSurgerySafety: "OT/UpdateSurgerySafety",
  PrintSurgerySafety: "OT/PrintSurgerySafety",



  // anesthesia notes
  OTGetpreopresultdetails: "OT/Getpreopresultdetails",
  OTBindAnesthetist: "OT/BindAnesthetist",
  OTBindCirculatingNurse: "OT/BindCirculatingNurse",
  OTSaveSurgerySafety: "OT/SaveSurgerySafety",

  //---Mortuary----

  MortuaryGetSerachDeathPerson: "Mortuary/GetSerachDeathPerson",
  MortuarygetReligion: "Mortuary/GetReligion",
  MortuaryGetLocality: "Mortuary/GetLocality",
  MortuaryBindRelation: "Mortuary/BindRelation",
  MortuaryBindPatientType: "Mortuary/BindPatientType",
  MortuaryBindFreezerList: "Mortuary/BindFreezerList",
  serachReceivedCorpse: "Mortuary/SerachReceivedCorpse",
  SearchCorpse: "Mortuary/SearchCorpse",


  // ----BBStock View-----
  EDPBBStockSearch: "EDP/BBStock/Search",
  EDPBBStockViewDetail: "EDP/BBStock/ViewDetail",


  // ---Question Master---
  EDPToolQuestionMasterSaveQuestion: "EDP/ToolQuestionMaster/SaveQuestion",
  EDPToolQuestionMasterUpdateQuestion: "EDP/ToolQuestionMaster/UpdateQuestion",
  EDPToolQuestionValidateQuestion: "EDP/ToolQuestionMaster/ValidateQuestion",
  EDPToolQuestionMasterBindData: "EDP/ToolQuestionMaster/BindData",

  // ---Patient Process---
  BloodBankSearchBloodCollection: "BloodBank/PatientProcess/SearchBloodCollection",
  BloodBankSaveCollectionRecordBG: "BloodBank/PatientProcess/SaveCollectionRecordBG",
  BloodBankSearchBGABO: "BloodBank/PatientProcess/SearchBGABO",
  BloodBankSaveRecordABO: "BloodBank/PatientProcess/SaveRecordABO",
  BloodBankSearchGroup: "BloodBank/PatientProcess/SearchGroup",
  BloodBankPatientapprove: "BloodBank/PatientProcess/Patientapprove",
  RemarkData: "BloodBank/PatientProcess/RemarkData",
  BloodBankSearchPatient: "BloodBank/PatientProcess/SearchPatient",
  BloodBankSaveScreening: "BloodBank/PatientProcess/SaveScreening",
  BloodBankUpdateScreening: "BloodBank/PatientProcess/UpdateScreening",
  BloodBankCheckPatientValidTime: "BloodBank/PatientProcess/CheckPatientValidTime",
  PatientProcessSearchPatientMatch: "BloodBank/PatientProcess/SearchPatientMatch",
  PatientProcessBindBag: "BloodBank/PatientProcess/BindBag",
  BloodBankPatientProcessCheckPatientValidTimeMatch: "BloodBank/PatientProcess/CheckPatientValidTimeMatch",
  BloodBankPatientProcessGetExpiryDate: "BloodBank/PatientProcess/GetExpiryDate",
  BloodBankPatientProcessUpdateBloodCrossmatch: "BloodBank/PatientProcess/UpdateBloodCrossmatch",
  BloodBankComponentSearch: "BloodBank/ComponentSearch",


  //------BLOOD BANK REPORT------
  BloodBankBloodBankReportBloodGroupingSearch: "BloodBank/BloodBankReport/BloodGroupingSearch",
  BloodBankBloodBankReportBloodGroupingReport: "BloodBank/BloodBankReport/BloodGroupingReport",
  BloodBankBloodBankReportDiscardBloodReport: "BloodBank/BloodBankReport/DiscardBloodSearchReport",
  BloodBankBloodBankReportBloodCollectionSearch: "BloodBank/BloodBankReport/BloodCollectionSearch",
  BloodBankBloodBankReportBloodCollectionReport: "BloodBank/BloodBankReport/BloodCollectionReport",
  BloodBankBloodBankReportDonorProcessBloodReport: "BloodBank/BloodBankReport/DonorProcessSearchReport",
  BloodBankBloodBankReportDonorProcessSearch: "BloodBank/BloodBankReport/DonorProcessSearch",
  BloodBankBloodBankReportBloodCrossMatchReport: "BloodBank/BloodBankReport/BloodCrossMatchReport",
  BloodBankBloodBankReportBloodCurrentStockSearch: "BloodBank/BloodBankReport/BloodCurrentStockSearch",
  BloodBankBloodBankReportBloodCurrentStockReport: "BloodBank/BloodBankReport/BloodCurrentStockReport",
  BloodBankBloodBankReportComponentDetailSearch: "BloodBank/BloodBankReport/ComponentDetailSearch",
  BloodBankBloodBankReportComponentDetailReport: "BloodBank/BloodBankReport/ComponentDetailReport",
  BloodBankBloodBankReportDiscardBloodSearch: "BloodBank/BloodBankReport/DiscardBloodSearch",


  // Govind  End

  // Mayank Start
  handleSavePanelCentreURL: "EDP/CentreSetUp/SavesPanelsMappingsDetails",
  SavesEmployeeMappingsDetailsURL: "EDP/CentreSetUp/SavesEmployeeMappingsDetails",
  LoadEDPRateItemsURL: "EDP/ServicesRateSetup/LoadItems",
  GetRoleToEditAPI: "EDP/RoleAndDepartmentSetUp/GetRoleToEdit",
  updateRoleEDPUpdateURL: "EDP/RoleAndDepartmentSetUp/EditRoleById",
  // menu setUp
  MenuSetupBindLoginTypeURL: "EDP/MenuSetup/BindLoginType",
  MenuSetupBindAllMenuURL: "EDP/MenuSetup/BindAllMenu",

  // Panel Setup start
  EDPBindPanelGroupURL: "EDP/PanelSetUp/BindPanelGroup",
  EDPBindPaymentModeURL: "EDP/PanelSetUp/BindPaymentMode",
  EDPBindPanelsURL: "EDP/PanelSetUp/BindPanels",
  EDPBindPanelCurrencyURL: "EDP/ServicesRateSetup/BindPanelCurrency",
  EDPBindCurrencyDetailsURL: "EDP/PanelSetUp/BindCurrencyDetails",
  EDPSavePanelURL: "EDP/PanelSetUp/SavePanel",
  EDPBindPanelDetailsURL: "EDP/PanelSetUp/BindPanelDetails",
  EDPCategoryMasterURL: "EDP/PanelSetUp/GetCategoryMaster",
  EDPBindPanelsubcatagoryURL: "EDP/PanelSetUp/BindPanelsubcatagory",
  EDPServiceOfferedListURL: "EDP/PanelSetUp/GetItems",
  EDPBindReduceitemdetailsURL: "EDP/PanelSetUp/BindReduceitemdetails",

  // Panel Setup END

  // Blood Bank Start
  EDPLoadBloodBagURL: "EDP/BloodBankMaster/LoadBloodBag",
  EDPLoadBloodComponentURL: "EDP/BloodBankMaster/LoadBloodComponent",
  EDPBindMappedBloodBagURL: "EDP/BloodBankMaster/BindMappedBloodBag",
  EDPDeleteMapBloodBagURL: "EDP/BloodBankMaster/DeleteMapBloodBag",
  EDPSaveMapBloodBagTypeURL: "EDP/BloodBankMaster/SaveMapBloodBagType",
  EDPLoadBagTypeURL: "EDP/BloodBankMaster/LoadBagType",
  EDPSaveBagTypeURL: "EDP/BloodBankMaster/SaveBagType",
  EDPUpdateBagTypeURL: "EDP/BloodBankMaster/UpdateBagType",
  EDPBloodComponmentSearchURL: "EDP/BloodBankMaster/Search",
  EDPSaveBloodComponmentURL: "EDP/BloodBankMaster/SaveBloodComponment",
  EDPUpdateBloodComponmentURL: "EDP/BloodBankMaster/UpdateBloodComponment",
  EDPLoadBloodGroupURL: "EDP/BloodBankMaster/LoadBloodGroup",
  EDPBindMappedBloodGroupURL: "EDP/BloodBankMaster/BindMappedBloodGroup",
  EDPSaveMapBloodGroupURL: "EDP/BloodBankMaster/SaveMapBloodGroup",
  EDPDeleteMapBloodGroupURL: "EDP/BloodBankMaster/DeleteMapBloodGroup",
  EDPBindDataOrganisationURL: "EDP/BloodBankMaster/BindDataOrganisation",
  EDPValidateOrganisationURL: "EDP/BloodBankMaster/ValidateOrganisation",
  EDPSaveOrganisationURL: "EDP/BloodBankMaster/SaveOrganisation",
  EDPBloodBankMasterUpdateOrganisation: "EDP/BloodBankMaster/UpdateOrganisation",
  EDPBindComponentNameURL: "EDP/BloodBankMaster/BindComponentName",
  EDPBindBloodBankItemURL: "EDP/BloodBankMaster/BindBloodBankItem",
  EDPSaveItemComponentURL: "EDP/BloodBankMaster/SaveItemComponent",


  // Package management start
  EDPBindPackageURL: "EDP/ServicesSetup/BindPackage",
  EDPBindSubCategoryURL: "EDP/ServicesSetup/BindSubCategory",
  EDPBindDocSpecializationURL: "EDP/DoctorSetUp/BindDocSpecialization",
  EDPSaveDocSpecializationURL: "EDP/DoctorSetUp/SaveDocSpecialization",
  EDPUpdateDocSpecializationURL: "EDP/DoctorSetUp/UpdateDocSpecialization",
  EDPGetDoctorVisitDetailURL: "EDP/DoctorSetUp/GetDoctorVisitDetail",
  EDPOPDVisitConfigSaveURL: "EDP/DoctorSetUp/OPDVisitConfigSave",
  OPDScheduleDetailsSearch: "EDP/DoctorSetUp/OPDScheduleDetailsSearch",




  // Mayank End 



  // Pragya Start
  LoadDepartmentSurgery: "EDP/ServicesSetup/LoadDepartmentSurgery",
  SaveDepartmentSurgery: "EDP/ServicesSetup/SaveDepartmentSurgery",
  SaveSurgeryMaster: "EDP/ServicesSetup/SaveSurgeryMaster",
  LoadSurgery: "EDP/ServicesSetup/LoadSurgery",
  UpdateSurgeryMaster: "EDP/ServicesSetup/UpdateSurgeryMaster",
  SaveBank: "EDP/BasicMaster/SaveBank",
  BindBank: "EDP/BasicMaster/BindBank",
  SaveCountryMaster: "EDP/BasicMaster/SaveCountryMaster",
  LoadCountry: "EDP/BasicMaster/LoadCountry",
  LoadCountryByID: "EDP/BasicMaster/LoadCountryByID",
  UpdateCountryMaster: "EDP/BasicMaster/UpdateCountryMaster",
  SaveApprovalType: "EDP/BasicMaster/SaveApprovalType",
  BindDiscountApproval: "EDP/BasicMaster/BindDiscountApproval",
  UpdateApprovalType: "EDP/BasicMaster/UpdateApprovalType",


  //Role Management API
  EDPRoleBindCentre: "EDP/RoleAndDepartmentSetUp/BindCentre",
  GetRoomByFloor: "EDP/RoleAndDepartmentSetUp/GetRoomByFloor",
  MapRoleToRoom: "EDP/RoleAndDepartmentSetUp/MapRoleToRoom",

  //Panel Management ///... Upload document  master 
  BindDocumentName: "EDP/PanelSetUp/BindDocumentName",
  SaveDocumentMaster: "EDP/PanelSetUp/SaveDocumentMaster",
  GetFloorByCentre: "EDP/RoleAndDepartmentSetUp/GetFloorByCentre",
  UpdateDocumentMaster: "EDP/PanelSetUp/UpdateDocumentMaster",
  SearchRoomById: "EDP/RoomMasterSetUp/SearchRoomById",

  //room master
  RoomBindCentre: "EDP/RoomMasterSetUp/RoomBindCentre",
  SearchRoomData: "EDP/RoomMasterSetUp/SearchRoomData",
  SaveRoomData: "EDP/RoomMasterSetUp/SaveRoomData",
  InsertNewRoomType: "EDP/RoomMasterSetUp/InsertNewRoomType",
  InsertRoomDatalog: "EDP/RoomMasterSetUp/InsertRoomDatalog",

  //membershipCard  Discount
  GetBindDataCard: "EDP/MemberShipCardSetUp/GetBindDataCard",

  //dietMaster //component master
  DietComponentBindGrid: "EDP/DietMaster/ComponentBindGrid",
  DietComponentMasterSave: "EDP/DietMaster/ComponentMasterSave",
  DietComponentMasterUpdate: "EDP/DietMaster/ComponentMasterUpdate",

  //dietMaster //dietTypeMaster

  DietBindDetails: "EDP/DietMaster/BindDetail",
  SaveDietType: "EDP/DietMaster/SaveDietType",
  UpdateDietType: "EDP/DietMaster/UpdateDietType",

  //dietMaster //subdietTypeMaster
  SubDietBindGrid: "EDP/DietMaster/SubDietBindGrid",
  SubDietTypeSave: "EDP/DietMaster/SubDietTypeSave",
  SubDietTypeUpdate: "EDP/DietMaster/SubDietTypeUpdate",
  GetDietType: "EDP/DietMaster/GetDietType",
  GetMapSubDiet: "EDP/DietMaster/GetMapSubDiet",
  MapSubDietSave: "EDP/DietMaster/MapSubDietSave",

  //dietMaster // diet timing Master
  BindTimingGrid: "EDP/DietMaster/BindTimingGrid",
  SaveDietTiming: "EDP/DietMaster/SaveDietTiming",
  UpdateDietTiming: "EDP/DietMaster/UpdateDietTiming",

  //dietMaster >> diet menu Master 
  BindGridDietMenu: "EDP/DietMaster/BindGridDietMenu",
  DietMenuSave: "EDP/DietMaster/DietMenuSave",
  DietMenuUpdate: "EDP/DietMaster/DietMenuUpdate",

  //dietMaster >> map diet component master 
  Diettiming: "EDP/DietMaster/Diettiming",
  BindSubMenu: "EDP/DietMaster/BindSubMenu",
  MenuName: "EDP/DietMaster/MenuName",
  MapDietSearch: "EDP/DietMaster/MapDietSearch",
  MapDietSave: "EDP/DietMaster/MapDietSave",

  //diet >> freeze/issue patient diet
  BindWard: "EDP/DietMaster/BindWard",
  DietIssueBindGrid: "EDP/DietMaster/Diet_Issue_BindGrid",


  //diet >> patient diet request
  DietRequestSearch: "EDP/DietMaster/DietRequestSearch",
  BindDietType: "EDP/DietMaster/BindDietType",
  BindSubDietType: "EDP/DietMaster/BindSubDietType",
  DietBindMenu: "EDP/DietMaster/bindMenu",
  GetComponent: "EDP/DietMaster/GetComponent",
  ReceivedDiet: "EDP/DietMaster/ReceivedDiet",
  DietSaveComponent: "EDP/DietMaster/saveComponent",

  //blood bank >> bbstock >> direct stock receive
  BindOrganisation: "EDP/BBStock/BindOrganisation",
  BindComponent: "EDP/BBStock/BindComponent",
  BindBloodGroup: "EDP/BBStock/BindBloodGroup",
  BindBloodAdd: "EDP/BBStock/Add",
  BindBloodSave: "EDP/BBStock/Save",
  BindRate: "/EDP/BBStock/BindRate",
  // Pragya End 


  FeedBackSaveQuestionMaster: "FeedBack/FeedBack/SaveQuestionMaster",
  FeedBackSearchQuestionMaster: "FeedBack/FeedBack/SearchQuestionMaster",
  FeedBackDeleteQuestionMaster: "FeedBack/FeedBack/DeleteQuestionMaster",
  FeedBackUpdateQuestionMaster: "FeedBack/FeedBack/UpdateQuestionMaster",
  SearchPatientFeedBack: "FeedBack/FeedBack/SearchPatientFeedBack",
  SavePatientFeedBack: "FeedBack/FeedBack/SavePatientFeedBack",
  SaveQuestionDepartment: "FeedBack/FeedBack/SaveQuestionDepartment",
  GetQuestionDepartment: "FeedBack/FeedBack/GetQuestionDepartment",
  BindEmployeeFeedBack: "FeedBack/FeedBack/BindEmployeeFeedBack",
  FeedBackFeedBackReport: "FeedBack/FeedBack/FeedBackReport",
  OPDAdvancCRMFundReport: "OPDAdvance/CRMFundReport",
  OPDGetPanelReport: "OPD/GetPanel",
  OPDGetPackageReport: "OPD/GetPackage",
  OPDPackageReport: "OPD/OPDPackageReport",
  OPDOpenandClosePackage: "OPD/OpenandClosePackage",
  PackageDetail_report: "OPD/PackageDetail",
  OPDPackageSummaryReport: "OPD/OPDPackageSummaryReport",
  BillFinalReport: "Billing/BillFinalReport",
  IPDNoByCeilingDetails: "Billing/IPD/IPDNoByCeilingDetails",
  SaveCeilingAmount: "Billing/IPD/SaveCeilingAmount",
  IPDNoByApprovalDays: "Billing/IPD/IPDNoByApprovalDays",
  SaveApprovalDays: "Billing/IPD/SaveApprovalDays",
  BillingIPDBindTPA: "Billing/IPD/BindTPA",
  IPDAdmissionMultipleReport: "CurrentStock/IPDAdmissionMultipleReport",
  OTBindData: "OT/BindData",
  OTBindSurgery: "OT/BindSurgery",
  OTBindddlProcedure: "OT/BindddlProcedure",
  OTPrintOTNotes: "OT/PrintOTNotes",

  // EDP End   /


  // OT booking Start here 
  GetAllSurgery: "OT/GetAllSurgery",
  OTBookingSave: "OT/OTBookingSave",
  GetPatientBookingDetails: "OT/GetPatientBookingDetails",
  OTBindOTTATTypeURL: "OT/BindOTTATType",
  GetAdmittedPatientURL: "OT/GetAdmittedPatient",
  ValidateExpiredBooking: "OT/ValidateExpiredBooking",
  OtConfirmBooking: "OT/ConfirmBooking",
  CancelBookingOt: "OT/CancelBooking",
  GetAdmitPatientDetailsURL: "OT/GetAdmitPatientDetails",
  OTMappatientidURL: "OT/Mappatientid",
  OTReceivedOTPatientURL: "OT/ReceivedOTPatient",
  OTGetExitingOTsURL: "OT/GetExitingOTs",
  OTGetOTPatientSearchData: "OT/GetOTPatientSearchData",
  CPOEBindVitals: "CPOE/BindVitals",
  BindType: "OT/BindType",
  OTBindStaff: "OT/BindStaff",
  OTBindSavedStaff: "OT/BindSavedStaff",
  OTGetAllSurgery: "OT/GetAllSurgery",
  OTGetBookedMultipleSurgeryList: "OT/GetBookedMultipleSurgeryList",
  OTSaveNewSurgeryBooking: "OT/SaveNewSurgeryBooking",
  BindOTdetails: "OT/BindOTPatientSearch",
  OTSaveType: "OT/SaveType",
  OTBindTATType: "OT/BindTATType",
  OTSaveTAT: "OT/SaveTAT",
  OTSaveStaff: "OT/SaveStaff",

  // OT booking END here 

    DeleteActionTemplate: "PrescriptionAdvice/DeleteTemplate",
    GetEditTemplate: "PrescriptionAdvice/GetTemplate",
    GetDoctorPrescriptionSuggestion: "PrescriptionAdvice/GetDoctorPrescriptionSuggestion",

    GetNewChildVaccineChart: "PrescriptionAdvice/GetNewChildVaccineChart",
    GetPatentDOB: "PrescriptionAdvice/GetPatientDOB",
    SaveOrUpdatePatientDOB: "PrescriptionAdvice/SaveOrUpdatePatientDOB",
    GetVaccineBrand: "PrescriptionAdvice/GetVaccineBrand",
    SaveOrUpdateVaccineBrandName: "PrescriptionAdvice/SaveOrUpdateVaccineBrandName",
    GetBabyGrowthNew: "Doctor/GetBabyGrowthNew",
    InsertBabyGrowthNew: "Doctor/InsertBabyGrowthNew",
    UpdateBabyGrowthNew: "Doctor/UpdateBabyGrowthNew",
    SaveBabyGrowthChart: "PrescriptionAdvice/SaveBabyGrowthChart",
    GetBabyGrowthChart: "PrescriptionAdvice/GetBabyGrowthChart",
    GetGrowthChartPrintPdf:"PrescriptionAdvice/GetGrowthChartPrintPdf",
    SaveMidParentalDetail:"PrescriptionAdvice/SaveMidParentalDetail",
    GetGrowthProfile:"PrescriptionAdvice/GetGrowthProfile",
    GetWhoGrowthStandard:"PrescriptionAdvice/GetWhoGrowthStandard",
};



