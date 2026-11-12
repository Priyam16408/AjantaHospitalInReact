import "./ReportViewer.css";
import logo from "../../assets/image/logo.png";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import makeApiRequest from "../../networkServices/axiosInstance";
import { RedirectURL } from "../../networkServices/PDFURL";
const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;

const ReportViewer = () => {

  const location = useLocation();
  let id = location?.hash?.split("#")[1];

  const getApiURL = async (url, payload) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "Post",
        data: payload,
      };
      const data = await makeApiRequest(url, options);
      if (data?.success) {
        RedirectURL(data?.data);
        id = `${baseurl}/${data?.data}`
      }
    } catch (error) {
      console.error("Error Add Expense", error);
    } finally {
      store.dispatch(setLoading(false));
    }


  }

  useEffect(() => {
    if (location?.hash?.split("#")?.length === 4) {
      const ids = location?.hash?.split("#")[2];
      getApiURL(id, { testID: ids })

    }

  }, [])



  // const id =
  //   "https://cdn1.lalpathlabs.com/live/reports/WM17S.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = id;
    link.download = "medical-report.pdf";
    link.click();
  };

  return (
    <div className="report-container">
      <div className="report-card">
        {/* Header Section */}
        <div className="header-section">
          <div className="icon-badge">
            <img className="stethoscope-icon" src={logo} />
          </div>
          <h1 className="main-title">IT DOSE INFOSYSTEM</h1>
          <p className="subtitle">Access and download your Medical Report</p>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          {/* Download Button */}
          <button onClick={handleDownload} className="download-button">
            <div className="button-content">
              {/* <Download className="download-icon" /> */}
              <i className="fa fa-download"></i>
              <span className="button-text">Download Report</span>
            </div>
            <div className="button-overlay"></div>
          </button>

          {/* View Button */}
          <a
            href={`/report-chat-ai?pdfUrl=${encodeURIComponent(id ? id : "")}`}
            className="view-link"
          >
            <div className="view-button">
              <div className="button-content">
                {/* <FileText className="file-icon" /> */}
                <i className="fa fa-file"></i>
                <span className="button-text">View AI Report</span>
              </div>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <p className="security-text">
            Your medical information is secure and confidential
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;













// import "./ReportViewer.css";
// import logo from "../../assets/image/logo.png";
// import { useLocation, useParams, useSearchParams } from "react-router-dom";
// import { useEffect } from "react";
// import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
// import store from "../../store/store";
// import makeApiRequest from "../../networkServices/axiosInstance";
// import { RedirectURL } from "../../networkServices/PDFURL";

// const ReportViewer = () => {

//   const location = useLocation();
//   let id = location?.hash?.split("#")[1];
//   console.log("location?.hash", location)
//   const getApiURL = async (url, payload) => {
//     store.dispatch(setLoading(true));
//     debugger
//     try {
//       const options = {
//         method: "Post",
//         data: payload,
//       };
//       const data = await makeApiRequest(url, options);
//       if (data?.success) {
//         // RedirectURL(data?.data);
//       }
//     } catch (error) {
//       console.error("Error Add Expense", error);
//     } finally {
//       store.dispatch(setLoading(false));
//     }


//   }

//   useEffect(() => {
//     const ids = location?.hash?.split("#")[2];
//     if (ids?.length > 0) {
//       const parts = id.split('/');
//       const lastTwo = parts.slice(-2).join('/');
//       getApiURL(lastTwo, { testID: ids })
//     }
//   }, [])


//   // const id =
//   //   "https://cdn1.lalpathlabs.com/live/reports/WM17S.pdf";

//   const handleDownload = () => {
//     const link = document.createElement("a");
//     link.href = id;
//     link.download = "medical-report.pdf";
//     link.click();
//   };

//   return (
//     <div className="report-container">
//       <div className="report-card">
//         {/* Header Section */}
//         <div className="header-section">
//           <div className="icon-badge">
//             <img className="stethoscope-icon" src={logo} />
//           </div>
//           <h1 className="main-title">IT DOSE INFOSYSTEM</h1>
//           <p className="subtitle">Access and download your Medical Report</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="button-container">
//           {/* Download Button */}
//           <button onClick={handleDownload} className="download-button">
//             <div className="button-content">
//               {/* <Download className="download-icon" /> */}
//               <i className="fa fa-download"></i>
//               <span className="button-text">Download Report</span>
//             </div>
//             <div className="button-overlay"></div>
//           </button>

//           {/* View Button */}
//           <a
//             href={`/report-chat-ai?pdfUrl=${encodeURIComponent(id ? id : "")}`}
//             className="view-link"
//           >
//             <div className="view-button">
//               <div className="button-content">
//                 {/* <FileText className="file-icon" /> */}
//                 <i className="fa fa-file"></i>
//                 <span className="button-text">View AI Report</span>
//               </div>
//             </div>
//           </a>
//         </div>

//         {/* Footer */}
//         <div className="footer-section">
//           <p className="security-text">
//             Your medical information is secure and confidential
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportViewer;
