import React, { Fragment, Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "@app/components/loader/Loading";
import ErrorBoundary from "../layouts/error-Boundary";
import Layout from "@app/layouts";
import Authenticated from "@app/Guard/Authenticated.jsx";
import Guest from "@app/Guard/Guest.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import {
  GetBindMenu,
  GetBindResourceList,
  GetRoleListByEmployeeIDAndCentreID,
} from "../store/reducers/common/CommonExportFunction";
import { ToastContainer } from "react-toastify";

function RenderRoute() {
  const { GetMenuList } = useSelector((state) => state?.CommonSlice);
  const localData = useLocalStorage("userData", "get");
  const location = useLocation();
  const dispatch = useDispatch();
  const [waitForRoute, setWaitForRoute] = useState(true);

  const fetchData = async () => {
    try {
      await dispatch(
        GetRoleListByEmployeeIDAndCentreID({
          employeeID: localData?.employeeID,
          centreID: localData?.centreID,
        })
      );

      await dispatch(
        GetBindMenu({
          RoleID: localData?.defaultRole,
        })
      );

      await dispatch(GetBindResourceList());

      setWaitForRoute(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWaitForRoute(false);
    }
  };

  useEffect(() => {
    if (localData && GetMenuList?.length === 0) {
      fetchData();
    } else {
      setWaitForRoute(false);
    }
  }, [location]);

  if (waitForRoute) {
    return <Loading />;
  }

  const getAllUrls = [];
  getAllUrls.push("/display-name-master");
  getAllUrls.push("/doctor-departmentMapping");
  getAllUrls.push("/voucher-audit");
  getAllUrls.push("/finace-reports");
  getAllUrls.push("/trial-balance-report");
  getAllUrls.push("/chartofgroup-new");
  getAllUrls.push("/general-ledger-report");
  getAllUrls.push("/receivable-ledger-report");
  getAllUrls.push("/purchase-bill-due-report");
  getAllUrls.push("/payable-statement-report");
  getAllUrls.push("/account-receible-agingsummary");
  getAllUrls.push("/payable-bankwise-report");
  getAllUrls.push("/edp-center-management");
  getAllUrls.push("/edp-map-store-item");
  getAllUrls.push("/edp_item_master");
  getAllUrls.push("/rate-schedule-charges");
  getAllUrls.push("/category-master");
  getAllUrls.push("/subcategory-master");
  getAllUrls.push("/panel-master");
  getAllUrls.push("/add-interpretation");
  // getAllUrls.push("/voucher-audit");
  getAllUrls.push("/rate-list");
  getAllUrls.push("/edp-copy-rates");
  getAllUrls.push("/observation-type");
  getAllUrls.push("/formula-master");
  getAllUrls.push("/lab-observationhelp");
  getAllUrls.push("/surgeryrates");
  getAllUrls.push("/surgery-grouping");
  getAllUrls.push("/manage-approval-rights");
  getAllUrls.push("/patient-grouping-approval");
  getAllUrls.push("/patient-blood-screening");
  getAllUrls.push("/patient-blood-request");
  getAllUrls.push("/patient-blood-return");
  getAllUrls.push("/hold-blood-issue");

  //Govind
  getAllUrls.push("/active-deactive-employee");
  getAllUrls.push("/edp-doctor-department-master");
  getAllUrls.push("/edp-common-masterform");
  getAllUrls.push("/new-surgery-type");
  getAllUrls.push("/receive-corpse");
  getAllUrls.push("/corpse-deposite");
  getAllUrls.push("/search-received-corpse");
  getAllUrls.push("/search-corpse");
  getAllUrls.push("/advance-settelment");
  getAllUrls.push("/question-master");
  getAllUrls.push("/bb-report");
  getAllUrls.push("/revenue-report");

  //Anand

  getAllUrls.push("/rgp-issue");
  getAllUrls.push("/cashtocredit");
  getAllUrls.push("/rgp");

  getAllUrls.push("/investigation-sequence");
  getAllUrls.push("/mapinvestigation-observationnew");
  getAllUrls.push("/inv-template");
  getAllUrls.push("/lab-comment-master");

  //sadhana
  getAllUrls.push("/package-status");
  getAllUrls.push("/pharmacy-package-issue");
  getAllUrls.push("/change-payment-mode");

  // EDP Start

  getAllUrls.push("/panel-document-master");

  getAllUrls.push("/edp-location-master");
  getAllUrls.push("/edp-add-master");
  getAllUrls.push("/opd-pkg-master");
  getAllUrls.push("/ipd-pkg-master");

  getAllUrls.push("/edp-sms-reports");
  getAllUrls.push("/edp-sms-employee");
  getAllUrls.push("/edp-sms-template-master");
  getAllUrls.push("/edp-sms-master");
  getAllUrls.push("/edp-sms-doctor");

  getAllUrls.push("/surgery-master");
  getAllUrls.push("/outsourcelab-master");
  getAllUrls.push("/samplecontainer-master");
  getAllUrls.push("/doctor-reg");
  getAllUrls.push("/viewdoctor-detail");
  getAllUrls.push("/bank-master");
  getAllUrls.push("/country-master");

  getAllUrls.push("/manageis-nabl");
  getAllUrls.push("/manage-deliverydays");
  getAllUrls.push("/nabh-manual");
  getAllUrls.push("/drug-formulary");
  //akhilesh

  getAllUrls.push("/grn-by-gate-entry");

  getAllUrls.push("/edp-approval-type-master");
  getAllUrls.push("/edp-discount-referal-master");
  getAllUrls.push("/edp-pro-master");
  getAllUrls.push("/edp-welcome-msg");
  getAllUrls.push("/edp-minimum-threshold-limit");
  getAllUrls.push("/ot-booking");
  getAllUrls.push("/room-master");

  ///Govind
  getAllUrls.push("/edp-ipd-bill-centre");
  getAllUrls.push("/admit-disch-cancel");
  getAllUrls.push("/edp-payment-mode-edit");
  getAllUrls.push("/edp-discharge-process-setting");
  getAllUrls.push("/edp-admin-disc-date-edit");
  getAllUrls.push("/cpoe-menu-ordering");
  getAllUrls.push("/blood-bag-master");
  getAllUrls.push("/edp-manage-email-body-master");
  getAllUrls.push("/edp-email-template-master");
  getAllUrls.push("/edp-refer-doctor-master");
  getAllUrls.push("/edp-managment-role");
  getAllUrls.push("/create-freezer");
  getAllUrls.push("/edp-discharge-approval-master");
  getAllUrls.push("/edp-manager-approval");
  getAllUrls.push("/edp-ipd-bill-generation");

  // karan

  getAllUrls.push("/card-master");
  getAllUrls.push("/membership-carddiskount");

  getAllUrls.push("/radiology-acceptance");

  //pragya
  getAllUrls.push("/component-master");
  getAllUrls.push("/diet-type-master");
  getAllUrls.push("/membership-card-discount");
  getAllUrls.push("/sub-type-master");
  getAllUrls.push("/diet-timing-master");
  getAllUrls.push("/diet-menu-master");
  getAllUrls.push("/map-dietype-compo");
  getAllUrls.push("/issue-patient-diet");
  getAllUrls.push("/patient-diet-request");
  getAllUrls.push("/direct-blood-bank");
  getAllUrls.push("/patient-cross-match");

  // Aakash start
  getAllUrls.push("/prescription-multi-print");
  getAllUrls.push("/diet-schedular");
  getAllUrls.push("/diet-patient-information");
  getAllUrls.push("/patient-diet-kitchen");
  getAllUrls.push("/patient-diet-indent-approval");

  // AAkash end

  //satish start
  getAllUrls.push("/provitional-tat-report");
  getAllUrls.push("/patient-ceiling");
  getAllUrls.push("/panel-approval-days");
  getAllUrls.push("/room-maintenance-mark");
  getAllUrls.push("/under-maintenance");
  getAllUrls.push("/diet-request-report");
  getAllUrls.push("/as-on-diet-report");
  getAllUrls.push("/diet-issue-report");
  getAllUrls.push("/blood-bank-issue-report");
  getAllUrls.push("/request-room-shift");

  //satish end

  getAllUrls.push("/report-chat-ai");
  getAllUrls.push("/report-viewer");

  // Blood Bank Start
  getAllUrls.push("/blood-component-mapping");
  getAllUrls.push("/blood-bag-mapping");
  getAllUrls.push("/blood-bag-type-master");
  getAllUrls.push("/blood-group-compatibility");
  getAllUrls.push("/blood-map-item-component");
  getAllUrls.push("/blood-organisation-master");

  // donor process end point start here
  getAllUrls.push("/donor-registration");
  getAllUrls.push("/blood-collection");
  getAllUrls.push("/grouping");
  getAllUrls.push("/grouping-approval");
  getAllUrls.push("/blood-screening");
  getAllUrls.push("/ttd-approval");
  getAllUrls.push("/component-creation");
  getAllUrls.push("/poststock");
  getAllUrls.push("/discard-blood-stock");
  getAllUrls.push("/doctors-added-medicine");
  GetMenuList?.length > 0 &&
    [...GetMenuList]?.forEach((menu) => {
      menu?.children.forEach((child) => {
        getAllUrls.push(child.url.toLowerCase());
      });
    });

  getAllUrls.push("/revenue-analysis-dashboard");

  // Filter and bind routes to getAllUrls
  const bindroutes = allRoutes["roleRoutes"].reduce((acc, current) => {
    if (getAllUrls.includes(current?.path.toLowerCase())) {
      acc.push(current);
    }
    return acc;
  }, []);
  return (
    <>
      <ToastContainer
        autoClose={1000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            {[...allRoutes["commonRoutes"], ...bindroutes]?.map(
              (route, index) => {
                const Component = route?.component;
                const Layout = route?.layout || Fragment;
                const Guard = route?.Guard || Fragment;

                return (
                  <Route
                    path={route?.path}
                    exact={route?.exact}
                    key={index}
                    element={
                      <Guard>
                        <Layout>
                          <Component />
                        </Layout>
                      </Guard>
                    }
                  />
                );
              }
            )}
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default RenderRoute;

const allRoutes = {
  commonRoutes: [
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "*",
    //   component: lazy(() => import("@app/pages/NotFound.jsx")),
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/dashboard",
      component: lazy(() => import("@app/pages/Dashboard.jsx")),
      exact: true,
      // icon:"pi pi-user"
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewConsultation",
      component: lazy(
        () => import("@app/pages/doctor/OPD/ViewConsultation.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/prescription-multi-print",
      component: lazy(
        () => import("@app/pages/doctor/OPD/PrescriptionMultiPrint.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctor-departmentMapping",
      component: lazy(
        () =>
          import(
            "@app/pages/doctor/doctorDepartmentMapping/DoctorDepartmentMapping.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctor-related-opd-report",
      component: lazy(
        () => import("@app/pages/doctor/Report/DoctorsRelatedOPDReports.jsx")
      ),
      exact: true,
    },
    {
      Guard: Guest,
      path: "/login",
      component: lazy(() => import("../modules/login/Login")),
      exact: true,
    },
    {
      path: "/ForgetPassword",
      component: lazy(() => import("@app/modules/login/ForgetPassword.jsx")),
      exact: true,
    },
  ],
  roleRoutes: [
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DirectPatientReg",
      component: lazy(
        () => import("@app/pages/frontOffice/PatientRegistration/Index.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/add-language",
      component: lazy(() => import("../modules/login/AddLauguage")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PatientBlackList",
      component: lazy(
        () =>
          import(
            "@app/pages/frontOffice/PatientRegistration/PatientBlackList.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-servicebooking",
      component: lazy(
        () => import("@app/pages/frontOffice/OPD/OPDServiceBooking.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Lab-Package-Include",
      component: lazy(
        () => import("@app/pages/frontOffice/OPD/LabPackageInclude.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Confirmation",
      component: lazy(
        () => import("@app/pages/frontOffice/OPD/Confirmation.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-setellment",
      component: lazy(
        () => import("@app/pages/frontOffice/OPDSetellment/Index.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-refund",
      component: lazy(() => import("@app/pages/frontOffice/OPD/OPDRefund.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-advance",
      component: lazy(
        () => import("@app/pages/frontOffice/OPDAdvance/Index.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/card-print",
      component: lazy(() => import("@app/pages/frontOffice/OPD/CardPrint.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Uploadpatientdocuments",
      component: lazy(
        () => import("@app/pages/frontOffice/OPD/UploadViewDocument.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ReceiptReprint",
      component: lazy(
        () => import("@app/pages/frontOffice/Re_Print/ReceiptReprint.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/package-status",
      component: lazy(
        () =>
          import("@app/pages/frontOffice/PackageStatus/OPDPackageStatus.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/OpdTriageRoom",
      component: lazy(
        () => import("@app/pages/triageRoom/OPD/OpdTriageRoom.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/expense-voucher",
      component: lazy(
        () => import("@app/pages/frontOffice/tools/ExpenseVoucher.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DebitCreditNote",
      component: lazy(
        () => import("@app/pages/frontOffice/tools/DebitCreditNote.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bill-claim-details",
      component: lazy(
        () => import("@app/pages/frontOffice/tools/BillingClaimDetails.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/chemo-patient-entry",
      component: lazy(
        () => import("@app/pages/frontOffice/tools/ChemoPatientEntry.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-feed-back-report",
      component: lazy(
        () =>
          import(
            "@app/pages/frontOffice/patientFeedback/PatientFeedbackReport.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/feedback-report",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/FeedBack_Report.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cmr-fund-report",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/CmrReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-package-status",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/OPD_Package_Report.jsx")
      ),
      exact: true,
    },
    // by anand......

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/IPDAdmissionNew",
      component: lazy(
        () => import("@app/pages/Billing/IPD/IPDAdmissionNew.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DischargeTracker",
      component: lazy(
        () => import("@app/pages/Billing/IPD/DischargeTracker.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PatientRegSearch",
      component: lazy(
        () => import("@app/pages/Billing/IPD/PatientRegSearch.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-ceiling",
      component: lazy(
        () => import("@app/pages/Billing/IPD/PatientCeiling.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/panel-approval-days",
      component: lazy(
        () => import("@app/pages/Billing/IPD/PanelApprovalDays.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/room-maintenance-mark",
      component: lazy(
        () => import("@app/pages/Billing/IPD/RoomMaintenanceMark.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/under-maintenance",
      component: lazy(
        () => import("@app/pages/Billing/IPD/UnderMaintenance.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/request-room-shift",
      component: lazy(
        () => import("@app/pages/Billing/IPD/RequestRoomShift.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreateIndent",
      component: lazy(
        () => import("@app/pages/Billing/Requisition/CreateRequisition.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/IndentSearch",
      component: lazy(
        () => import("@app/pages/Billing/Requisition/ViewUserRequisition.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConsumeItem",
      component: lazy(
        () => import("@app/pages/Inventory/Consume/ConsumeItem.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InternalStockTransfer",
      component: lazy(
        () => import("@app/pages/Inventory/Issue/InternalStockTransfer.jsx")
      ),
      exact: true,
    },
    // ----------------------------------Sadhana --------------------------------------
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pharmacy-package-issue",
      component: lazy(
        () => import("@app/pages/Inventory/Issue/PharmacyIssuePackage.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchStockAdjustment",
      component: lazy(
        () => import("@app/pages/Inventory/Reports/SearchStockAdjustment.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/StoreReports",
      component: lazy(
        () => import("@app/pages/Inventory/Reports/StoreReports.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConsignmentReturn_Report",
      component: lazy(
        () => import("@app/pages/Inventory/Reports/ConsignmentReturnReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/GSTReport",
      component: lazy(
        () => import("@app/pages/Inventory/Reports/GSTReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewIssueReturn",
      component: lazy(
        () => import("@app/pages/Inventory/Issue/ViewIssueReturn.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DirectDepartmentIssue",
      component: lazy(
        () => import("@app/pages/Inventory/Issue/DirectDepartmentIssue.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DepartmentReturn",
      component: lazy(
        () => import("@app/pages/Inventory/Return/DepartmentReturn.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/VendorReturn",
      component: lazy(
        () => import("@app/pages/Inventory/Return/VendorReturn.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SetLowStock",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/SetLowStock.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangeCurrentStockMRP",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/ChangeCurrentStockMRP.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConsignmentSaleReturn",
      component: lazy(
        () => import("@app/pages/Inventory/Return/ConsignmentSaleReturn.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/StockLedgerMedical",
      component: lazy(
        () => import("@app/pages/Inventory/Reports/StockLedgerMedical.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/StockStatusReport",
      component: lazy(
        () => import("@app/pages/Inventory/Reports/StockStatusReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManufactureMaster",
      component: lazy(
        () => import("@app/pages/Inventory/Master/ManufactureMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/salt_item_master",
      component: lazy(
        () => import("@app/pages/Inventory/Master/GenericMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/VendorDetail",
      component: lazy(
        () => import("@app/pages/Inventory/Master/VendorDetail.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ItemMaster",
      component: lazy(
        () => import("@app/pages/Inventory/Master/ItemMaster.jsx")
      ),
      exact: true,
    },
    // Sample Collection start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/sample-collection-lab",
      component: lazy(
        () =>
          import("@app/pages/sampleCollectionManagement/SampleCollection.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/sample-transfer",
      component: lazy(
        () => import("@app/pages/sampleCollectionManagement/SampleTransfer.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/logistic-receive",
      component: lazy(
        () =>
          import(
            "@app/pages/sampleCollectionManagement/SampleLogisticReceive.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/samplecollection-report",
      component: lazy(
        () =>
          import(
            "@app/pages/sampleCollectionManagement/SampleCollectionReport.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/laboutsource-details",
      component: lazy(
        () => import("@app/pages/sampleCollectionManagement/LaboutSource.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/samplerejection-details",
      component: lazy(
        () =>
          import("@app/pages/sampleCollectionManagement/SampleRejection.jsx")
      ),
      exact: true,
    },
    // Sample Collection End
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/IPDAdvanceAndRefund",
      component: lazy(
        () => import("@app/pages/Billing/IPD/IPDAdvanceAndRefund.jsx")
      ),
      exact: true,
    },
    // Reports Section Start--------------------------------------------------
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-balance-advance-detail",
      component: lazy(
        () =>
          import("@app/pages/frontOffice/Reports/OPDBalanceAdvanceDetail.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-balance-advance-detail",
      component: lazy(
        () =>
          import("@app/pages/frontOffice/Reports/OPDBalanceAdvanceDetail.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/revenueAnalysisReport",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/RevenueAnalysisReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/IPDBillingStatusReport",
      component: lazy(
        () =>
          import("@app/pages/frontOffice/Reports/IPDBillingStatusReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/refund-details",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/RefundDetail.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/collection-report",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/CollectionReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/registration-report",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/RegistrationReport.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-vise-search",
      component: lazy(
        () => import("@app/pages/frontOffice/Reports/PatientViseHistory.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MRDDashboard",
      component: lazy(() => import("@app/pages/MRD/Reports/MRDAllReports.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MRD_Report",
      component: lazy(
        () => import("@app/pages/MRD/Reports/MRDAnalysisDetails.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/NABHReportNew",
      component: lazy(() => import("@app/pages/MRD/Reports/NABHReportNew.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchMRD",
      component: lazy(
        () => import("@app/pages/MRD/Reports/MRDPatientSearch.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FileIssuedStatus",
      component: lazy(
        () => import("@app/pages/MRD/Reports/MRDFileIssuedStatus.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BedOccupancyReport",
      component: lazy(
        () => import("@app/pages/MRD/Reports/BedOccupancyReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AdmissionDischargeList",
      component: lazy(
        () => import("@app/pages/MRD/Reports/Admit_DischargePatientReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PatientICDCodeReport",
      component: lazy(
        () => import("@app/pages/MRD/Reports/PatientICDCodeReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SurgeryAnalysisReport",
      component: lazy(
        () => import("@app/pages/MRD/Reports/SurgeryAnalysisDetail.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-billregisterreport",
      component: lazy(
        () =>
          import("@app/pages/frontOffice/Reports/OPD_BillRegisterReport.jsx")
      ),
      exact: true,
    },
    // anand .....................
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/feed-back",
      component: lazy(
        () =>
          import(
            "@app/pages/frontOffice/PatientFeedback/PatientFeedbackform.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/panel-detail",
      component: lazy(() => import("@app/pages/helpDesk/PanelDetail.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/package-detail-opd",
      component: lazy(() => import("@app/pages/helpDesk/PackageDetailOPD.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cost-estimation-billing",
      component: lazy(
        () => import("@app/pages/helpDesk/CostEstimateBilling.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctortiming",
      component: lazy(() => import("@app/pages/helpDesk/DoctorTiming.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/help-deskipd",
      component: lazy(() => import("@app/pages/helpDesk/HelpDeskIPD.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cost-estimation-reprint",
      component: lazy(
        () => import("@app/pages/helpDesk/CostEstimationReprint.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CostEstimateBilling",
      component: lazy(
        () => import("@app/pages/helpDesk/CostEstimateBilling.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/exam-counter-master",
      component: lazy(
        () => import("@app/pages/TokenManagement/ExamCounterMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/token-generation-master",
      component: lazy(
        () => import("@app/pages/TokenManagement/TokenGenerationMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/online-inv-slot-master",
      component: lazy(
        () => import("@app/pages/TokenManagement/OnlineInvSlotMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/modality-master",
      component: lazy(
        () => import("@app/pages/TokenManagement/ModalityMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/samplecollroommaster",
      component: lazy(
        () => import("@app/pages/TokenManagement/SampleCollRoomMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/vital-sign",
      component: lazy(
        () => import("@app/pages/examinationRoom/frameMenu/VitalSign.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctorwiseappsummary",
      component: lazy(
        () =>
          import("@app/pages/examinationRoom/reports/DoctorwiseAppsummary.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctorwiseappdetail",
      component: lazy(
        () =>
          import("@app/pages/examinationRoom/reports/DoctorWiseAppDetail.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/examination-room",
      component: lazy(
        () => import("@app/pages/examinationRoom/OPD/ExaminationRoom.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/nurse-assignment",
      component: lazy(
        () => import("@app/pages/NursingWard/IPD/NurseAssignment.jsx")
      ),
      exact: true,
    },

    // creditcontrol

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DispatchMaster",
      component: lazy(
        () => import("@app/pages/Creditcontrol/Invoice/DispatchMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceCancel",
      component: lazy(
        () => import("@app/pages/Creditcontrol/Invoice/InvoiceCancel.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceSettlement",
      component: lazy(
        () => import("@app/pages/Creditcontrol/Invoice/InvoiceSettlement.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceSettlementReport",
      component: lazy(
        () =>
          import("@app/pages/Creditcontrol/Invoice/InvoiceSettlementReport.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceCancelAfterSettelement",
      component: lazy(
        () =>
          import(
            "@app/pages/Creditcontrol/Invoice/InvoiceCancelAfterSettelement.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HeaderMaster",
      component: lazy(
        () =>
          import(
            "@app/pages/DischargeSummary/Master/DischargeSummaryMainMaster.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SetHeaderDeptWise",
      component: lazy(
        () =>
          import(
            "@app/pages/DischargeSummary/Master/DischargeSummarySetHeaderDept.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PatientSearchMRD",
      component: lazy(() => import("@app/pages/MRD/MRD/PatientSearchMRD.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FileSentToMRD",
      component: lazy(() => import("@app/pages/MRD/MRD/FileSendToMRD.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FileSendStatusReport",
      component: lazy(
        () => import("@app/pages/MRD/MRD/FileSendToMRDStatusReport.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MRDFileRequest",
      component: lazy(() => import("@app/pages/MRD/MRD/FileRequisition.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MRDRequestApproval",
      component: lazy(() => import("@app/pages/MRD/MRD/MRDFileApproval.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MRDFileIssue",
      component: lazy(
        () => import("@app/pages/MRD/MRD/MRDFileRequisitionIssue.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewIssuedFile",
      component: lazy(() => import("@app/pages/MRD/MRD/MRDIssuedFileView.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/mrd_master",
      component: lazy(() => import("@app/pages/MRD/MRDMaster/Master.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BedManagement",
      component: lazy(() => import("@app/pages/Billing/MIS/BedManagement.jsx")),
      exact: true,
    },

    // Emergency module start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/emergency-admission",
      component: lazy(
        () => import("@app/pages/emergency/EmergencyAdmission.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/emegency-registration-report",
      component: lazy(
        () => import("@app/pages/emergency/EmergencyRegisterReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/emergency-patient-search",
      component: lazy(
        () => import("@app/pages/emergency/EmergencyPatientSearch.jsx")
      ),
      exact: true,
    },
    // Emergency module End

    // Inventory module Start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DirectGRN",
      component: lazy(() => import("@app/pages/Inventory/GRN.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreateGRNByGateEntry",
      component: lazy(
        () => import("@app/pages/Inventory/CreateGRNByGateEntry.jsx")
      ),
      exact: true,
    },
    //Gate Entry  Akhilesh -->>>
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/gate-entry",
      component: lazy(() => import("@app/pages/Inventory/GateEntry.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/view-gate-entry",
      component: lazy(() => import("@app/pages/Inventory/ViewGateEntry.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DirectGRNSearch",
      component: lazy(() => import("@app/pages/Inventory/GRNSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/StockTake",
      component: lazy(() => import("@app/pages/Inventory/Tools/StockTake.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Physical_VerificationApproval",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/StockTakeApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RenewExpiryItem",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/RenewExpiryItem.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConsignmentReceive",
      component: lazy(
        () => import("@app/pages/Inventory/Consignment/ConsignmentReceive.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConsignmentSearch",
      component: lazy(
        () => import("@app/pages/Inventory/Consignment/ConsignmentSearch.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/StockTransfer",
      component: lazy(
        () => import("@app/pages/Inventory/Consignment/StockTransfer.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConsignmentReturn",
      component: lazy(
        () => import("@app/pages/Inventory/Consignment/ConsignmentReturn.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/nabh-manual",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/NABHManual.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/drug-formulary",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/Drugformulary.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/rgp-issue",
      component: lazy(
        () => import("@app/pages/Inventory/Tools/RGP/RGPissue.jsx")
      ),
      exact: true,
    },

    // Inventory module End

    // LAB start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/department-receive",
      component: lazy(
        () => import("@app/pages/DepartmentReceive/DepartmentReceive.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/samplesend-outsourcelab",
      component: lazy(
        () => import("@app/pages/DepartmentReceive/SampleSendOutsouceLab.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/result-entry",
      component: lazy(() => import("@app/pages/ResultEntry/ResultEntry.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/report-dispatch",
      component: lazy(
        () => import("@app/pages/ReportDispatch/ReportDispatch.jsx")
      ),
      exact: true,
    },

    // Lab Result Entry Culture

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/machineresultentry-culture",
      component: lazy(
        () =>
          import(
            "@app/pages/Processing/ResultEntryCulture/ResultEntryCulture.jsx"
          )
      ),
      exact: true,
    },

    // Lab Reporsts module start here
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/approved-unapprovedlog",
      component: lazy(
        () => import("@app/pages/Reports/ApprovedUnapprovedLog.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/samplestatus-report",
      component: lazy(
        () => import("@app/pages/Reports/SampleStatusReport.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/laboratory-countreport",
      component: lazy(
        () => import("@app/pages/Reports/LaboratoryCountReport.jsx")
      ),
      exact: true,
    },

    // lab worksheet
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/lab-worksheet",
      component: lazy(
        () => import("@app/pages/Processing/LabWorkSheet/LabWorkSheet.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/provitional-tat-report",
      component: lazy(
        () => import("@app/pages/Processing/TatReportSheet/TatReportSheet.jsx")
      ),
      exact: true,
    },

    //   MicroLabEntry
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/microlab-entry",
      component: lazy(
        () => import("@app/pages/Processing/MicroLabEntry/MicroLabEntry.jsx")
      ),
      exact: true,
    },

    //  LAB END

    // Radiology Start

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/radiology-acceptance",
      component: lazy(
        () => import("@app/pages/Radiology/Acceptance/RadiologyAcceptance.jsx")
      ),
      exact: true,
    },

    // PHarmecy STrat
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pharmacy-issue",
      component: lazy(() => import("@app/pages/pharmacy/PatientIssue")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ipd-patient-issue",
      component: lazy(() => import("@app/pages/pharmacy/IPDPatientIssue")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-return",
      component: lazy(() => import("@app/pages/pharmacy/Return/OpdReturn")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-return-item",
      component: lazy(
        () => import("@app/pages/pharmacy/Return/PatientMedicineReturn")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pharmacy-final-settlement-new",
      component: lazy(
        () => import("@app/pages/pharmacy/PharmacyFinalSettlementNew/index.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-fixed-pharmacy-bill",
      component: lazy(
        () => import("@app/pages/pharmacy/Tools/ManageMedicineFixBill")
      ),
      exact: true,
    },

    // /pharmacy-referdoctor-report
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pharmacy-referdoctor-report",
      component: lazy(
        () => import("@app/pages/Pharmacy/Report/ReferdoctorReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cashtocredit",
      component: lazy(
        () => import("@app/pages/pharmacy/Return/CashToCredit.jsx")
      ),

      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/change-patient-detail",
      component: lazy(
        () => import("@app/pages/Pharmacy/ChangePatient/ChangePatient.jsx")
      ),

      exact: true,
    },
    // ---------------Pharmecy Chnge payment mode-----------------------
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/change-payment-mode",
      component: lazy(
        () =>
          import("@app/pages/Pharmacy/ChangePaymentMode/ChangePaymentMode.jsx")
      ),

      exact: true,
    },

    // PHarmecy END

    // Purchase module start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/quotation-compare",
      component: lazy(
        () =>
          import(
            "@app/pages/Purchase/QuatationManagment/QuotationAndCompare.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/rgp",
      component: lazy(
        () => import("@app/pages/Purchase/NewItem/Department.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreatePurchaseRequest",
      component: lazy(
        () => import("@app/pages/Purchase/Store/CreatePurchaseRequest.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreatePurchaseOrder",
      component: lazy(
        () => import("@app/pages/Purchase/Order/CreatePurchaseOrder.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/searchpo",
      component: lazy(
        () => import("@app/pages/Purchase/Order/ViewPurchaseOrder.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/purchase-request-approval",
      component: lazy(
        () => import("@app/pages/Purchase/Approval/PurchaseRequestApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/purchase-order-approval",
      component: lazy(
        () =>
          import(
            "@app/pages/Purchase/Order/PurchaseOrderApproval/PurchaseOrderApproval.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SearchPurchaseRequest",
      component: lazy(
        () =>
          import(
            "@app/pages/Purchase/ViewPurchaseRequest/ViewPurchaseRequest.jsx"
          )
      ),
      exact: true,
    }, // Purchase module end
    // medical Store Start
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/TermsAndCondition",
    //   component: lazy(
    //     () => import("@app/pages/Inventory/Tool/ConsumeItem.jsx")
    //   ),
    //   exact: true,
    // },
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/TermsAndCondition",
    //   component: lazy(
    //     () => import("@app/pages/Inventory/Tools/TermsAndCondition.jsx")
    //   ),
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CentrewisePOApprovalMaster",
      component: lazy(
        () =>
          import("@app/pages/Purchase/Tools/ApprovalMaster/ApprovalMaster.jsx")
      ),
      exact: true,
    },
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/POAnalysis",
    //   component: lazy(
    //     () =>
    //       import(
    //         "@app/pages/Purchase/Tools/OrderAnalysis/OrderAnalysis.jsx"
    //       )
    //   ),
    //   exact: true,
    // },
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/PRAnalysis",
    //   component: lazy(
    //     () =>
    //       import(
    //         "@app/pages/Purchase/Tools/RequestAnalysis/RequestAnalysis.jsx"
    //       )
    //   ),
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PRSummurisedAnalysis",
      component: lazy(
        () =>
          import(
            "@app/pages/Purchase/Tools/PRSummurisedAnalysis/PRSummurisedAnalysis.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TermsAndCondition",
      component: lazy(
        () =>
          import(
            "@app/pages/Purchase/Tools/TermsAndCondition/TermsAndCondition.jsx"
          )
      ),
      exact: true,
    },
    // Purchase module end

    // Display Managemnet Routes Strt
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diagnosticwise-tokendisplay",
      component: lazy(
        () =>
          import("@app/pages/DisplayManagement/DiagnosticWiseTokenDisplay.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctorwise-tokendisplay",
      component: lazy(
        () => import("@app/pages/DisplayManagement/DoctorWiseTokenDisplay.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diagnosticwise-tokendisplay",
      component: lazy(
        () =>
          import("@app/pages/DisplayManagement/DiagnosticWiseTokenDisplay.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ipddisplay-floorWise",
      component: lazy(
        () => import("@app/pages/DisplayManagement/IPDDisplayFloorWise.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      // layout: Layout,
      path: "/screen-set",
      component: lazy(
        () => import("@app/pages/DisplayManagement/ScreenSet.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      // layout: Layout,
      path: "/patientdata-display",
      component: lazy(
        () => import("@app/pages/DisplayManagement/PatientDataDisplay.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      path: "/display-examinationtoken",
      component: lazy(
        () => import("@app/pages/DisplayManagement/DisplayExaminationToken.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      path: "/tokendisplay-screen",
      component: lazy(
        () =>
          import(
            "@app/pages/DisplayManagement/DiagnosticwiseTokenDisplayScreen.jsx"
          )
      ),
      exact: true,
    },

    // Display Managemnet Routes END

    // Finance Module Starts

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/voucher-booking",
      component: lazy(
        () => import("@app/pages/Finance/Voucher/VoucherBooking")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/session-master",
      component: lazy(() => import("@app/pages/Finance/Voucher/SessionMaster")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cheque-deposit",
      component: lazy(
        () => import("@app/pages/Finance/Voucher/ChequeDeposit.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cheque-bounce",
      component: lazy(
        () => import("@app/pages/Finance/Voucher/ChequeBounce.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/coast-center-access",
      component: lazy(
        () => import("@app/pages/Finance/Approval/CostCenterAccess.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bank-reconciliation-verify",
      component: lazy(
        () => import("@app/pages/Finance/Approval/BankReconsilationVerify.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/vouchermapping-master",
      component: lazy(
        () =>
          import("@app/pages/Finance/Approval/UserWiseVoucher/VoucherLimit.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cost-center-access",
      component: lazy(
        () => import("@app/pages/Finance/Approval/CostCenterAccess.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/mapadvance-purchase",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Voucher/SupplierAdvanceMapping/SupplierAdvance.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/financial-year-periodclosing",
      component: lazy(
        () =>
          import("@app/pages/Finance/Account/PeriodClosing/PeriodClosing.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/financialyear-bookclosing",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Account/FinancialYearBook/FinancialYearBook.jsx"
          )
      ),
      exact: true,
    },
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/voucher-audit",
    //   component: lazy(
    //     () => import("@app/pages/Finance/Accounts/VoucherAudit.jsx")
    //   ),
    //   exact: true,
    // },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/financialyear-closing",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/FinancialYearClosing/FinancialYearClosing.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/consumeaccount-mapping",
      component: lazy(
        () => import("@app/pages/Finance/Master/Consumption/Consumption.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/chart-of-group",
      component: lazy(
        () => import("@app/pages/Finance/Master/ChartOfGroup/index.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/chart-of-account",
      component: lazy(
        () => import("@app/pages/Finance/Master/ChartOfAccount/index.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/entity-master",
      component: lazy(
        () => import("@app/pages/Finance/Master/EntityMaster/EntityMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/currency-master",
      component: lazy(
        () =>
          import("@app/pages/Finance/Master/CurrencyMaster/CurrencyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/currency-master",
      component: lazy(
        () =>
          import("@app/pages/Finance/Master/CurrencyMaster/CurrencyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cost-centre-mapping",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Master/CostCentreMapping/CostCentreMapping.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/centrewise-coa-mapping",
      component: lazy(
        () =>
          import("@app/pages/Finance/Master/CenterWiseCOA/CenterWiseCOA.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/vouchertype-master",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Master/VoucherTypeMaster/Vouchermaster.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bank-reconcile",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Tools/BankReconciliation/BankReconciliation.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/voucherposting-batch",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Approval/VoucherPostingBatch/VoucherBatch.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bank-charges-upload",
      component: lazy(
        () =>
          import("@app/pages/Finance/Tools/BankCharges/BankChargesUpload.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opening-balance-upload",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Tools/OpeningBalance/UploadOpeningBalance.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/openingbalance-upload-invoicewise",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Tools/UploadOpeningBalanceInvoice/UploadBalanceInvoice.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/balancetransfer",
      component: lazy(
        () =>
          import("@app/pages/Finance/Tools/BalanceTransfer/BalanceTransfer.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/voucherposting-batch",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/Approval/VoucherPostingBatch/VoucherBatch.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/voucher-audit",
      component: lazy(
        () => import("@app/pages/Finance/Approval/Audit/Audit.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Account-books",
      component: lazy(
        () => import("@app/pages/Finance/Books/AccountBooks.jsx")
      ),
      exact: true,
    },

    // petty cash start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/preetycash-accessmaster",
      component: lazy(
        () => import("@app/pages/Finance/PettyCash/PettyCashAccessMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pettycash-deptrequest",
      component: lazy(
        () => import("@app/pages/Finance/PettyCash/PettyCashDeptRequest.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pettycash-deptapproval",
      component: lazy(
        () => import("@app/pages/Finance/PettyCash/PettyCashDeptApproval.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pettycashdept-approvalverification",
      component: lazy(
        () =>
          import(
            "@app/pages/Finance/PettyCash/PettyCashDeptApprovalVerification.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pettycashdept-confirmation",
      component: lazy(
        () =>
          import("@app/pages/Finance/PettyCash/PettyCashDeptConfirmation.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pettycash-posting",
      component: lazy(
        () => import("@app/pages/Finance/PettyCash/PettyCashPosting.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/pettycash-entry",
      component: lazy(
        () => import("@app/pages/Finance/PettyCash/PettyCashEntry.jsx")
      ),
      exact: true,
    },

    // petty cash End

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/finace-reports",
      component: lazy(() => import("@app/pages/Finance/Reports")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/trial-balance-report",
      component: lazy(
        () => import("@app/pages/Finance/Reports/TrialBalanceReport.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/receivable-statement-report",
      component: lazy(
        () => import("@app/pages/Finance/Reports/ReceivableStatement.jsx")
      ),
      exact: true,
    },

    // Finance Module End

    // MIS STart

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/mis-dashboard",
      component: lazy(() => import("@app/pages/MIS/Dashboard.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/revenue-analysis-dashboard",
      component: lazy(
        () => import("@app/pages/MIS/RevenueAnalisysDashboard.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/chartofgroup-new",
      component: lazy(
        () => import("@app/pages/Finance/Reports/ChartOfGroupReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/general-ledger-report",
      component: lazy(
        () => import("@app/pages/Finance/Reports/GeneralLedger.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/payable-ledger-report",
      component: lazy(
        () => import("@app/pages/Finance/Reports/PayableLedgerReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/receivable-ledger-report",

      component: lazy(
        () => import("@app/pages/Finance/Reports/ReceivableLedger.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/purchase-bill-due-report",

      component: lazy(
        () => import("@app/pages/Finance/Reports/PurchaseBillDueReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/payable-statement-report",

      component: lazy(
        () => import("@app/pages/Finance/Reports/PayableStatementReport.jsx")
      ),
      exact: true,
    },
    ,
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bankreconciliation-report",

      component: lazy(
        () => import("@app/pages/Finance/Reports/BankReconciliationReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/payable-aging-summary",

      component: lazy(
        () => import("@app/pages/Finance/Reports/PayableAgingSummary.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/account-receible-aging-details",

      component: lazy(
        () =>
          import("@app/pages/Finance/Reports/AccountReceibleAgingDetails.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/account-receible-agingsummary",

      component: lazy(
        () => import("@app/pages/Finance/Reports/ReceivableAgeing.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/payable-bankwise-report",

      component: lazy(
        () => import("@app/pages/Finance/Reports/PayableBankWise.jsx")
      ),

      exact: true,
    },

    // MIS End

    // EDP STart
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-center-management",
      component: lazy(() => import("@app/pages/EDP/CentreManagement")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-map-store-item",
      component: lazy(
        () =>
          import("@app/pages/EDP/CentreManagement/CentreWiseItemMapping.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp_item_master",
      component: lazy(
        () => import("@app/pages/EDP/ItemManagment/ItemMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/rate-schedule-charges",
      component: lazy(
        () => import("@app/pages/EDP/RateManagement/RateScheduleCharges.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/display-name-master",
      component: lazy(
        () => import("@app/pages/EDP/DisplayMaster/DisplayNameMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/set-item-rate",
      component: lazy(
        () =>
          import("@app/pages/EDP/RateManagement/SetItemRate/SetItemRate.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/rate-list",
      component: lazy(
        () => import("@app/pages/EDP/RateManagement/CopyRates.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/category-master",
      component: lazy(
        () => import("@app/pages/EDP/ItemManagment/CategoryMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/subcategory-master",
      component: lazy(
        () => import("@app/pages/EDP/ItemManagment/SubCategoryMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp_employee_master",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/EmployeeManagment/EmployeeMaster/EmployeeMaster.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/add-interpretation",
      component: lazy(
        () =>
          import("@app/pages/EDP/LaboratoryManagement/AddInterpretation.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/observation-type",
      component: lazy(
        () => import("@app/pages/EDP/LaboratoryManagement/ObservationType.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/formula-master",
      component: lazy(
        () => import("@app/pages/EDP/LaboratoryManagement/FormulaMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/lab-observationhelp",
      component: lazy(
        () =>
          import("@app/pages/EDP/LaboratoryManagement/LabobservationHelp.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/surgery-rates",
      component: lazy(
        () =>
          import("@app/pages/EDP/RateManagement/Surgery/SurgeryRateList.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/investigation-sequence",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/LaboratoryManagement/InvestigationSequence.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/mapinvestigation-observationnew",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/LaboratoryManagement/MapInvestigationObservationNew.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/inv-template",
      component: lazy(
        () => import("@app/pages/EDP/LaboratoryManagement/InvTemplate.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/active-deactive-employee",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/EmployeeManagment/ActiveDeactivateEmployee/ActivateDeactivate.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/surgery-grouping",
      component: lazy(
        () =>
          import("@app/pages/EDP/SurgeryManagement/SurgeryGroupingMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/lab-comment-master",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/LaboratoryManagement/LabObservationComments.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/new-surgery-type",
      component: lazy(
        () => import("@app/pages/EDP/SurgeryManagement/NewSurgeryType.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/manage-approval-rights",
      component: lazy(
        () => import("@app/pages/EDP/LaboratoryManagement/ManageApproval.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/manage-deliverydays",
      component: lazy(
        () =>
          import("@app/pages/EDP/LaboratoryManagement/ManageDeliveryDays.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/manageis-nabl",
      component: lazy(
        () => import("@app/pages/EDP/LaboratoryManagement/ManageisNabl.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/outsourcelab-master",
      component: lazy(
        () =>
          import("@app/pages/EDP/LaboratoryManagement/OutsourceLabMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-common-masterform",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/EmployeeManagment/CommonMasterForm/CommonMasterForm.jsx"
          )
      ),
      exact: true,
    },

    // Karan Start

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/samplecontainer-master",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/LaboratoryManagement/SampleContainerMaster.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/sample-type-master",
      component: lazy(
        () => import("@app/pages/EDP/LaboratoryManagement/SampleTypeMaster.jsx")
      ),
      exact: true,
    },

    // Doctor Management Start here
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctor-reg",
      component: lazy(
        () => import("@app/pages/EDP/DoctorManagement/DoctorReg.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/viewdoctor-detail",
      component: lazy(
        () => import("@app/pages/EDP/DoctorManagement/ViewDoctorDetail.jsx")
      ),
      exact: true,
    },
    // Samplecontainer-master

    {
      // Guard: Authenticated,
      path: "/report-viewer",
      component: lazy(() => import("../modules/ChatAI/ReportViewer.jsx")),
      exact: true,
    },
    {
      // Guard: Authenticated,
      path: "/report-chat-ai",
      component: lazy(() => import("../modules/ChatAI/ReportChatAI.jsx")),
      exact: true,
    },
    // Donor  Process Start here

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/donor-registration",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/DonorRegistration.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-collection",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/BloodCollection.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-blood-indent-approval",
      component: lazy(
        () =>
          import("@app/pages/BloodBank/PatientBloodRequireIndentApproval.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/grouping",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/Grouping.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/grouping-approval",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/GroupingApproval.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-screening",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/BloodScreening.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ttd-approval",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/TTDApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/component-creation",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/ComponentCreation.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/poststock",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/PostStock.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/discard-blood-stock",
      component: lazy(
        () => import("@app/pages/BloodBank/DonorProcess/DiscardBloodStock.jsx")
      ),
      exact: true,
    },

    // Karan End

    // Govind Start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-location-master",
      component: lazy(() => import("@app/pages/EDP/Master/LocationMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-add-master",
      component: lazy(() => import("@app/pages/EDP/Master/AddMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-managment-role",
      component: lazy(
        () => import("@app/pages/EDP/RoleManagment/RoleManagerPrivledge.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ipd-pkg-master",
      component: lazy(
        () => import("@app/pages/EDP/PackageManagment/IPDpkgMasterMain.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/opd-pkg-master",
      component: lazy(
        () => import("@app/pages/EDP/PackageManagment/OPDpkgMasterMain.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-sms-reports",
      component: lazy(() => import("@app/pages/EDP/SMS/SmsReport.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-sms-employee",
      component: lazy(() => import("@app/pages/EDP/SMS/SmsEmployee.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-sms-template-master",
      component: lazy(() => import("@app/pages/EDP/SMS/SMSTemplateMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-sms-master",
      component: lazy(() => import("@app/pages/EDP/SMS/SmsMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-sms-doctor",
      component: lazy(() => import("@app/pages/EDP/SMS/SmsDoctor.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-approval-type-master",
      component: lazy(
        () => import("@app/pages/EDP/BasicMaster/DiscountApprovalMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-discount-referal-master",
      component: lazy(
        () => import("@app/pages/EDP/BasicMaster/DiscountRefundMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-pro-master",
      component: lazy(() => import("@app/pages/EDP/BasicMaster/ProMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-welcome-msg",
      component: lazy(
        () => import("@app/pages/EDP/BasicMaster/WelcomeMessage.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-minimum-threshold-limit",
      component: lazy(
        () => import("@app/pages/EDP/BasicMaster/ThresholdMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-ipd-bill-centre",
      component: lazy(
        () => import("@app/pages/EDP/Utilities/IPDBillCentre.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-payment-mode-edit",
      component: lazy(
        () =>
          import("@app/pages/EDP/Utilities/SettingManagment/PaymentModeEdit")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-admin-disc-date-edit",
      component: lazy(
        () =>
          import("@app/pages/EDP/Utilities/SettingManagment/AdmitDiscDateEdit")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-discharge-process-setting",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/Utilities/SettingManagment/DischargeProcessSetting"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-manage-email-body-master",
      component: lazy(
        () => import("@app/pages/EDP/Email/ManageEmailBodyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-email-template-master",
      component: lazy(
        () => import("@app/pages/EDP/Email/EmailTemplateMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ot-master",
      component: lazy(() => import("@app/pages/OT/Master/OTMaster.jsx")),
      exact: true,
    },
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/edp-doctor-department-master",
    //   component: lazy(
    //     () =>
    //       import("@app/pages/EDP/DoctorManagement/DoctorDepartmentMaster.jsx")
    //   ),
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-refer-doctor-master",
      component: lazy(
        () => import("@app/pages/EDP/DoctorManagement/ReferDoctorMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-discharge-approval-master",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/EmployeeManagment/DischargeSummaryRight/DischargeSummaryRight.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-manager-approval",
      component: lazy(
        () =>
          import(
            "@app/pages/EDP/EmployeeManagment/ManageApproval/ManagerApproval.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/edp-ipd-bill-generation",
      component: lazy(
        () => import("@app/pages/EDP/EmployeeManagment/IPDbillGeneration.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/view-bb-stock",
      component: lazy(
        () => import("@app/pages/BloodBank/BBStock/ViewBBstock.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bloodbank-question-master",
      component: lazy(
        () => import("@app/pages/BloodBank/Master/QuestionMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-blood-collection",
      component: lazy(
        () =>
          import(
            "@app/pages/BloodBank/PatientProcess/PatientBloodCollection.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-blood-grouping",
      component: lazy(
        () =>
          import("@app/pages/BloodBank/PatientProcess/PatientBloodGrouping.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-grouping-approval",
      component: lazy(
        () => import("@app/pages/BloodBank/PatientProcess/GroupingApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-blood-screening",
      component: lazy(
        () =>
          import(
            "@app/pages/BloodBank/PatientProcess/PatientBloodScreening.jsx"
          )
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-bank-issue-report",
      component: lazy(
        () => import("@app/pages/BloodBank/Reports/BloodBankIssueReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-blood-request",
      component: lazy(
        () => import("@app/pages/BloodBank/PatientProcess/BloodRequest.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-blood-return",
      component: lazy(
        () => import("@app/pages/BloodBank/PatientProcess/BloodReturn.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/hold-blood-issue",
      component: lazy(
        () => import("@app/pages/BloodBank/PatientProcess/HoldBloodIssue.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bb-report",
      component: lazy(
        () => import("@app/pages/BloodBank/Reports/BBreport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/revenue-report",
      component: lazy(() => import("@app/pages/MIS/RevenueDashboard.jsx")),
      exact: true,
    },

    // Govind  End

    // Mayank Start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/panel-document-master",
      component: lazy(
        () => import("@app/pages/EDP/panelManagement/PanelDocumentMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/panel-master",
      component: lazy(
        () => import("@app/pages/EDP/panelManagement/PanelMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/admit-disch-cancel",
      component: lazy(
        () => import("@app/pages/EDP/Utilities/AdmitDischCancel.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/cpoe-menu-ordering",
      component: lazy(
        () => import("@app/pages/EDP/MenuSetup/CPOEMenuOrdering.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-map-item-component",
      component: lazy(
        () => import("@app/pages/EDP/Master/BloodBag/MapItemWithComponent.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-component-mapping",
      component: lazy(
        () => import("@app/pages/EDP/Master/BloodBag/BloodComponmentMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-bag-mapping",
      component: lazy(
        () => import("@app/pages/EDP/Master/BloodBag/BloodBagMapping.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-bag-type-master",
      component: lazy(
        () => import("@app/pages/EDP/Master/BloodBag/BloodBagTypeMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-group-compatibility",
      component: lazy(
        () =>
          import("@app/pages/EDP/Master/BloodBag/BloodGroupCompatibilty.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/blood-organisation-master",
      component: lazy(
        () => import("@app/pages/EDP/Master/BloodBag/OrganisationMaster.jsx")
      ),
      exact: true,
    },

    // Mayank End

    // Pragya STart

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/surgery-master",
      component: lazy(
        () => import("@app/pages/EDP/SurgeryManagement/SurgeryMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bank-master",
      component: lazy(
        () => import("@app/pages/EDP/BasicMaster/BankMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/country-master",
      component: lazy(
        () => import("@app/pages/EDP/BasicMaster/CountryMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/room-master",
      component: lazy(
        () => import("@app/pages/EDP/RoomManagement/RoomMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/component-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/ComponentMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-type-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/DietTypeMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/component-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/ComponentMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-type-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/DietTypeMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/question-master",
      component: lazy(
        () => import("@app/pages/EDP/QuestionMaster/QuestionSave.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/sub-type-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/SubDietTypeMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-timing-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/DietTimingMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-menu-master",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/DietMenuMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/map-dietype-compo",
      component: lazy(
        () => import("@app/pages/EDP/DietMaster/MapDietTypeCompo.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/issue-patient-diet",
      component: lazy(() => import("@app/pages/Diet/IssuePatientDiet.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-request-report",
      component: lazy(
        () => import("@app/pages/Diet/Reports/DietRequestReport.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/as-on-diet-report",
      component: lazy(() => import("@app/pages/Diet/Reports/AsOnReport.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-issue-report",
      component: lazy(
        () => import("@app/pages/Diet/Reports/DietIssueReport.jsx")
      ),
      exact: true,
    },

    // aakash start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-schedular",
      component: lazy(() => import("@app/pages/Diet/DietSchedular.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/diet-patient-information",
      component: lazy(
        () => import("@app/pages/Diet/IPD/PatientInformationDiet.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-diet-indent-approval",
      component: lazy(
        () => import("@app/pages/Diet/IPD/PatientDietIndentApproval.jsx")
      ),
      exact: true,
    },

    ///  AAkash End
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-diet-request",
      component: lazy(
        () =>
          import("@app/pages/Diet/PatientDietRequest/PatientDietRequest.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/direct-blood-bank",
      component: lazy(
        () => import("@app/pages/BloodBank/BBStock/DirectBloodStock.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patient-cross-match",
      component: lazy(
        () =>
          import("@app/pages/BloodBank/PatientProcess/PatientCrossMatch.jsx")
      ),
      exact: true,
    },
    // Pragya End

    // EDP End

    // anand
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/rgp",
      component: lazy(
        () => import("@app/pages/Purchase/NewItem/Department.jsx")
      ),
      exact: true,
    },

    // OT Start

    // Mayank Start
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ot-patient-search",
      component: lazy(() => import("@app/pages/OT/OTPatientSearch")),
      exact: true,
    },
    // Mayank End

    // Karan Start

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ot-booking",
      component: lazy(
        () => import("@app/pages/OT/OTPatientSearch/OTBooking.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/card-master",
      component: lazy(
        () => import("@app/pages/EDP/MemberShipCard/CardMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/membership-card-discount",
      component: lazy(
        () => import("@app/pages/EDP/MemberShipCard/MembershipCardDiscount.jsx")
      ),
      exact: true,
    },

    // Karan End

    // OT End

    // Mortuary Start

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/receive-Corpse",
      component: lazy(
        () => import("@app/pages/Mortuary/Mortuary/ReceiveCorpse.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/corpse-deposite",
      component: lazy(
        () => import("@app/pages/Mortuary/Mortuary/CorpseDeposite.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/search-received-corpse",
      component: lazy(
        () => import("@app/pages/Mortuary/Mortuary/SearchReceivedCorpse.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/search-corpse",
      component: lazy(
        () => import("@app/pages/Mortuary/Mortuary/SearchCorpse.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/advance-settelment",
      component: lazy(
        () => import("@app/pages/Mortuary/Mortuary/AdvanceSettelment.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/create-freezer",
      component: lazy(
        () => import("@app/pages/Mortuary/Mortuary/CreateFreezer.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctors-added-medicine",
      component: lazy(
        () => import("@app/pages/Reports/DrWiseAddMedReports.jsx")
      ),
      exact: true,
    },

    // Mortuary End
  ],
};
