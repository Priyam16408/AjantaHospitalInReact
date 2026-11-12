// // // import React, { useState } from 'react';
// // // import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// // // const PrintSetting = () => {
// // //   const [items, setItems] = useState([
// // //     { id: 'item-1', content: 'Allergy' },
// // //     { id: 'item-2', content: 'Headache' },
// // //     { id: 'item-3', content: 'Fever' },
// // //     { id: 'item-4', content: 'Cough' },
// // //   ]);

// // //   const [droppedItems, setDroppedItems] = useState([]);

// // //   // Helper function to reorder the list
// // //   const reorder = (list, startIndex, endIndex) => {
// // //     const result = Array.from(list);
// // //     const [removed] = result.splice(startIndex, 1);
// // //     result.splice(endIndex, 0, removed);
// // //     return result;
// // //   };

// // //   const onDragEnd = (result) => {
// // //     const { source, destination } = result;

// // //     // If dropped outside the list
// // //     if (!destination) return;

// // //     // Moving within the same list
// // //     if (source.droppableId === destination.droppableId) {
// // //       if (source.droppableId === 'droppable1') {
// // //         const reorderedItems = reorder(items, source.index, destination.index);
// // //         setItems(reorderedItems);
// // //       } else {
// // //         const reorderedDroppedItems = reorder(droppedItems, source.index, destination.index);
// // //         setDroppedItems(reorderedDroppedItems);
// // //       }
// // //       return;
// // //     }

// // //     // Moving between different lists
// // //     if (source.droppableId === 'droppable1' && destination.droppableId === 'droppable2') {
// // //       const newItems = Array.from(items);
// // //       const [movedItem] = newItems.splice(source.index, 1);
// // //       setItems(newItems);
// // //       setDroppedItems((prevItems) => [...prevItems, movedItem]);
// // //     } else if (source.droppableId === 'droppable2' && destination.droppableId === 'droppable1') {
// // //       const newDroppedItems = Array.from(droppedItems);
// // //       const [movedItem] = newDroppedItems.splice(source.index, 1);
// // //       setDroppedItems(newDroppedItems);
// // //       setItems((prevItems) => [...prevItems, movedItem]);
// // //     }
// // //   };

// // //   return (
// // //     <DragDropContext onDragEnd={onDragEnd}>
// // //       <div className='mainPrintDesign'>
// // //         <div className="row">
// // //           <div className='col-2'>
// // //             <Droppable droppableId="droppable1">
// // //               {(provided) => (
// // //                 <div
// // //                   ref={provided.innerRef}
// // //                   {...provided.droppableProps}
// // //                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}
// // //                 >
// // //                   <ul>
// // //                     {items.map((item, index) => (
// // //                       <Draggable key={item.id} draggableId={item.id} index={index}>
// // //                         {(provided) => (
// // //                           <li
// // //                             ref={provided.innerRef}
// // //                             {...provided.draggableProps}
// // //                             {...provided.dragHandleProps}
// // //                             style={{
// // //                               padding: '8px',
// // //                               margin: '4px',
// // //                               border: '1px solid #ccc',
// // //                               borderRadius: '4px',
// // //                               backgroundColor: '#fff',
// // //                               ...provided.draggableProps.style,
// // //                             }}
// // //                           >
// // //                             {item.content}
// // //                           </li>
// // //                         )}
// // //                       </Draggable>
// // //                     ))}
// // //                     {provided.placeholder}
// // //                   </ul>
// // //                 </div>
// // //               )}
// // //             </Droppable>
// // //           </div>

// // //           <div className="col-1">
// // //             <div className='vl'  />
// // //           </div>

// // //           <div className='col-9'>
// // //             <Droppable droppableId="droppable2">
// // //               {(provided) => (
// // //                 <div
// // //                   ref={provided.innerRef}
// // //                   {...provided.droppableProps}
// // //                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}
// // //                 >
// // //                   <table>
// // //                     <thead>
// // //                       <tr>
// // //                         <th>Item</th>
// // //                         <th>Action</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {droppedItems.map((item, index) => (
// // //                         <Draggable key={item.id} draggableId={item.id} index={index}>
// // //                           {(provided) => (
// // //                             <tr
// // //                               ref={provided.innerRef}
// // //                               {...provided.draggableProps}
// // //                               {...provided.dragHandleProps}
// // //                               style={{
// // //                                 padding: '8px',
// // //                                 margin: '4px',
// // //                                 border: '1px solid #ccc',
// // //                                 backgroundColor: '#f9f9f9',
// // //                                 ...provided.draggableProps.style,
// // //                               }}
// // //                             >
// // //                               <td>{item.content}</td>
// // //                               <td>
// // //                                 <input type="text" placeholder="Add Name" />
// // //                               </td>
// // //                             </tr>
// // //                           )}
// // //                         </Draggable>
// // //                       ))}
// // //                       {provided.placeholder}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               )}
// // //             </Droppable>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </DragDropContext>
// // //   );
// // // };

// // // export default PrintSetting;

// // import React, { useState } from 'react';
// // import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// // const PrintSetting = () => {
// //   const [items, setItems] = useState([
// //     { id: 'item-1', content: 'Allergy' },
// //     { id: 'item-2', content: 'Headache' },
// //     { id: 'item-3', content: 'Fever' },
// //     {
// //       id: 'item-4', content: 'Medicine', allmed: [
// //         { name: "Paracetamol", value: "500mg" },
// //         { name: "Ibuprofen", value: "200mg" },
// //       ]
// //     },
// //   ]);

// //   const [droppedItems, setDroppedItems] = useState([]);

// //   // Helper function to reorder the list
// //   const reorder = (list, startIndex, endIndex) => {
// //     const result = Array.from(list);
// //     const [removed] = result.splice(startIndex, 1);
// //     result.splice(endIndex, 0, removed);
// //     return result;
// //   };

// //   const onDragEnd = (result) => {
// //     const { source, destination } = result;

// //     // If dropped outside the list
// //     if (!destination) return;

// //     // Moving within the same list
// //     if (source.droppableId === destination.droppableId) {
// //       if (source.droppableId === 'droppable1') {
// //         const reorderedItems = reorder(items, source.index, destination.index);
// //         setItems(reorderedItems);
// //       } else {
// //         const reorderedDroppedItems = reorder(droppedItems, source.index, destination.index);
// //         setDroppedItems(reorderedDroppedItems);
// //       }
// //       return;
// //     }

// //     // Moving between different lists
// //     if (source.droppableId === 'droppable1' && destination.droppableId === 'droppable2') {
// //       const newItems = Array.from(items);
// //       const [movedItem] = newItems.splice(source.index, 1);
// //       setItems(newItems);
// //       setDroppedItems((prevItems) => [...prevItems, movedItem]);
// //     } else if (source.droppableId === 'droppable2' && destination.droppableId === 'droppable1') {
// //       const newDroppedItems = Array.from(droppedItems);
// //       const [movedItem] = newDroppedItems.splice(source.index, 1);
// //       setDroppedItems(newDroppedItems);
// //       setItems((prevItems) => [...prevItems, movedItem]);
// //     }
// //   };

// //   return (
// //     <DragDropContext onDragEnd={onDragEnd}>
// //       <div className='mainPrintDesign'>
// //         <div className="row">
// //           <div className='col-2'>
// //             <Droppable droppableId="droppable1">
// //               {(provided) => (
// //                 <div
// //                   ref={provided.innerRef}
// //                   {...provided.droppableProps}
// //                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}
// //                 >
// //                   <ul>
// //                     {items.map((item, index) => (
// //                       <Draggable key={item.id} draggableId={item.id} index={index}>
// //                         {(provided) => (
// //                           <li
// //                             ref={provided.innerRef}
// //                             {...provided.draggableProps}
// //                             {...provided.dragHandleProps}
// //                             style={{
// //                               padding: '8px',
// //                               margin: '4px',
// //                               border: '1px solid #ccc',
// //                               borderRadius: '4px',
// //                               backgroundColor: '#fff',
// //                               ...provided.draggableProps.style,
// //                             }}
// //                           >
// //                             {item.content}
// //                           </li>
// //                         )}
// //                       </Draggable>
// //                     ))}
// //                     {provided.placeholder}
// //                   </ul>
// //                 </div>
// //               )}
// //             </Droppable>
// //           </div>

// //           <div className="col-1">
// //             <div className='vl' />
// //           </div>

// //           <div className='col-9'>
// //             <Droppable droppableId="droppable2">
// //               {(provided) => (
// //                 <div
// //                   ref={provided.innerRef}
// //                   {...provided.droppableProps}
// //                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}
// //                 >
// //                   <table>
// //                     <thead>
// //                       <tr>
// //                         <th>Item</th>
// //                         <th>Details</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {droppedItems.map((item, index) => (
// //                         <Draggable key={item.id} draggableId={item.id} index={index}>
// //                           {(provided) => (
// //                             <tr
// //                               ref={provided.innerRef}
// //                               {...provided.draggableProps}
// //                               {...provided.dragHandleProps}
// //                               style={{
// //                                 padding: '8px',
// //                                 margin: '4px',
// //                                 border: '1px solid #ccc',
// //                                 backgroundColor: '#f9f9f9',
// //                                 ...provided.draggableProps.style,
// //                               }}
// //                             >
// //                               <td>{item.content}</td>
// //                               <td>
// //                                 {item.allmed ? (
// //                                   <ul>
// //                                     {item.allmed.map((med, medIndex) => (
// //                                       <li key={medIndex}>
// //                                         {med.name} - {med.value}
// //                                       </li>
// //                                     ))}
// //                                   </ul>
// //                                 ) : (
// //                                   <input type="text" placeholder="Add Name" />
// //                                 )}
// //                               </td>
// //                             </tr>
// //                           )}
// //                         </Draggable>
// //                       ))}
// //                       {provided.placeholder}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               )}
// //             </Droppable>
// //           </div>
// //         </div>
// //       </div>
// //     </DragDropContext>
// //   );
// // };

// // export default PrintSetting;

// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const PrintSetting = () => {
//   const [items, setItems] = useState([
//     { id: 'item-1', content: 'Allergy' },
//     { id: 'item-2', content: 'Headache' },
//     { id: 'item-3', content: 'Fever' },
//     {
//       id: 'item-4', content: 'Medicine', allmed: [
//         { name: "Paracetamol", value: "500mg" },
//         { name: "Ibuprofen", value: "200mg" },
//       ]
//     },
//   ]);

//   const [droppedItems, setDroppedItems] = useState([]);

//   // Helper function to reorder the list
//   const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;

//     // If dropped outside the list
//     if (!destination) return;

//     // Moving within the same list
//     if (source.droppableId === destination.droppableId) {
//       if (source.droppableId === 'droppable1') {
//         const reorderedItems = reorder(items, source.index, destination.index);
//         setItems(reorderedItems);
//       } else {
//         const reorderedDroppedItems = reorder(droppedItems, source.index, destination.index);
//         setDroppedItems(reorderedDroppedItems);
//       }
//       return;
//     }

//     // Moving between different lists
//     if (source.droppableId === 'droppable1' && destination.droppableId === 'droppable2') {
//       const newItems = Array.from(items);
//       const [movedItem] = newItems.splice(source.index, 1);
//       setItems(newItems);
//       setDroppedItems((prevItems) => [...prevItems, movedItem]);
//     } else if (source.droppableId === 'droppable2' && destination.droppableId === 'droppable1') {
//       const newDroppedItems = Array.from(droppedItems);
//       const [movedItem] = newDroppedItems.splice(source.index, 1);
//       setDroppedItems(newDroppedItems);
//       setItems((prevItems) => [...prevItems, movedItem]);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className='mainPrintDesign'>
//         <div className="row">
//           <div className='col-2'>
//             <Droppable droppableId="droppable1">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}
//                 >
//                   <ul>
//                     {items.map((item, index) => (
//                       <Draggable key={item.id} draggableId={item.id} index={index}>
//                         {(provided) => (
//                           <li
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               padding: '8px',
//                               margin: '4px',
//                               border: '1px solid #ccc',
//                               borderRadius: '4px',
//                               backgroundColor: '#fff',
//                               ...provided.draggableProps.style,
//                             }}
//                           >
//                             {item.content}
//                           </li>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </ul>
//                 </div>
//               )}
//             </Droppable>
//           </div>

//           <div className="col-1">
//             <div className='vl' />
//           </div>

//           <div className='col-9 w-100'>
//             <Droppable droppableId="droppable2">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}
//                 >
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Item</th>
//                         <th>Details</th>
//                         <th>Medicine Name</th>
//                         <th>Dosage</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {droppedItems.map((item, index) => (
//                         <Draggable key={item.id} draggableId={item.id} index={index}>
//                           {(provided) => (
//                             <>
//                               {/* Display the main item content */}
//                               <tr
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 style={{
//                                   padding: '8px',
//                                   margin: '4px',
//                                   border: '1px solid #ccc',
//                                   backgroundColor: '#f9f9f9',
//                                   ...provided.draggableProps.style,
//                                 }}
//                               >
//                                 <td>{item.content}</td>
//                                 <td>
//                                   {item.allmed ? (
//                                     'Contains Medicines'
//                                   ) : (
//                                     <input type="text" placeholder="Add Name" />
//                                   )}
//                                 </td>
//                                 <td colSpan="2">
//                                   {/* Empty to maintain table structure */}
//                                 </td>
//                               </tr>
//                               {/* If the item contains medicines, render them in separate rows */}
//                               {item.allmed &&
//                                 item.allmed.map((med, medIndex) => (
//                                   <tr key={medIndex}>
//                                     <td colSpan="2" />
//                                     <td>{med.name}</td>
//                                     <td>{med.value}</td>
//                                   </tr>
//                                 ))}
//                             </>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </Droppable>
//           </div>
//         </div>
//       </div>
//     </DragDropContext>
//   );
// };

// export default PrintSetting;

// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const PrintSetting = () => {
//   const [items, setItems] = useState([
//     { id: 'item-1', content: 'Allergy' },
//     { id: 'item-2', content: 'Headache' },
//     { id: 'item-3', content: 'Fever' },
//     {
//       id: 'item-4', content: 'Medicine', allmed: [
//         { name: "Paracetamol", value: "500mg" },
//         { name: "Ibuprofen", value: "200mg" },
//       ]
//     },
//   ]);

//   const [droppedItems, setDroppedItems] = useState([]);

//   const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     if (source.droppableId === destination.droppableId) {
//       if (source.droppableId === 'droppable1') {
//         const reorderedItems = reorder(items, source.index, destination.index);
//         setItems(reorderedItems);
//       } else {
//         const reorderedDroppedItems = reorder(droppedItems, source.index, destination.index);
//         setDroppedItems(reorderedDroppedItems);
//       }
//       return;
//     }

//     if (source.droppableId === 'droppable1' && destination.droppableId === 'droppable2') {
//       const newItems = Array.from(items);
//       const [movedItem] = newItems.splice(source.index, 1);
//       setItems(newItems);
//       setDroppedItems((prevItems) => [...prevItems, movedItem]);
//     } else if (source.droppableId === 'droppable2' && destination.droppableId === 'droppable1') {
//       const newDroppedItems = Array.from(droppedItems);
//       const [movedItem] = newDroppedItems.splice(source.index, 1);
//       setDroppedItems(newDroppedItems);
//       setItems((prevItems) => [...prevItems, movedItem]);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className='mainPrintDesign'>
//         <div className="row">
//           <div className='col-2'>
//             <Droppable droppableId="droppable1">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px', borderRadius:"10px" }}
//                 >
//                   <ul className='p-0'>
//                     {items.map((item, index) => (
//                       <Draggable key={item.id} draggableId={item.id} index={index}>
//                         {(provided) => (
//                           <li
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               padding: '8px',
//                               margin: '4px',
//                               border: '1px solid #ccc',
//                               borderRadius: '4px',
//                               backgroundColor: '#fff',
//                               listStyle:"none",
//                               ...provided.draggableProps.style,
//                             }}
//                           >
//                             {item.content}
//                           </li>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </ul>
//                 </div>
//               )}
//             </Droppable>
//           </div>

//           <div className="col-1">
//             <div className='vl' />
//           </div>

//           <div className='col-9 '>
//             {/* First Box */}
//             <div className="row">
//             <div className='col-3 w-100'>
//             {/* First Box */}
//             <div className="box" style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
//               <h5>Box 1</h5>
//               {/* <Droppable droppableId="droppable2">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: '150px', padding: '10px' }}
//                   >
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>Item</th>
//                           <th>Details</th>
//                           <th>Medicine Name</th>
//                           <th>Dosage</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {droppedItems.map((item, index) => (
//                           <Draggable key={item.id} draggableId={item.id} index={index}>
//                             {(provided) => (
//                               <>
//                                 <tr
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   style={{
//                                     padding: '8px',
//                                     margin: '4px',
//                                     border: '1px solid #ccc',
//                                     backgroundColor: '#f9f9f9',
//                                     ...provided.draggableProps.style,
//                                   }}
//                                 >
//                                   <td>{item.content}</td>
//                                   <td>
//                                     {item.allmed ? 'Contains Medicines' : <input type="text" placeholder="Add Name" />}
//                                   </td>
//                                   <td colSpan="2" />
//                                 </tr>
//                                 {item.allmed && item.allmed.map((med, medIndex) => (
//                                   <tr key={medIndex}>
//                                     <td colSpan="2" />
//                                     <td>{med.name}</td>
//                                     <td>{med.value}</td>
//                                   </tr>
//                                 ))}
//                               </>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </Droppable> */}
//             </div>
//           </div>
//           <div className='col-3 w-100'>
//             {/* First Box */}
//             <div className="box" style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
//               <h5>Box 2</h5>

//             </div>
//           </div>
//           <div className='col-3 w-100'>
//             {/* First Box */}
//             <div className="box" style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
//               <h5>Box 3</h5>

//             </div>
//           </div>
//           <div className='col-3 w-100'>
//             {/* First Box */}
//             <div className="box" style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
//               <h5>Box 4</h5>

//             </div>
//           </div>
//             </div>
//             <div className="box" style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
//               <h5>Main Box Added Medicine</h5>

//             </div>

//           </div>

//         </div>

//       </div>
//     </DragDropContext>
//   );
// };

// export default PrintSetting;

// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const PrintSetting = () => {
//   const [items, setItems] = useState([
//     { id: 'item-1', content: 'Allergy' },
//     { id: 'item-2', content: 'Headache' },
//     { id: 'item-3', content: 'Fever' },
//     {
//       id: 'item-4', content: 'Medicine', allmed: [
//         { name: "Paracetamol", value: "500mg" },
//         { name: "Ibuprofen", value: "200mg" },
//       ]
//     },
//   ]);

//   const [droppedItems, setDroppedItems] = useState([]);

//   const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     if (source.droppableId === destination.droppableId) {
//       if (source.droppableId === 'droppable1') {
//         const reorderedItems = reorder(items, source.index, destination.index);
//         setItems(reorderedItems);
//       } else {
//         const reorderedDroppedItems = reorder(droppedItems, source.index, destination.index);
//         setDroppedItems(reorderedDroppedItems);
//       }
//       return;
//     }

//     if (source.droppableId === 'droppable1' && destination.droppableId === 'droppable2') {
//       const newItems = Array.from(items);
//       const [movedItem] = newItems.splice(source.index, 1);
//       setItems(newItems);
//       setDroppedItems((prevItems) => [...prevItems, movedItem]);
//     } else if (source.droppableId === 'droppable2' && destination.droppableId === 'droppable1') {
//       const newDroppedItems = Array.from(droppedItems);
//       const [movedItem] = newDroppedItems.splice(source.index, 1);
//       setDroppedItems(newDroppedItems);
//       setItems((prevItems) => [...prevItems, movedItem]);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className='mainPrintDesign'>
//         <div className="row">
//           <div className='col-2'>
//             <Droppable droppableId="droppable1">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   style={{ border: '1px solid black', minHeight: '200px', padding: '10px', borderRadius:"10px" }}
//                 >
//                   <ul className='p-0'>
//                     {items.map((item, index) => (
//                       <Draggable key={item.id} draggableId={item.id} index={index}>
//                         {(provided) => (
//                           <li
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               padding: '8px',
//                               margin: '4px',
//                               border: '1px solid #ccc',
//                               borderRadius: '4px',
//                               backgroundColor: '#fff',
//                               listStyle:"none",
//                               ...provided.draggableProps.style,
//                             }}
//                           >
//                             {item.content}
//                           </li>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </ul>
//                 </div>
//               )}
//             </Droppable>
//           </div>

//           <div className="col-1">
//             <div className='vl' />
//           </div>

//           <div className='col-9 '>
//             {/* Dynamic Boxes */}
//             <div className="row" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//               {Array.from({ length: 4 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className='box'
//                   style={{
//                     border: '1px solid black',
//                     marginBottom: '10px',
//                     padding: '10px',
//                     flex: droppedItems.length > 0 ? `1 1 ${100 / droppedItems.length}%` : '1 1 22%',
//                     maxWidth: '48%',
//                     minHeight: '100px',
//                     transition: 'flex 0.3s ease',
//                   }}
//                 >
//                   <h5>{`Box ${idx + 1}`}</h5>

//                   <Droppable droppableId="droppable2">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: '150px', padding: '10px' }}
//                   >
//                     <ul className='p-0'>
//                       {droppedItems.map((item, index) => (
//                         <Draggable key={item.id} draggableId={item.id} index={index}>
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 padding: '8px',
//                                 margin: '4px',
//                                 border: '1px solid #ccc',
//                                 borderRadius: '4px',
//                                 backgroundColor: '#f9f9f9',
//                                 listStyle: 'none',
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {item.content}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   </div>
//                 )}
//               </Droppable>
//                 </div>
//               ))}
//             </div>

//             <div className="box" style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
//               <h5>Main Box Added Medicine</h5>
//               {/* Dropped items in the main box */}
//               <Droppable droppableId="droppable2">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: '150px', padding: '10px' }}
//                   >
//                     <ul className='p-0'>
//                       {droppedItems.map((item, index) => (
//                         <Draggable key={item.id} draggableId={item.id} index={index}>
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 padding: '8px',
//                                 margin: '4px',
//                                 border: '1px solid #ccc',
//                                 borderRadius: '4px',
//                                 backgroundColor: '#f9f9f9',
//                                 listStyle: 'none',
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {item.content}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DragDropContext>
//   );
// };

// export default PrintSetting;

// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const PrintSetting = () => {
//   const [items, setItems] = useState([
//     { id: "item-1", content: "Allergy" },
//     { id: "item-2", content: "Headache" },
//     { id: "item-3", content: "Fever" },
//     {
//       id: "item-4",
//       content: "Medicine",
//       allmed: [
//         { name: "Paracetamol", value: "500mg" },
//         { name: "Ibuprofen", value: "200mg" },
//       ],
//     },
//     { id: "item-5", content: "Cold" },
//     { id: "item-6", content: "Cough" },
//     { id: "item-7", content: "Flu" },
//   ]);

//   // Each box's items will be stored in their respective state.
//   const [boxItems, setBoxItems] = useState({
//     box1: [],
//     box2: [],
//     box3: [],
//     box4: [],
//     box5: [],
//     box6: [],
//     box7: [],
//     box8: [],
//   });

//   // Reordering logic for the items in the same list
//   const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   // Handle drag end logic
//   const onDragEnd = (result) => {
//     const { source, destination } = result;

//     // If no destination, do nothing
//     if (!destination) return;

//     // Source and destination same (just reorder)
//     if (source.droppableId === destination.droppableId) {
//       if (source.droppableId === "droppable1") {
//         const reorderedItems = reorder(items, source.index, destination.index);
//         setItems(reorderedItems);
//       } else {
//         const reorderedBoxItems = reorder(
//           boxItems[source.droppableId],
//           source.index,
//           destination.index
//         );
//         setBoxItems({
//           ...boxItems,
//           [source.droppableId]: reorderedBoxItems,
//         });
//       }
//       return;
//     }

//     // Moving item from source to destination list
//     if (source.droppableId === "droppable1") {
//       // Remove from "items" list and add to the destination box
//       const newItems = Array.from(items);
//       const [movedItem] = newItems.splice(source.index, 1);
//       setItems(newItems);
//       setBoxItems({
//         ...boxItems,
//         [destination.droppableId]: [
//           ...boxItems[destination.droppableId],
//           movedItem,
//         ],
//       });
//     } else if (destination.droppableId === "droppable1") {
//       // Remove from box and add to the "items" list
//       const newBoxItems = Array.from(boxItems[source.droppableId]);
//       const [movedItem] = newBoxItems.splice(source.index, 1);
//       setBoxItems({
//         ...boxItems,
//         [source.droppableId]: newBoxItems,
//       });
//       setItems([...items, movedItem]);
//     } else {
//       // Moving between two boxes
//       const newSourceBoxItems = Array.from(boxItems[source.droppableId]);
//       const [movedItem] = newSourceBoxItems.splice(source.index, 1);
//       const newDestinationBoxItems = [
//         ...boxItems[destination.droppableId],
//         movedItem,
//       ];

//       setBoxItems({
//         ...boxItems,
//         [source.droppableId]: newSourceBoxItems,
//         [destination.droppableId]: newDestinationBoxItems,
//       });
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className="mainPrintDesign">
//         <div className="row">
//           <div className="col-2">
//             <Droppable droppableId="droppable1">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   style={{
//                     border: "1px solid black",
//                     minHeight: "200px",
//                     padding: "10px",
//                     borderRadius: "10px",
//                   }}
//                 >
//                   <ul className="p-0">
//                     {items.map((item, index) => (
//                       <Draggable
//                         key={item.id}
//                         draggableId={item.id}
//                         index={index}
//                       >
//                         {(provided) => (
//                           <li
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               padding: "8px",
//                               margin: "4px",
//                               border: "1px solid #ccc",
//                               borderRadius: "4px",
//                               backgroundColor: "#fff",
//                               listStyle: "none",
//                               ...provided.draggableProps.style,
//                             }}
//                           >
//                             {item.content}
//                           </li>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </ul>
//                 </div>
//               )}
//             </Droppable>
//           </div>

//           <div className="col-1">
//             <div className="vl" />
//           </div>

//           <div className="col-9">
//             <div
//               className="row"
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap:"20px"
//               }}
//             >
//               {["box1", "box2", "box3", "box4","box5","box6","box7","box8"].map((boxId, idx) => (
//                 <div
//                   key={idx}
//                   className="box"
//                   style={{
//                     border: "1px solid black",
//                     marginBottom: "10px",
//                     padding: "10px",
//                     flex: "1 1 22%",
//                     maxWidth: "48%",
//                     minHeight: "100px",
//                   }}
//                 >
//                   <h5>{`Box ${idx + 1}`}</h5>
//                   <Droppable droppableId={boxId}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         style={{ minHeight: "150px", padding: "10px" }}
//                       >
//                         <ul className="p-0">
//                           {boxItems[boxId].map((item, index) => (
//                             <Draggable
//                               key={item.id}
//                               draggableId={item.id}
//                               index={index}
//                             >
//                               {(provided) => (
//                                 <li
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   style={{
//                                     padding: "8px",
//                                     margin: "4px",
//                                     border: "1px solid #ccc",
//                                     borderRadius: "4px",
//                                     backgroundColor: "#f9f9f9",
//                                     listStyle: "none",
//                                     ...provided.draggableProps.style,
//                                   }}
//                                 >
//                                   {item.content}
//                                 </li>
//                               )}
//                             </Draggable>
//                           ))}
//                           {provided.placeholder}
//                         </ul>
//                       </div>
//                     )}
//                   </Droppable>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </DragDropContext>
//   );
// };

// export default PrintSetting;

// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const PrintSetting = () => {
//   const [items, setItems] = useState([
//     { id: "item-1", content: "Allergy" },
//     { id: "item-2", content: "Headache" },
//     { id: "item-3", content: "Fever" },
//     {
//       id: "item-4",
//       content: "Medicine",
//       allmed: [
//         { name: "Paracetamol", value: "500mg" },
//         { name: "Ibuprofen", value: "200mg" },
//       ],
//     },
//     { id: "item-5", content: "Cold" },
//     { id: "item-6", content: "Cough" },
//     { id: "item-7", content: "Flu" },
//   ]);

//   const [boxItems, setBoxItems] = useState({
//     box1: [],
//     box2: [],
//     box3: [],
//     box4: [],
//     box5: [],
//     box6: [],
//     box7: [],
//     box8: [],
//     fullBox: [], // State for the new full-width box
//   });

//   const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     if (source.droppableId === destination.droppableId) {
//       if (source.droppableId === "droppable1") {
//         const reorderedItems = reorder(items, source.index, destination.index);
//         setItems(reorderedItems);
//       } else {
//         const reorderedBoxItems = reorder(
//           boxItems[source.droppableId],
//           source.index,
//           destination.index
//         );
//         setBoxItems({
//           ...boxItems,
//           [source.droppableId]: reorderedBoxItems,
//         });
//       }
//       return;
//     }

//     if (source.droppableId === "droppable1") {
//       const newItems = Array.from(items);
//       const [movedItem] = newItems.splice(source.index, 1);
//       setItems(newItems);
//       setBoxItems({
//         ...boxItems,
//         [destination.droppableId]: [
//           ...boxItems[destination.droppableId],
//           movedItem,
//         ],
//       });
//     } else if (destination.droppableId === "droppable1") {
//       const newBoxItems = Array.from(boxItems[source.droppableId]);
//       const [movedItem] = newBoxItems.splice(source.index, 1);
//       setBoxItems({
//         ...boxItems,
//         [source.droppableId]: newBoxItems,
//       });
//       setItems([...items, movedItem]);
//     } else {
//       const newSourceBoxItems = Array.from(boxItems[source.droppableId]);
//       const [movedItem] = newSourceBoxItems.splice(source.index, 1);
//       const newDestinationBoxItems = [
//         ...boxItems[destination.droppableId],
//         movedItem,
//       ];

//       setBoxItems({
//         ...boxItems,
//         [source.droppableId]: newSourceBoxItems,
//         [destination.droppableId]: newDestinationBoxItems,
//       });
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className="mainPrintDesign">
//         <div className="row">
//           <div className="col-2">
//             <Droppable droppableId="droppable1">
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   style={{
//                     border: "1px solid black",
//                     minHeight: "200px",
//                     padding: "10px",
//                     borderRadius: "10px",
//                   }}
//                 >
//                   <ul className="p-0">
//                     {items.map((item, index) => (
//                       <Draggable
//                         key={item.id}
//                         draggableId={item.id}
//                         index={index}
//                       >
//                         {(provided) => (
//                           <li
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               padding: "8px",
//                               margin: "4px",
//                               border: "1px solid #ccc",
//                               borderRadius: "4px",
//                               backgroundColor: "#fff",
//                               listStyle: "none",
//                               ...provided.draggableProps.style,
//                             }}
//                           >
//                             {item.content}
//                           </li>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </ul>
//                 </div>
//               )}
//             </Droppable>
//           </div>

//           <div className="col-1">
//             <div className="vl" />
//           </div>

//           <div className="col-9">
//             <div
//               className="row"
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap:"20px"
//               }}
//             >
//               {["box1", "box2", "box3", "box4", "box5", "box6", "box7", "box8"].map((boxId, idx) => (
//                 <div
//                   key={idx}
//                   className="box"
//                   style={{
//                     border: "1px solid black",
//                     marginBottom: "10px",
//                     padding: "10px",
//                     flex: "1 1 22%",
//                     maxWidth: "48%",
//                     minHeight: "100px",
//                     marginLeft:"10px"
//                   }}
//                 >
//                   <h5>{`Box ${idx + 1}`}</h5>
//                   <Droppable droppableId={boxId}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         style={{ minHeight: "150px", padding: "10px" }}
//                       >
//                         <ul className="p-0">
//                           {boxItems[boxId].map((item, index) => (
//                             <Draggable
//                               key={item.id}
//                               draggableId={item.id}
//                               index={index}
//                             >
//                               {(provided) => (
//                                 <li
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   style={{
//                                     padding: "8px",
//                                     margin: "4px",
//                                     border: "1px solid #ccc",
//                                     borderRadius: "4px",
//                                     backgroundColor: "#f9f9f9",
//                                     listStyle: "none",
//                                     ...provided.draggableProps.style,
//                                   }}
//                                 >
//                                   {item.content}
//                                 </li>
//                               )}
//                             </Draggable>
//                           ))}
//                           {provided.placeholder}
//                         </ul>
//                       </div>
//                     )}
//                   </Droppable>
//                 </div>
//               ))}
//             </div>

//             {/* Full-width Box */}
//             <div
//               className="full-width-box"
//               style={{
//                 border: "1px solid black",
//                 padding: "10px",
//                 marginTop: "20px",
//                 minHeight: "150px",
//                 width: "100%",
//                 borderRadius:"10px"
//               }}
//             >
//               <h5>Full Width Box</h5>
//               <Droppable droppableId="fullBox">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: "100px", padding: "10px" }}
//                   >
//                     <ul className="p-0">
//                       {boxItems["fullBox"].map((item, index) => (
//                         <Draggable
//                           key={item.id}
//                           draggableId={item.id}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 padding: "8px",
//                                 margin: "4px",
//                                 border: "1px solid #ccc",
//                                 borderRadius: "4px",
//                                 backgroundColor: "#f9f9f9",
//                                 listStyle: "none",
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {item.content}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//             <div className="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12">
//                 <button
//                   className="btn btn-sm custom-button w-100 mt-3"
//                   // onClick={handleClearForm}
//                   type="button"
//                 >
//                   Print Out
//                 </button>
//               </div>
//           </div>
//         </div>
//       </div>
//     </DragDropContext>
//   );
// };

// export default PrintSetting;

// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import LabeledInput from "../../../components/formComponent/LabeledInput";
// import DemoGraphicDetailCard from "./DemoGraphicDetailCard";

// const PrintSetting = ({ getDoctorID, patientDetail }) => {
//   const [items, setItems] = useState([
//     { id: "item-1", content: "Allergy" },
//     { id: "item-2", content: "Headache" },
//     { id: "item-3", content: "Fever" },
//     {
//       id: "item-4",
//       content: "Medicine",
//       allmed: [
//         {
//           name: "Valparin 200ml SYP",
//           dose: "1",
//           time: "2",
//           duration: "continue",
//           meal: "das",
//           route: "oral",
//         },
//         {
//           name: "Eptoin 100 MG TAB",
//           dose: "1",
//           time: "3",
//           duration: "continue",
//           meal: "",
//           route: "oral",
//         },
//         {
//           name: "Dexona INJ  2 ML",
//           dose: "4mg",
//           time: "12brly",
//           duration: "15 DAYS",
//           meal: "",
//           route: "",
//         },
//         {
//           name: "Gelusil MPS 400ml",
//           dose: "3 tsf",
//           time: "3 TIMES",
//           duration: "15 DAYS",
//           meal: "",
//           route: "oral",
//         },
//         {
//           name: "Softovac  SF  100 GM",
//           dose: "3tsf",
//           time: "bed time",
//           duration: "15 DAYS",
//           meal: "",
//           route: "",
//         },
//       ],
//     },
//     { id: "item-5", content: "Cold" },
//     { id: "item-6", content: "Cough" },
//     { id: "item-7", content: "Flu" },
//     { id: "item-8", content: "Chief Complaint" },
//     { id: "item-9", content: "Doctor Advice" },
//     { id: "item-10", content: "Investigation Lab & Radio" },
//     { id: "item-11", content: "Past History" },
//     { id: "item-12", content: "Prescribed Medicine" },
//     { id: "item-13", content: "Provisional Diagnosis" },
//     { id: "item-14", content: "Transfer & Refer" },
//   ]);

//   const [boxItems, setBoxItems] = useState({
//     box1: [],
//     box2: [],
//     box3: [],
//     box4: [],
//     box5: [],
//     box6: [],
//     box7: [],
//     box8: [],
//     fullBox: [], // State for the new full-width box
//   });

//   const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     if (source.droppableId === destination.droppableId) {
//       if (source.droppableId === "droppable1") {
//         const reorderedItems = reorder(items, source.index, destination.index);
//         setItems(reorderedItems);
//       } else {
//         const reorderedBoxItems = reorder(
//           boxItems[source.droppableId],
//           source.index,
//           destination.index
//         );
//         setBoxItems({
//           ...boxItems,
//           [source.droppableId]: reorderedBoxItems,
//         });
//       }
//       return;
//     }

//     if (source.droppableId === "droppable1") {
//       const newItems = Array.from(items);
//       const [movedItem] = newItems.splice(source.index, 1);
//       setItems(newItems);
//       setBoxItems({
//         ...boxItems,
//         [destination.droppableId]: [
//           ...boxItems[destination.droppableId],
//           movedItem,
//         ],
//       });
//     } else if (destination.droppableId === "droppable1") {
//       const newBoxItems = Array.from(boxItems[source.droppableId]);
//       const [movedItem] = newBoxItems.splice(source.index, 1);
//       setBoxItems({
//         ...boxItems,
//         [source.droppableId]: newBoxItems,
//       });
//       setItems([...items, movedItem]);
//     } else {
//       const newSourceBoxItems = Array.from(boxItems[source.droppableId]);
//       const [movedItem] = newSourceBoxItems.splice(source.index, 1);
//       const newDestinationBoxItems = [
//         ...boxItems[destination.droppableId],
//         movedItem,
//       ];

//       setBoxItems({
//         ...boxItems,
//         [source.droppableId]: newSourceBoxItems,
//         [destination.droppableId]: newDestinationBoxItems,
//       });
//     }
//   };

//   const details = [
//     { label: "Name", value: patientDetail?.Pname },
//     { label: "Patient ID", value: patientDetail?.PatientID },
//     { label: "Age", value: patientDetail?.Age },
//     { label: "Gender", value: patientDetail?.Sex },
//     { label: "Mobile No.", value: patientDetail?.ContactNo },
//     { label: "App. Date/No.", value: patientDetail?.AppointmentDate },
//     { label: "Ref.By", value: patientDetail?.DName },
//   ];

//   console.log(details);

//   return (
//     <>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="mainPrintDesign ">
//           <div className="row">
//             <div className="col-2">
//               <Droppable droppableId="droppable1">
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{
//                       border: "1px solid black",
//                       minHeight: "200px",
//                       padding: "10px",
//                       borderRadius: "10px",
//                     }}
//                   >
//                     <ul className="p-0">
//                       {items.map((item, index) => (
//                         <Draggable
//                           key={item.id}
//                           draggableId={item.id}
//                           index={index}
//                         >
//                           {(provided) => {
//                             return (
//                               <>
//                                 <li
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   style={{
//                                     padding: "8px",
//                                     margin: "4px",
//                                     border: "1px solid #ccc",
//                                     borderRadius: "4px",
//                                     backgroundColor: "#fff",
//                                     listStyle: "none",
//                                     ...provided.draggableProps.style,
//                                   }}
//                                 >
//                                   {item.content}
//                                 </li>
//                               </>
//                             );
//                           }}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}

//                       <li
//                         style={{
//                           padding: "8px",
//                           margin: "4px",
//                           border: "1px solid #ccc",
//                           borderRadius: "4px",
//                           backgroundColor: "#fff",
//                           listStyle: "none",
//                         }}
//                       >
//                         <div className="col-xl-12 col-md-4 col-sm-4 col-sm-4 col-12">
//                           <button
//                             className="btn btn-sm custom-button w-100"
//                             // onClick={handleClearForm}
//                             type="button"
//                           >
//                             Print
//                           </button>
//                         </div>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </Droppable>
//             </div>

//             <div className="col-1">
//               <div className="vl" />
//             </div>

//             <div className="col-9 mb-3">
//               <div
//                 className="row"
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   gap: "20px",
//                 }}
//               >

//                 <DemoGraphicDetailCard  patientDetail={patientDetail}/>

//                 {[
//                   "box1",
//                   "box2",
//                   "box3",
//                   "box4",
//                   "box5",
//                   "box6",
//                   "box7",
//                   "box8",
//                 ].map((boxId, idx) => {
//                   return(
//                     <>
//                       <div className="col-3">
//                       <div
//                     key={idx}
//                     className="box"
//                     style={{
//                       border: "1px solid black",
//                       marginBottom: "10px",
//                       padding: "10px",
//                       flex: "1 1 22%",
//                       maxWidth: "48%",
//                       minHeight: "100px",
//                       marginLeft: "10px",
//                     }}
//                   >
//                     <h5>{`Box ${idx + 1}`}</h5>
//                     <Droppable droppableId={boxId}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                           style={{ minHeight: "150px", padding: "10px" }}
//                         >
//                           <ul className="p-0">
//                             {boxItems[boxId].map((item, index) => (
//                               <Draggable
//                                 key={item.id}
//                                 draggableId={item.id}
//                                 index={index}
//                               >
//                                 {(provided) => (
//                                   <li
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                     style={{
//                                       padding: "8px",
//                                       margin: "4px",
//                                       border: "1px solid #ccc",
//                                       borderRadius: "4px",
//                                       backgroundColor: "#f9f9f9",
//                                       listStyle: "none",
//                                       ...provided.draggableProps.style,
//                                     }}
//                                   >
//                                     {item.content}
//                                   </li>
//                                 )}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                           </ul>
//                         </div>
//                       )}
//                     </Droppable>
//                   </div>
//                       </div>
//                     </>
//                   )
//                 })}
//               </div>

//               {/* Full-width Box */}
//               <div
//                 className="full-width-box"
//                 style={{
//                   border: "1px solid black",
//                   padding: "10px",
//                   marginTop: "20px",
//                   minHeight: "150px",
//                   width: "100%",
//                   borderRadius: "10px",
//                 }}
//               >
//                 <h5>Full Width Box</h5>
//                 <Droppable droppableId="fullBox">
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       style={{ minHeight: "100px", padding: "10px" }}
//                     >
//                       <ul className="p-0">
//                         {boxItems["fullBox"].map((item, index) => (
//                           <Draggable
//                             key={item.id}
//                             draggableId={item.id}
//                             index={index}
//                           >
//                             {(provided) => (
//                               <li
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 style={{
//                                   padding: "8px",
//                                   margin: "4px",
//                                   border: "1px solid #ccc",
//                                   borderRadius: "4px",
//                                   backgroundColor: "#f9f9f9",
//                                   listStyle: "none",
//                                   ...provided.draggableProps.style,
//                                 }}
//                               >
//                                 {item.content}
//                                 {/* <input type="text" value={item.content} name="" id="" /> */}
//                                 {/* Render table if the item is 'Medicine' */}
//                                 {item.content === "Medicine" && item.allmed && (
//                                   <table
//                                     style={{
//                                       marginTop: "10px",
//                                       width: "100%",
//                                       border: "1px solid #ccc",
//                                     }}
//                                   >
//                                     <thead>
//                                       <tr>
//                                         <th
//                                           style={{
//                                             border: "1px solid #ccc",
//                                             padding: "5px",
//                                           }}
//                                         >
//                                           Name
//                                         </th>
//                                         <th
//                                           style={{
//                                             border: "1px solid #ccc",
//                                             padding: "5px",
//                                           }}
//                                         >
//                                           Dosage
//                                         </th>
//                                         <th
//                                           style={{
//                                             border: "1px solid #ccc",
//                                             padding: "5px",
//                                           }}
//                                         >
//                                           Time
//                                         </th>
//                                         <th
//                                           style={{
//                                             border: "1px solid #ccc",
//                                             padding: "5px",
//                                           }}
//                                         >
//                                           Meal
//                                         </th>
//                                         <th
//                                           style={{
//                                             border: "1px solid #ccc",
//                                             padding: "5px",
//                                           }}
//                                         >
//                                           Duration
//                                         </th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {item.allmed.map((med, medIndex) => (
//                                         <tr key={medIndex}>
//                                           <td
//                                             style={{
//                                               border: "1px solid #ccc",
//                                               padding: "5px",
//                                             }}
//                                           >
//                                             {med.name}
//                                           </td>
//                                           <td
//                                             style={{
//                                               border: "1px solid #ccc",
//                                               padding: "5px",
//                                             }}
//                                           >
//                                             {med.dose}
//                                           </td>
//                                           <td
//                                             style={{
//                                               border: "1px solid #ccc",
//                                               padding: "5px",
//                                             }}
//                                           >
//                                             {med.time}
//                                           </td>
//                                           <td
//                                             style={{
//                                               border: "1px solid #ccc",
//                                               padding: "5px",
//                                             }}
//                                           >
//                                             {med.meal}
//                                           </td>
//                                           <td
//                                             style={{
//                                               border: "1px solid #ccc",
//                                               padding: "5px",
//                                             }}
//                                           >
//                                             {med.duration}
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 )}
//                               </li>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </ul>
//                     </div>
//                   )}
//                 </Droppable>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DragDropContext>
//     </>
//   );
// };

// export default PrintSetting;

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import DemoGraphicDetailCard from "./DemoGraphicDetailCard";

const PrintSetting = ({ getDoctorID, patientDetail }) => {
  const [items, setItems] = useState([
    { id: "item-1", content: "Allergy" },
    { id: "item-2", content: "Headache" },
    { id: "item-3", content: "Fever" },
    {
      id: "item-4",
      content: "Medicine",
      allmed: [
        {
          name: "Valparin 200ml SYP",
          dose: "1",
          time: "2",
          duration: "continue",
          meal: "das",
          route: "oral",
        },
        {
          name: "Eptoin 100 MG TAB",
          dose: "1",
          time: "3",
          duration: "continue",
          meal: "",
          route: "oral",
        },
        {
          name: "Dexona INJ  2 ML",
          dose: "4mg",
          time: "12brly",
          duration: "15 DAYS",
          meal: "",
          route: "",
        },
        {
          name: "Gelusil MPS 400ml",
          dose: "3 tsf",
          time: "3 TIMES",
          duration: "15 DAYS",
          meal: "",
          route: "oral",
        },
        {
          name: "Softovac  SF  100 GM",
          dose: "3tsf",
          time: "bed time",
          duration: "15 DAYS",
          meal: "",
          route: "",
        },
      ],
    },
    { id: "item-5", content: "Cold" },
    { id: "item-6", content: "Cough" },
    { id: "item-7", content: "Flu" },
    { id: "item-8", content: "Chief Complaint" },
    { id: "item-9", content: "Doctor Advice" },
    { id: "item-10", content: "Investigation Lab & Radio" },
    { id: "item-11", content: "Past History" },
    { id: "item-12", content: "Prescribed Medicine" },
    { id: "item-13", content: "Provisional Diagnosis" },
    { id: "item-14", content: "Transfer & Refer" },
  ]);

  const [boxItems, setBoxItems] = useState({
    box1: [],
    fullBox: [],
    box2: [],
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "droppable1") {
        const reorderedItems = reorder(items, source.index, destination.index);
        setItems(reorderedItems);
      } else {
        const reorderedBoxItems = reorder(
          boxItems[source.droppableId],
          source.index,
          destination.index
        );
        setBoxItems({
          ...boxItems,
          [source.droppableId]: reorderedBoxItems,
        });
      }
      return;
    }

    if (source.droppableId === "droppable1") {
      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(source.index, 1);
      setItems(newItems);
      setBoxItems({
        ...boxItems,
        [destination.droppableId]: [
          ...boxItems[destination.droppableId],
          movedItem,
        ],
      });
    } else if (destination.droppableId === "droppable1") {
      const newBoxItems = Array.from(boxItems[source.droppableId]);
      const [movedItem] = newBoxItems.splice(source.index, 1);
      setBoxItems({
        ...boxItems,
        [source.droppableId]: newBoxItems,
      });
      setItems([...items, movedItem]);
    } else {
      const newSourceBoxItems = Array.from(boxItems[source.droppableId]);
      const [movedItem] = newSourceBoxItems.splice(source.index, 1);
      const newDestinationBoxItems = [
        ...boxItems[destination.droppableId],
        movedItem,
      ];

      setBoxItems({
        ...boxItems,
        [source.droppableId]: newSourceBoxItems,
        [destination.droppableId]: newDestinationBoxItems,
      });
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mainPrintDesign ">
          <div className="row">
            <div className="col-2">
              <Droppable droppableId="droppable1">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      border: "1px solid black",
                      minHeight: "200px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <ul className="p-0">
                      {items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => {
                            return (
                              <>
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    padding: "8px",
                                    margin: "4px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    backgroundColor: "#fff",
                                    listStyle: "none",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {item.content}
                                </li>
                              </>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      <li
                        style={{
                          padding: "8px",
                          margin: "4px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                          listStyle: "none",
                        }}
                      >
                        <div className="col-xl-12 col-md-4 col-sm-4 col-sm-4 col-12">
                          <button
                            className="btn btn-sm custom-button w-100"
                            // onClick={handleClearForm}
                            type="button"
                          >
                            Print
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-1">
              <div className="vl" />
            </div>

            <div className="col-9 mb-3">
              <div
                className="row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <DemoGraphicDetailCard patientDetail={patientDetail} />

                <div className="col-12">
                  <div className="row" style={{ width: "77vw" }}>
                    <div className="col-3">
                      {["box2"].map((boxId, idx) => {
                        return (
                          <>
                            <div className="col-12">
                              <div
                                key={idx}
                                className="box"
                                style={{
                                  border: "1px solid black",
                                  marginBottom: "10px",
                                  padding: "10px",
                                  flex: "1 1 22%",
                                  // maxWidth: "48%",
                                  // minHeight: "100px",
                                  marginLeft: "10px",
                                }}
                              >
                                <h5>{`Box ${idx + 1}`}</h5>
                                <Droppable droppableId={boxId}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      style={{
                                        minHeight: "400px",
                                        padding: "10px",
                                      }}
                                    >
                                      <ul className="p-0">
                                        {boxItems[boxId].map((item, index) => (
                                          <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  padding: "8px",
                                                  margin: "4px",
                                                  border: "1px solid #ccc",
                                                  borderRadius: "4px",
                                                  backgroundColor: "#f9f9f9",
                                                  listStyle: "none",
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                              >
                                                {item.content}
                                              </li>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </ul>
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                    <div className="col-1">
                      <div className="vl" />
                    </div>
                    <div className="col-8">
                      {["box1"].map((boxId, idx) => {
                        return (
                          <>
                            <div className="col-12">
                              <div
                                key={idx}
                                className="box"
                                style={{
                                  border: "1px solid black",
                                  marginBottom: "10px",
                                  padding: "10px",
                                  flex: "1 1 22%",
                                  // maxWidth: "48%",
                                  // minHeight: "100px",
                                  marginLeft: "10px",
                                }}
                              >
                                <h5>{`Box ${idx + 1}`}</h5>
                                <Droppable droppableId={boxId}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      style={{
                                        minHeight: "400px",
                                        padding: "10px",
                                      }}
                                    >
                                      <ul className="p-0">
                                        {boxItems[boxId].map((item, index) => (
                                          <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  padding: "8px",
                                                  margin: "4px",
                                                  border: "1px solid #ccc",
                                                  borderRadius: "4px",
                                                  backgroundColor: "#f9f9f9",
                                                  listStyle: "none",
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                              >
                                                {item.content}
                                              </li>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </ul>
                                      <ul className="p-0">
                                        {boxItems["fullBox"].map(
                                          (item, index) => (
                                            <Draggable
                                              key={item.id}
                                              draggableId={item.id}
                                              index={index}
                                            >
                                              {(provided) => (
                                                <li
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  style={{
                                                    padding: "8px",
                                                    margin: "4px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    backgroundColor: "#f9f9f9",
                                                    listStyle: "none",
                                                    ...provided.draggableProps
                                                      .style,
                                                  }}
                                                >
                                                  {item.content}
                                                  {/* <input type="text" value={item.content} name="" id="" /> */}
                                                  {/* Render table if the item is 'Medicine' */}
                                                  {item.content ===
                                                    "Medicine" &&
                                                    item.allmed && (
                                                      <table
                                                        style={{
                                                          marginTop: "10px",
                                                          width: "100%",
                                                          border:
                                                            "1px solid #ccc",
                                                        }}
                                                      >
                                                        <thead>
                                                          <tr>
                                                            {" "}
                                                            <th
                                                              style={{
                                                                border:
                                                                  "1px solid #ccc",
                                                                padding: "5px",
                                                              }}
                                                            >
                                                              Name
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          {item.allmed.map(
                                                            (med, medIndex) => (
                                                              <tr
                                                                key={medIndex}
                                                              >
                                                                <td
                                                                  style={{
                                                                    border:
                                                                      "1px solid #ccc",
                                                                    padding:
                                                                      "5px",
                                                                  }}
                                                                >
                                                                  {med.name}
                                                                </td>{" "}
                                                              </tr>
                                                            )
                                                          )}
                                                        </tbody>
                                                      </table>
                                                    )}
                                                </li>
                                              )}
                                            </Draggable>
                                          )
                                        )}
                                        {provided.placeholder}
                                      </ul>
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </div>
                          </>
                        );
                      })}
                      <></>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default PrintSetting;
