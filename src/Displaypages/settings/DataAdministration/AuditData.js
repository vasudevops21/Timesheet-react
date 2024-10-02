import React, { useState } from "react";
import "./Reporting.css";
import SettingTopBar from "../SettingTopBar";
import { NavLink } from "react-router-dom";
import Topbar from "../../../Components/Topbar";
import Sidebar from "../../../Components/Sidebar";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

function AuditData({ locale, setLocale }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Example data
  const data = [
    { id: 1, name: "John", age: 30 },
    { id: 2, name: "Doe", age: 25 },
    { id: 3, name: "Jane", age: 35 },
  ];

  const totalPages = Math.ceil(data.length / pageSize);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangePageSize = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedData.length);

  const paginatedData = sortedData.slice(startIndex, endIndex);

  const renderPagination = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleChangePage(i)}
          className={` ${
            currentPage === i
              ? "data_administration_current_page mx-2"
              : "data_administration_secondary_page mx-2"
          } `}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(<span key="start-ellipsis">...</span>);
      pageNumbers.unshift(
        <button key={1} onClick={() => handleChangePage(1)} className="data_administration_first_and_last_page mx-2">
          1
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<span key="end-ellipsis">...</span>);
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handleChangePage(totalPages)}
          className="data_administration_first_and_last_page mx-2"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  return (
    <>
      <div>
        <Topbar locale={locale} setLocale={setLocale} />
        <div className="d-flex">
          <Sidebar locale={locale} setLocale={setLocale} />
          <div className="roles-container">
            <SettingTopBar />
            <div className="roles">
              <ul>
                <li
                  className="always-underline"
                  onClick={() => setSelectedRole("")}
                >
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link-css selected" : "link-css"
                    }
                    to="/settings/DataAdministration/Reporting"
                  >
                    Reporting
                  </NavLink>
                </li>
                <li onClick={() => setSelectedRole("")}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link-css selected " : "link-css"
                    }
                    to="/settings/DataAdministration/AuditData"
                  >
                    Audit Data
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="table-responsive my-3 mx-5">
              <table className="table table-hover audit_data_table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>
                      Audit ID {getSortIcon("id")}
                    </th>
                    <th onClick={() => handleSort("name")}>
                      Done By {getSortIcon("name")}
                    </th>
                    <th onClick={() => handleSort("age")}>
                      Previous Value {getSortIcon("age")}
                    </th>
                    <th onClick={() => handleSort("age")}>
                      Current Value {getSortIcon("age")}
                    </th>
                    <th>
                      Operations
                    </th>
                    <th>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex gap-3 justify-content-end me-5">
              <div className="mt-3">
                <select
                  className="data_administration_pagination_rowsperpage p-1"
                  onChange={handleChangePageSize}
                  value={pageSize}
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="data_administration_pagination d-flex  my-3">
                <button
                  className={`${
                    currentPage === 1
                      ? "data_administration_pagination_left_icon_1"
                      : "data_administration_pagination_left_icon"
                  } `}
                  onClick={() => handleChangePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious className="fs-3" />
                </button>
                <div className="mx-2">{renderPagination()}</div>
                <button
                  className={`${
                    currentPage === totalPages
                      ? "data_administration_pagination_right_icon_lastpage"
                      : "data_administration_pagination_right_icon"
                  } `}
                  onClick={() => handleChangePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <GrFormNext className="fs-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuditData;



// import React, { useState } from "react";
// import "./Reporting.css";
// import SettingTopBar from "../SettingTopBar";
// import { NavLink } from "react-router-dom";
// import Topbar from "../../../Components/Topbar";
// import Sidebar from "../../../Components/Sidebar";
// import { GrFormPrevious } from "react-icons/gr";

// function AuditData({ locale, setLocale }) {
//   const [selectedRole, setSelectedRole] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5); // Default page size

//   // Example data
//   const data = [
//     { id: 1, name: "John", age: 30 },
//     { id: 2, name: "Doe", age: 25 },
//     { id: 3, name: "Jane", age: 35 },
//     // { id: 1, name: "John", age: 30 },
//     // { id: 2, name: "Doe", age: 25 },
//     // { id: 3, name: "Jane", age: 35 },
//     // { id: 1, name: "John", age: 30 },
//     // { id: 2, name: "Doe", age: 25 },
//     // { id: 3, name: "Jane", age: 35 },
//     // { id: 1, name: "John", age: 30 },
//     // { id: 2, name: "Doe", age: 25 },
//     // { id: 3, name: "Jane", age: 35 },
//     // { id: 1, name: "John", age: 30 },
//     // { id: 2, name: "Doe", age: 25 },
//     // { id: 3, name: "Jane", age: 35 },
//     // { id: 1, name: "John", age: 30 },
//     // { id: 2, name: "Doe", age: 25 },
//     // { id: 3, name: "Jane", age: 35 },
//   ];

//   const totalPages = Math.ceil(data.length / pageSize);

//   const handleChangePage = (page) => {
//     setCurrentPage(page);
//   };

//   const handleChangePageSize = (e) => {
//     setPageSize(parseInt(e.target.value, 10));
//     setCurrentPage(1); // Reset to first page when changing page size
//   };

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, data.length);

//   const paginatedData = data.slice(startIndex, endIndex);

//   const renderPagination = () => {
//     const pageNumbers = [];
//     let startPage, endPage;

//     if (totalPages <= 5) {
//       // Less than 5 total pages so show all
//       startPage = 1;
//       endPage = totalPages;
//     } else {
//       // More than 5 total pages so calculate start and end pages
//       if (currentPage <= 3) {
//         startPage = 1;
//         endPage = 5;
//       } else if (currentPage + 1 >= totalPages) {
//         startPage = totalPages - 4;
//         endPage = totalPages;
//       } else {
//         startPage = currentPage - 1;
//         endPage = currentPage + 1;
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <button
//           key={i}
//           onClick={() => handleChangePage(i)}
//           className={` ${
//             currentPage === i
//               ? "data_administration_current_page mx-2"
//               : "data_administration_secondary_page mx-2"
//           } `}
//         >
//           {i}
//         </button>
//       );
//     }

//     if (startPage > 1) {
//       pageNumbers.unshift(<span key="start-ellipsis">...</span>);
//       pageNumbers.unshift(
//         <button key={1} onClick={() => handleChangePage(1)} className="data_administration_first_and_last_page mx-2">
//           1
//         </button>
//       );
//     }

//     if (endPage < totalPages) {
//       pageNumbers.push(<span key="end-ellipsis">...</span>);
//       pageNumbers.push(
//         <button
//           key={totalPages}
//           onClick={() => handleChangePage(totalPages)}
//           className="data_administration_first_and_last_page mx-2"
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return pageNumbers;
//   };

//   return (
//     <>
//       <div>
//         <Topbar locale={locale} setLocale={setLocale} />
//         <div className="d-flex">
//           <Sidebar locale={locale} setLocale={setLocale} />
//           <div className="roles-container">
//             <SettingTopBar />
//             <div className="roles">
//               <ul>
//                 {/* Apply a different class to always underline "Roles", using activeClassName */}
//                 <li
//                   className="always-underline"
//                   onClick={() => setSelectedRole("")}
//                 >
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive ? "link-css selected" : "link-css"
//                     }
//                     to="/settings/DataAdministration/Reporting"
//                   >
//                     Reporting
//                   </NavLink>
//                 </li>
//                 {/* Other items toggle the underline based on selection */}
//                 <li onClick={() => setSelectedRole("")}>
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive ? "link-css selected " : "link-css"
//                     }
//                     to="/settings/DataAdministration/AuditData"
//                   >
//                     Audit Data
//                   </NavLink>
//                 </li>
//               </ul>
//             </div>

//             <div className="table-responsive my-3 mx-5">
//               <table class="table table-hover audit_data_table">
//                 <thead>
//                   <tr>
//                     {/* <th scope="col">#</th> */}
//                     <th scope="col">Audit ID</th>
//                     <th scope="col">Done By</th>
//                     <th scope="col">Previous Value</th>
//                     <th scope="col">Current Value</th>
//                     <th scope="col">Operations</th>
//                     <th scope="col">Timestamp</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((item) => (
//                     <tr key={item.id}>
//                       <td>{item.id}</td>
//                       <td>{item.name}</td>
//                       <td>{item.age}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="d-flex gap-3 justify-content-end me-5">
//               <div className="mt-3">
//                 <select
//                   className="data_administration_pagination_rowsperpage p-1"
//                   onChange={handleChangePageSize}
//                   value={pageSize}
//                 >
//                   <option value={1}>1</option>
//                   <option value={5}>5</option>
//                   <option value={15}>15</option>
//                   <option value={20}>20</option>
//                 </select>
//               </div>
//               <div className="data_administration_pagination d-flex  my-3">
//                 {/* <div className="data_administration_pagination_left_icon"> */}
//                 <button
//                 className={`${
//                     currentPage === 1
//                       ? "data_administration_pagination_left_icon_1"
//                       : "data_administration_pagination_left_icon"
//                   } `}
//                 //   className="data_administration_pagination_left_icon "
//                   onClick={() => handleChangePage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <GrFormPrevious className="fs-3" />
//                 </button>
//                 {/* </div> */}
//                 <div className="mx-2">
//                 {renderPagination()}
//                 </div>
//                 {/* <div className="data_administration_pagination_right_icon_1 "> */}
//                 <button
//                 className={`${
//                     currentPage === totalPages
//                       ? "data_administration_pagination_right_icon_lastpage"
//                       : "data_administration_pagination_right_icon"
//                   } `}
//                 //   className="data_administration_pagination_right_icon "
//                   onClick={() => handleChangePage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   <GrFormPrevious className="fs-3" />
//                 </button>
//                 {/* </div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AuditData;

