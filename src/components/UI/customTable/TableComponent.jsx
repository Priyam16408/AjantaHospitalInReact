

function TableComponent({ thead, tbody, fs }) {
  return (
    <>
      <div className="row m-2">
        <div
          className="col-12 divResult table-responsive mt-4"
          id="no-more-table"
        >
          <table
            className="table table-bordered table-hover table-striped tbRecord"
            cellPadding="{0}"
            cellSpacing="{0}"
          >
            <thead className="cf">
              <tr className="table-theme-bg">
                {thead?.map((headData, index) => (
                  <th key={index} style={{ fontSize: fs && "12px" }}>
                    {headData} &nbsp;
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbody?.map((ele, index) => {
                const keys = Object.keys(ele);
                return (
                  <tr key={index}>
                    {keys.map((bodyData, inx) => (
                      <td key={inx} data-title={thead[inx]}>
                        {ele[bodyData]} &nbsp;
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TableComponent;
