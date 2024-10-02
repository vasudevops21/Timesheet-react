import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../Components/Sidebar';
import Topbar from '../../../../Components/Topbar';
import SettingTopBar from '../../SettingTopBar';
import './HolidaySetup.css';
import { CgAdd } from 'react-icons/cg';
import { MdOutlineCancel } from 'react-icons/md';
import { ToastContainer, toast } from "react-toastify";
import DatePicker from 'react-datepicker';


const DEFAULT_CHARGE_CODE = 'HLD2024';
const HolidaySetup = () => {
  const [holidays, setHolidays] = useState([]);
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
  const [isEditHolidayModalOpen, setIsEditHolidayModalOpen] = useState(false);
  // const [holidays, setHolidays] = useState([]);
  const [editingHolidayIndex, setEditingHolidayIndex] = useState(null);
  const existingDates = holidays.map((holiday) => holiday.date);
  const [holidayToDeleteIndex, setHolidayToDeleteIndex] = useState(null);

  const openAddHolidayModal = () => {
    setIsAddHolidayModalOpen(true);
    setIsEditHolidayModalOpen(false);
    setEditingHolidayIndex(null);
  };

  const openEditHolidayModal = (index) => {
    setIsAddHolidayModalOpen(false);
    setIsEditHolidayModalOpen(true);
    setEditingHolidayIndex(index);
  };

  const handleSaveHoliday = (editedHoliday, editedDate) => {
    if (editingHolidayIndex !== null) {
      const updatedHolidays = [...holidays];
      updatedHolidays[editingHolidayIndex] = { 
        holiday: editedHoliday, 
        date: editedDate, 
        chargeCode: DEFAULT_CHARGE_CODE 
      };
      setHolidays(updatedHolidays);
    } else {
      const newHoliday = { 
        holiday: editedHoliday, 
        date: editedDate, 
        chargeCode: DEFAULT_CHARGE_CODE 
      };
      setHolidays([...holidays, newHoliday]);
    }
    closeHolidayModal();
  };

  const closeHolidayModal = () => {
    setIsAddHolidayModalOpen(false);
    setIsEditHolidayModalOpen(false);
    setEditingHolidayIndex(null);
  };

  const deleteHoliday = (index) => {
    const updatedHolidays = [...holidays];
    updatedHolidays.splice(index, 1);
    setHolidays(updatedHolidays);
  };



  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <div className='holiday_fullbody '>
          <SettingTopBar />
          <div className="">
            {/* <div className='settings-holiday-body shadow'> */}

            <Holiday
              isVisible={isAddHolidayModalOpen || isEditHolidayModalOpen}
              onClose={closeHolidayModal}
              onSave={handleSaveHoliday}
              initialHoliday={editingHolidayIndex !== null ? holidays[editingHolidayIndex]?.holiday : ''}
              initialDate={editingHolidayIndex !== null ? holidays[editingHolidayIndex]?.date : ''}
              initialChargeCode={editingHolidayIndex !== null ? holidays[editingHolidayIndex]?.chargeCode : ''}
              isEditing={editingHolidayIndex !== null}
              existingDates={existingDates}
            />
            <div className='p-5 mx-5  settings-holiday-body-h'>
              <div className="table-add-btn me-5 mb-3">
                <button
                  type="button"
                  className="settings-btn pe-3"
                  onClick={openAddHolidayModal}
                >
                  <i className="settings-icon-btn fas fa-plus py-2 ps-3 pe-3 me-2"></i>
                  Add Holiday

                </button>
              </div>
              <div className='settings-holiday-body '>
                <table className="table settings-holiday-table">
                  <thead className='settigs-holiday-table-head'>
                    <tr className='settings-holiday-border-none'>
                      <th scope="col" className='settings-holiday-heading1 no-border'>
                        <div className='settings-holiday-first-heading heading-div'>Holiday</div>
                      </th>
                      <th scope="col" className='settings-holiday-heading2 no-border'>
                        <div className='settings-holiday-mid-heading heading-div'>Date</div>
                      </th>

                      <th scope="col" className='settings-holiday-heading4 no-border'>
                        <div className='settings-holiday-mid-heading heading-div'>Charge Code</div>
                      </th>

                      <th scope="col" className='settings-holiday-heading3 no-border'>
                        <div className='settings-holiday-last-heading heading-div'>Action</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='setting_holiday_table_row'>
                    {holidays.map((holiday, index) => (
                      <tr className="setting_holiday_table_row_item" key={index}>
                        <td className="setting_holiday_table_cell"><div className='settings-holiday-first-heading'>{holiday.holiday}</div></td>
                        <td className="setting_holiday_table_cell"><div className='settings-holiday-mid-heading'>{holiday.date}</div></td>
                        <td className="setting_holiday_table_cell"><div className='settings-holiday-mid-heading'>{holiday.chargeCode}</div></td>
                        <td className="setting_holiday_table_cell">
                          <div className="settings-holiday-action-button">
                            <button className="btn btn-sm btn-primary me-2 setting_holiday_edit_btn" onClick={() => openEditHolidayModal(index)}>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.84555 12.7881C5.70041 14.643 8.11127 15.1987 9.29641 15.3127C9.64469 15.3527 9.83898 15.1384 9.86555 14.9176C9.89241 14.6833 9.74498 14.4287 9.41041 14.3818C8.33898 14.2344 6.12241 13.7524 4.51527 12.1253C1.89012 9.49356 1.39469 5.51585 3.53755 3.37299C5.27869 1.6387 8.17812 1.85956 10.3144 3.01127L11.0107 2.33499C8.41241 0.774704 4.91698 0.647561 2.86784 2.70328C0.430409 5.14756 0.751837 9.69442 3.84555 12.7881ZM13.6627 3.29928L14.1981 2.76356C14.4524 2.50928 14.4661 2.13413 14.205 1.89299L14.0307 1.73242C13.8033 1.51813 13.4481 1.5247 13.2004 1.75899L12.6716 2.30156L13.6627 3.29928ZM7.16041 9.78785L13.1736 3.78128L12.1758 2.79042L6.16927 8.79042L5.61355 10.0693C5.55984 10.2098 5.70041 10.3507 5.84784 10.3036L7.16041 9.78785ZM6.28327 10.7858C8.47269 12.9756 11.995 13.8396 13.9638 11.8773C15.571 10.2636 15.3633 7.39728 13.6424 4.93328L12.9596 5.61613C14.3253 7.63842 14.5933 9.9087 13.2941 11.2076C11.7141 12.7881 9.10212 12.0381 7.30755 10.3438L6.28327 10.7858Z" fill="white" />
                              </svg> &nbsp; Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#conformationdeleteholidayModal"
                              onClick={() => setHolidayToDeleteIndex(index)}
                            >
                              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z" fill="white" />
                              </svg> &nbsp; Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>

            <div className="modal setting_popup_box_holiday_blur" id="conformationdeleteholidayModal" tabindex="-1" aria-labelledby="conformationdeleteholidayModalLabel" aria-hidden="true">
              <div className="modal-dialog setting_popup_box_holiday_modal_dialog">
                <div className="modal-content setting_popup_box_holiday_modal_contect">
                  <div class="modal-body" id="conformationdeleteholidayModalLabel">

                    <div className="setting_role_delete_holiday_confirm_close" data-bs-dismiss="modal" aria-label="Close">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="-3 0 22 18" fill="none">
                        <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>

                    <div className='d-flex mt-3 ' >

                      <div className='setting_role_delete_svg_holiday '>
                        <svg width="90" height="110" viewBox="0 0 102 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id="path-1-inside-1_4035_16032" fill="white">
                            <path d="M17 68C17 65.2386 19.2386 63 22 63H79C81.7614 63 84 65.2386 84 68V122C84 130.284 77.2843 137 69 137H32C23.7157 137 17 130.284 17 122V68Z" />
                          </mask>
                          <path d="M17 68C17 65.2386 19.2386 63 22 63H79C81.7614 63 84 65.2386 84 68V122C84 130.284 77.2843 137 69 137H32C23.7157 137 17 130.284 17 122V68Z" fill="white" stroke="#FF7F7F" stroke-width="14" mask="url(#path-1-inside-1_4035_16032)" />
                          <rect x="0.254395" y="52.4956" width="79.6364" height="9.04959" rx="4.5248" transform="rotate(-40.6555 0.254395 52.4956)" fill="#FF7F7F" />
                          <mask id="path-3-inside-2_4035_16032" fill="white">
                            <path d="M13.0617 33.1466C10.7823 30.4924 11.0862 26.493 13.7403 24.2137L28.8442 11.2427C31.4984 8.96339 35.4977 9.26723 37.7771 11.9214C40.0564 14.5755 39.7526 18.5749 37.0984 20.8543L21.9946 33.8252C19.3404 36.1046 15.341 35.8007 13.0617 33.1466Z" />
                          </mask>
                          <path d="M6.55532 34.7797C3.19652 30.8686 3.64425 24.9752 7.55537 21.6164L27.2111 4.73636C31.1222 1.37756 37.0156 1.82529 40.3744 5.7364L33.2253 15.8304C33.1048 15.6902 32.8935 15.6741 32.7533 15.7946L17.6494 28.7655C17.5092 28.886 17.4931 29.0973 17.6135 29.2375L6.55532 34.7797ZM41.9042 16.7272L17.1888 37.9524L41.9042 16.7272ZM19.7187 35.7798C15.8076 39.1386 9.91413 38.6908 6.55532 34.7797C3.19652 30.8686 3.64425 24.9752 7.55537 21.6164L17.6494 28.7655C17.5092 28.886 17.4931 29.0973 17.6135 29.2375C19.8929 31.8917 21.8544 33.9457 21.9946 33.8252L19.7187 35.7798ZM27.2111 4.73636C31.1222 1.37756 37.0156 1.82529 40.3744 5.7364C43.7332 9.64752 43.2855 15.5409 39.3744 18.8998L37.0984 20.8543C37.2387 20.7338 35.5046 18.4846 33.2253 15.8304C33.1048 15.6902 32.8935 15.6741 32.7533 15.7946L27.2111 4.73636Z" fill="#FF7F7F" mask="url(#path-3-inside-2_4035_16032)" />
                          <rect x="41" y="81" width="6" height="36" rx="3" fill="#FF7F7F" />
                          <rect x="56" y="81" width="6" height="36" rx="3" fill="#FF7F7F" />
                          <g clip-path="url(#clip0_4035_16032)">
                            <path d="M61.1575 36.2083C62.9383 32.2042 66.0682 28.754 70.3654 26.7348C77.9057 23.1919 86.5872 25.1109 92.0175 30.8538L88.7848 33.9168C86.7117 31.7236 83.9993 30.2405 81.034 29.6788C78.0687 29.1172 75.0018 29.5056 72.2702 30.7888C69.1081 32.2746 66.7703 34.7983 65.4001 37.7385L74.0284 40.8504L59.4342 47.7078L52.5768 33.1135L61.1575 36.2083Z" fill="#FF7F7F" />
                          </g>
                          <defs>
                            <clipPath id="clip0_4035_16032">
                              <rect width="43" height="43" fill="white" transform="matrix(-0.905069 0.425264 0.425264 0.905069 82.918 5)" />
                            </clipPath>
                          </defs>
                        </svg>

                      </div>




                      <div className='confirmdelete_word_holiday' >
                        <h2 className='confirmdelete_word_h2_holiday'> Delete Role </h2>
                        <p className='confirmdelete_word_p_holiday'>Are you certain you wish to proceed with the deletion of this?</p>
                      </div>

                    </div>
                  </div>


                  <div className='d-flex justify-content-center mb-5'>
                    <div
                      className="button btn d-flex flex-row setting_role_delete_button_holiday"
                      onClick={() => {
                        if (holidayToDeleteIndex !== null) {
                          deleteHoliday(holidayToDeleteIndex);
                          setHolidayToDeleteIndex(null);
                        }
                      }}
                      data-bs-dismiss="modal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="4 0 30 26" fill="none">
                        <path
                          d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                          fill="white"
                        />
                      </svg>
                      <div className="setting_role_delete_button_text_holiday">Delete</div>
                    </div>
                    <div className="button btn d-flex flex-row setting_role_cancel_button_holiday ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="2 0 30 26" fill="none">
                        <path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#FF7F7F" />
                      </svg>


                      <div className="setting_role_cancel_button_text_holiday" data-bs-dismiss="modal" >Cancel</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaySetup;

const Holiday = ({ isVisible, onClose, onSave, initialHoliday, initialDate, isEditing, existingDates, initialChargeCode }) => {
  const [holiday, setHoliday] = useState(initialHoliday);
  const [date, setDate] = useState(initialDate ? new Date(initialDate) : null);
  const [chargeCode, setChargeCode] = useState(initialChargeCode || '');




  useEffect(() => {
    setHoliday(initialHoliday);
    setDate(initialDate ? new Date(initialDate) : null);
    setChargeCode(initialChargeCode || '');
  }, [initialHoliday, initialDate, initialChargeCode]);

  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };


  // const handleChargeCodeChange = (e) => {
  //   setChargeCode(e.target.value);
  // };

  const handleSaveClick = () => {
    if (holiday.trim() && date) {
      const formattedDate = date.toISOString().slice(0, 10);
      const dateExists = existingDates.some(existingDate => existingDate === formattedDate);
      if (dateExists && !isEditing) {
        const dateString = date.toLocaleDateString();
        toast(`This date (${dateString}) already exists for another holiday. Please choose a different date.`);
      } else {
        // Use a default charge code if it's empty
        const finalChargeCode = chargeCode.trim() || 'DEFAULT_CODE';
        onSave(holiday, formattedDate, finalChargeCode);
        setHoliday('');
        setDate(null);
        setChargeCode('');
      }
    } else {
      toast('Please Enter both Holiday Name and Date');
    }
  };

  const handleClose = () => {
    onClose();
    setHoliday('');
    setDate('');
    setChargeCode('');
    
  };

  if (!isVisible) return null;

  return (
    <div className="Settings-holiday-popup-modal">
      <div className="Settings-holiday-popup-content">
        <div className='Settings-holiday-popup-setupholiday'>
          <p className='Settings-holiday-popup-headline'>{isEditing ? 'Edit holidays' : 'Setup holidays'}</p>
          <div className='Settings-holiday-popup_cancel_button' onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M6 18L18 6M18 18L6 6" stroke="#F8F8F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className='Settings-holiday-popup-fill-text'>
          <p className="Settings-holiday-popup-instruction-text">
            {isEditing ? 'PLEASE UPDATE THE DETAILS' : 'PLEASE FILL THE DETAILS'}
          </p>
        </div>
        <div className='Settings-holiday-popup-holiday'>
          <div className='Settings-holiday-popup-add-holiday'>
            <label className='Settings-holiday-popup-add-holiday-input'>Holiday</label>
            <input
              className='Settings-holiday-popup-add-holiday-input-placeholder'
              type="text"
              value={holiday}
              onChange={(e) => setHoliday(e.target.value)}
              placeholder="Holiday Name"
              required
            />
          </div>



          <div className='Settings-holiday-popup-add-date'>
            <label className='Settings-holiday-popup-add-date-input'>Date</label>
            <DatePicker
              className='Settings-holiday-popup-add-date-inputplaceholder custom-datepicker'
              selected={date}
              onChange={handleDateChange}
              dateFormat="MM-dd-yyyy"
              placeholderText="Select a date"
            />
          </div>

        </div>

        {/* <div className='Settings-holiday-popup-add-charge-code'>
          <label className='Settings-holiday-popup-add-charge-code-input'>Charge Code</label>
          <div className='d-flex align-items-center'>
            <input
              className='Settings-holiday-popup-add-charge-code-input-placeholder'
              type="text"
              value={chargeCode}
              onChange={handleChargeCodeChange}
              placeholder="Enter Charge Code"
              required
              
            />
            
          </div>
        </div> */}


        <div className="Settings-holiday-popup-button-group d-flex gap-4 justify-content-center ms-4">
          <div className=' d-flex'>
            {isEditing ? (
              <button className='Settings-holiday-popup-button-group-edit_button btn px-3' onClick={handleSaveClick}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg " className='fs-5 me-2'>
                  <path d="M27 25.586L25 23.586V21H23V24.414L25.586 27L27 25.586Z" fill="white" />
                  <path d="M24 31.0001C22.6155 31.0001 21.2622 30.5896 20.111 29.8204C18.9599 29.0512 18.0627 27.958 17.5328 26.6789C17.003 25.3998 16.8644 23.9923 17.1345 22.6345C17.4046 21.2766 18.0713 20.0293 19.0503 19.0504C20.0292 18.0714 21.2765 17.4047 22.6344 17.1346C23.9922 16.8645 25.3997 17.0031 26.6788 17.5329C27.9579 18.0628 29.0511 18.96 29.8203 20.1111C30.5895 21.2623 31 22.6156 31 24.0001C30.9979 25.856 30.2597 27.6352 28.9474 28.9475C27.6351 30.2598 25.8559 30.998 24 31.0001ZM24 19.0001C23.0111 19.0001 22.0444 19.2933 21.2221 19.8428C20.3999 20.3922 19.759 21.1731 19.3806 22.0867C19.0022 23.0003 18.9031 24.0056 19.0961 24.9756C19.289 25.9455 19.7652 26.8364 20.4645 27.5356C21.1637 28.2349 22.0546 28.7111 23.0245 28.904C23.9945 29.097 24.9998 28.9979 25.9134 28.6195C26.827 28.2411 27.6079 27.6002 28.1573 26.778C28.7068 25.9557 29 24.989 29 24.0001C28.9984 22.6745 28.4711 21.4037 27.5338 20.4663C26.5964 19.529 25.3256 19.0017 24 19.0001ZM16 28.0001C12.8185 27.9967 9.76821 26.7313 7.51852 24.4816C5.26883 22.2319 4.00344 19.1816 4 16.0001H2C2.00423 19.7118 3.48059 23.2703 6.10518 25.8949C8.72977 28.5195 12.2883 29.9959 16 30.0001V28.0001ZM12 8.0001H7.078C8.69621 6.18831 10.8268 4.91108 13.1874 4.3377C15.548 3.76432 18.0271 3.92188 20.2961 4.78949C22.5652 5.6571 24.5169 7.19379 25.8927 9.19587C27.2686 11.1979 28.0034 13.5709 28 16.0001H30C30.0044 13.2169 29.1778 10.4957 27.6262 8.18517C26.0745 5.87461 23.8684 4.07988 21.2904 3.03087C18.7125 1.98185 15.88 1.72632 13.1559 2.29699C10.4319 2.86767 7.94015 4.23857 6 6.2341V2.0001H4V10.0001H12V8.0001Z" fill="white" />
                </svg>

                Update
              </button>
            ) : (
              <button className='Settings-holiday-popup-button-group-add_button btn btn-sm px-4 py-2' onClick={handleSaveClick}>
                <CgAdd className='fs-4 me-2' />
                Add
              </button>
            )}
          </div>
          <div className='settings-button-cancel'>
            {isEditing ? (
              <button className='Settings-holiday-popup-edit-cancel-button btn px-3' onClick={handleClose}>
                <MdOutlineCancel className='fs-4 me-2' />
                Cancel
              </button>
            ) : (
              <button className='settings-button-cancel btn btn-sm px-3 py-2' onClick={handleClose}>
                <MdOutlineCancel className='fs-4 me-2' />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



