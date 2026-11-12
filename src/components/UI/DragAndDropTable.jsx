import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Table } from "react-bootstrap";

const DragAndDropTable = ({ thead, tbody, handleOnDragEnd, uniqueID }) => {
  const isMobile = window.innerWidth <= 768;


  return (
    tbody?.length > 0 && (
      <div
        id="no-more-tables"
        // style={style}
        className={`custom-scrollbar TabScroll`}
      >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Table className="mainTable pt-2 pl-2 pr-2" bordered>
            <thead style={{ zIndex: 1 }}>
              <tr>
                {thead.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <Droppable droppableId="droppable">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {tbody.map((item, index) => {
                    const row = Object.keys(item)?.filter(
                      (key, _) => key !== uniqueID
                    );
                    return (
                      <Draggable
                        key={item?.Sno}
                        draggableId={item?.Sno?.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            //   style={{ backgroundColor: rowColor }}
                          >
                            {row?.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                data-title={
                                  thead[cellIndex]?.name
                                    ? thead[cellIndex]?.name
                                    : thead[cellIndex]
                                }
                                // style={{width:WWW}}
                              >
                                {item[cell]?.label
                                  ? item[cell]?.label
                                  : item[cell]}
                                {isMobile && <>&nbsp;</>}
                              </td>
                            ))}
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>
    )
  );
};

export default DragAndDropTable;
