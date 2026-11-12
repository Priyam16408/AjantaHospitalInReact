import React from "react";

const NewsDataDashboard = ({ data }) => {
  console.log(data);

  const handleDownload = (item) => {
    // Create a temporary link element

    const link = document.createElement("a");

    // Set the href to the base64 data
    link.href = item?.Attachment;

    // Set the download attribute to the desired file name
    link.download = item.Subject.substring(0, 8);

    // Programmatically click the link to trigger the download
    link.click();
  };
  return (
    <div>
      <div className="head d-flex align-items-center justify-content-between">
        <div>Subject : {data?.Subject}</div>
        {Boolean(data?.IsCapture) && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleDownload(data)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="blue"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        )}
      </div>
      <div
        className="body-news"
        dangerouslySetInnerHTML={{ __html: data?.Description }}
      ></div>
    </div>
  );
};

export default NewsDataDashboard;
