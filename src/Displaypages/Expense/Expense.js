import React, { useState, useEffect } from "react";
import Topbar from "../../Components/Topbar";
import Sidebar from "../../Components/Sidebar";
import "./Expense.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from "react-intl";

function Expense({ locale, setLocale }) {
  const [Expense, setExpense] = useState([]);
  const [expenseemploye, setExpenseEmploye] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [teammembers, setTeammembers] = useState("");
  const [expensesdate, setExpensesdate] = useState("");
  const [expenseproject, setExpenseproject] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [expensebillablestatus, setExpensebillablestatus] = useState("");
  const [descriptionexpense, setDescriptionexpense] = useState("");

  const [errors, setErrors] = useState({
    teammembers: "",
  });

  const validateForm = () => {
    let valid = true;
    //const { name, email, password } = formData;
    const errorsCopy = { ...errors };

    if (!teammembers.trim()) {
      errorsCopy.teammembers = "Teammembers is required";
      valid = false;
    } else {
      errorsCopy.teammembers = "";
    }

    setErrors(errorsCopy);
    return valid;
  };

  useEffect(() => {
    Load();
  }, []);

  async function Load() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL+"/api/v1/expense/getexpense"
      );
      setExpense(result.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async function save(event) {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    try {
      // Save the client data
      await axios.post(process.env.REACT_APP_API_BASE_URL+"/api/v1/expense/save", {
        teammember: teammembers,
        expensedate: expensesdate,
        expenseproject: expenseproject,
        category: category,
        amount: amount,
        expensebillablestatus: expensebillablestatus,
        descriptionexpense: descriptionexpense,
      });

      toast(<FormattedMessage id ="expenseRegistrationSuccessful"></FormattedMessage>);
      setTeammembers("");
      setExpensesdate("");
      setExpenseproject("");
      setCategory("");
      setAmount("");
      setExpensebillablestatus("");
      setDescriptionexpense("");
      Load();
    } catch (err) {
      toast(<FormattedMessage id="expenseRegistrationFailed" />);
    }
  }

  const endpoint =
    process.env.REACT_APP_API_BASE_URL+"/api/v1/Organization/getAllOrganization";

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(endpoint);
      setExpenseEmploye(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const handleteammembersChange = (e) => {
    setTeammembers(e.target.value);
    if (errors.teammembers) {
      setErrors((prevErrors) => ({ ...prevErrors, teammembers: "" }));
    }
  };

  return (
    <>
      <div>
        <Topbar locale={locale} setLocale={setLocale}/>
        <div className="d-flex">
          <Sidebar locale={locale} setLocale={setLocale} />
          <div className="expense-margin">
            <div className="expense justify-content-end d-flex gap-3 me-5 mt-5">
              <div>
                <select
                  className="expense_teammates_select py-2 px-2"
                  onChange={handleEmployeeChange}
                  value={selectedEmployee}
                >
                  <option className="bg-white text-dark" value="">
                    <FormattedMessage id="teammates" />
                  </option>
                  {expenseemploye.map((employee) => (
                    <option
                      className="bg-white text-dark"
                      key={employee.id}
                      value={employee.firstname}
                    >
                      {employee.firstname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="expense_category_icon">
                <svg
                  className=" m-1 pt-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                >
                  <path
                    d="M1.83301 1.83301H10.583V10.583H1.83301V1.83301ZM16.4163 1.83301H25.1663V10.583H16.4163V1.83301ZM1.83301 16.4163H10.583V25.1663H1.83301V16.4163ZM16.4163 20.7913C16.4163 21.9517 16.8773 23.0645 17.6977 23.8849C18.5182 24.7054 19.631 25.1663 20.7913 25.1663C21.9517 25.1663 23.0645 24.7054 23.8849 23.8849C24.7054 23.0645 25.1663 21.9517 25.1663 20.7913C25.1663 19.631 24.7054 18.5182 23.8849 17.6977C23.0645 16.8773 21.9517 16.4163 20.7913 16.4163C19.631 16.4163 18.5182 16.8773 17.6977 17.6977C16.8773 18.5182 16.4163 19.631 16.4163 20.7913Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div>
                <button
                  type="button"
                  className="expense_btn btn py-2"
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                >
                  <FormattedMessage id="addExpenses"></FormattedMessage>
                  <i className="expense_add_icon fas fa-plus p-1 ms-2"></i>
                </button>
              </div>
            </div>

            <div className="container-lg category_border my-5 py-5">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"><FormattedMessage id="teamMembers" /></th>
                    <th scope="col"><FormattedMessage id="expenseDate" /></th>
                    <th scope="col"><FormattedMessage id="expenseProject" /></th>
                    <th scope="col"><FormattedMessage id="category" /></th>
                    <th scope="col"><FormattedMessage id="Amount" /></th>
                    <th scope="col"><FormattedMessage id="billable" /></th>
                    <th scope="col"><FormattedMessage id="description"></FormattedMessage></th>
                    <th scope="col"><FormattedMessage id="action" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Expense.map((expense, index) => (
                    <tr key={index}>
                      <td>{expense.teammembers}</td>
                      <td>{expense.expensedate}</td>
                      <td>{expense.expenseproject}</td>
                      <td>{expense.category}</td>
                      <td>{expense.amount}</td>
                      <td>{expense.expensebillablestatus}</td>
                      <td>{expense.descriptionexpense}</td>
                      <td className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn category_table_edit"
                        >
                          <svg
                            className="me-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M3.84506 12.7876C5.69992 14.6425 8.11078 15.1982 9.29592 15.3122C9.64421 15.3522 9.83849 15.1379 9.86506 14.9171C9.89192 14.6828 9.74449 14.4282 9.40992 14.3814C8.33849 14.2339 6.12192 13.7519 4.51478 12.1248C1.88963 9.49307 1.39421 5.51536 3.53706 3.3725C5.27821 1.63822 8.17763 1.85907 10.3139 3.01079L11.0102 2.3345C8.41192 0.774215 4.91649 0.647072 2.86735 2.70279C0.42992 5.14707 0.751349 9.69393 3.84506 12.7876ZM13.6622 3.29879L14.1976 2.76307C14.4519 2.50879 14.4656 2.13364 14.2045 1.8925L14.0302 1.73193C13.8028 1.51764 13.4476 1.52422 13.1999 1.7585L12.6711 2.30107L13.6622 3.29879ZM7.15992 9.78736L13.1731 3.78079L12.1753 2.78993L6.16878 8.78993L5.61306 10.0688C5.55935 10.2094 5.69992 10.3502 5.84735 10.3031L7.15992 9.78736ZM6.28278 10.7854C8.47221 12.9751 11.9945 13.8391 13.9633 11.8768C15.5705 10.2631 15.3628 7.39679 13.6419 4.93279L12.9591 5.61564C14.3248 7.63793 14.5928 9.90822 13.2936 11.2071C11.7136 12.7876 9.10163 12.0376 7.30706 10.3434L6.28278 10.7854Z"
                              fill="white"
                            />
                          </svg>
                          <FormattedMessage id="edit" />
                        </button>
                        <button
                          type="button"
                          className="btn category_table_delete"
                        >
                          <svg
                            className="me-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="16"
                            viewBox="0 0 14 16"
                            fill="none"
                          >
                            <path
                              d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z"
                              fill="white"
                            />
                          </svg>
                          <FormattedMessage id="delete" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div className="modal-content rounded-5 shadow-lg">
            <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
              <p
                className="popup_header modal-title font-weight-bold"
                id="exampleModalLongTitle"
              >
                <FormattedMessage id="addExpenses" ></FormattedMessage>
              </p>
              <button
                type="button"
                className="close "
                data-dismiss="modal"
                aria-label="Close"
              >
                {/* <span className="project_close_btn" aria-hidden="true">&times;</span> */}
                <svg
                  className="close project_close_btn"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 18L18 6M18 18L6 6"
                    stroke="#F8F8F8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="popup_sub mt-2 ms-5">
             <FormattedMessage id="pleaseFilExpenseDetails" />
            </p>
            <hr className="hr ms-5"></hr>
            <div className="modal-body">
              <div className=" ms-4 me-4 mt-2">
                <form onSubmit={save} className="needs-validation">
                  <div className=" d-flex ">
                    <div className="form-group col-md-4">
                      <label
                        htmlFor="teammembers"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="teamMembers" />
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        autoComplete="off"
                        className={`form-control custom_input ${
                          errors.teammembers ? "is-invalid" : ""
                        }`}
                        type="text"
                        id="teammembers"
                        value={teammembers}
                        onChange={handleteammembersChange}
                      />
                      {errors.teammembers && (
                        <div className="invalid-feedback">
                          {errors.teammembers}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-4">
                      <label htmlFor="clientname" className="fs-5 custom_badge">
                        <FormattedMessage id="expenseDate" />
                      </label>
                      <input
                        type="Date"
                        className="form-select input1"
                        value={expensesdate}
                        onChange={(event) => {
                          setExpensesdate(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="expenseproject"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="expenseProject" />
                      </label>
                      <input
                        type="text"
                        className="form-select input1"
                        value={expenseproject}
                        onChange={(event) => {
                          setExpenseproject(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex mt-3">
                    <div className="form-group col-md-4">
                      <label htmlFor="category" className="fs-5 custom_badge">
                        <FormattedMessage id="category" />
                      </label>
                      <input
                        type="text"
                        className="form-select input1"
                        value={category}
                        onChange={(event) => {
                          setCategory(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label htmlFor="amount" className="fs-5 custom_badge">
                        <FormattedMessage id="amount" ></FormattedMessage>
                      </label>
                      <input
                        type="text"
                        className="form-select input1"
                        value={amount}
                        onChange={(event) => {
                          setAmount(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="expensebillablestatus"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="expensebillablestatus" />
                      </label>
                      <input
                        type="text"
                        className="form-select input1"
                        value={expensebillablestatus}
                        onChange={(event) => {
                          setExpensebillablestatus(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex mt-3">
                    <div className="form-group col-md-4">
                      <label
                        htmlFor="descriptionexpense"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="descriptionExpense" />
                      </label>
                      <input
                        type="text"
                        className="form-select input1"
                        value={descriptionexpense}
                        onChange={(event) => {
                          setDescriptionexpense(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-4">
                    <div className="col-md-6 text-end">
                      <button
                        type="submit"
                        className="project_add_button btn px-4"
                        // data-dismiss="modal"
                        // onClick={save}
                      >
                        <i className="icon_project_add fas fa-plus border-1 rounded-circle border-white"></i>
                        <FormattedMessage id="add" />
                      </button>
                    </div>
                    <div className="col-md-6 text-start">
                      <button
                        type="button"
                        className="project_cancel_button btn px-4 "
                        data-dismiss="modal"
                      >
                        <i className="icon_project_cancel fas fa-times border-1 rounded-circle border-white"></i>
                        <FormattedMessage id="cancel" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Expense;
