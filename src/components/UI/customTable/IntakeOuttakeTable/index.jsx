import React from "react";
import { Table } from "react-bootstrap";

const Index = ({ THEAD, Tbody, footer, dataTitle }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div id="no-more-tables">
      <Table className="mainTable" responsive bordered hover>
        {Object?.keys(THEAD)?.map((Thead, inx) => {
          return (
            <thead>
              <tr>
                {THEAD[Thead]?.map((th, index) => (
                  <th
                    colSpan={th?.colSpan}
                    key={index}
                    className={th?.className ?? ""}
                  >
                    {th?.name}
                  </th>
                ))}
              </tr>
            </thead>
          );
        })}

        <tbody style={{ height: "50%" }}>
          {Tbody?.map((items, keys) => (
            <tr key={keys}>
              {Object.keys(items)?.map((data, index) => (
                <td
                  key={index}
                  data-title={
                    THEAD[dataTitle][index]?.name
                      ? THEAD[dataTitle][index]?.name
                      : THEAD[dataTitle][index]
                  }
                >
                  {items[data]}
                  {isMobile && <>&nbsp;</>}
                </td>
              ))}
            </tr>
          ))}

          {footer &&
            footer?.map((th, index) => (
              <th
                colSpan={th?.colSpan}
                key={index}
                className={th?.className ?? ""}
              >
                {th?.name}
              </th>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Index;
