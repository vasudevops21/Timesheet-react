import React, { useState, useEffect } from 'react';
import Topbar from '../../../Components/Topbar'
import Sidebar from '../../../Components/Sidebar'
import SettingTopBar from '../SettingTopBar'
import { Link } from 'react-router-dom'
import Userpermissioncomponent from '../Userpermissioncomponent';
import './Permission.css'
import { useLocation } from 'react-router-dom';


const EditPermission = ({ isVisible, onClose }) => {
  const [activePage, setActivePage] = useState('record');

  if (!isVisible) return null;

  const handleRecordPermissionClick = () => {
    setActivePage('record');
  };

  const handleFieldPermissionClick = () => {
    setActivePage('field');
  };

  const handleClose = () => {
    setActivePage('record'); // Reset the active page to 'record'
    onClose(); // Call the original onClose prop function if any additional actions are needed
  };

  return (
    <div className="setting_permission_modal_overlay">
      {activePage === 'record' && (
        <div className="setting_permission_modal_content">
          <div className='setting_permission_popup_main d-flex'>
            <div className='d-flex setting_permission_head'>
              <div className='me-5'>
                <p className={`setting_permission_text_1 ${activePage === 'record' ? 'active-permission' : ''}`}  >Record Permission</p>
              </div>
              <div className=''>
                <p className={`setting_permission_text_2 ${activePage === 'field' ? 'active-permission' : ''}`} onClick={handleFieldPermissionClick}>Field Permission</p>

              </div>
            </div>
            <div className='setting_permission_popup_cancel ' onClick={handleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M6 18L18 6M18 18L6 6" stroke="#F8F8F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <hr className='setting_permission_edit_underline' />
          <div className='d-flex setting_permission_edit_1'>
            <div className='setting_permission_popup_view'>
              <div className='setting_permission_common_text_style'>
                View
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios1"
                  id="exampleRadios11"
                  value="option1"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios1">
                  None
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio" name="exampleRadios1"
                  id="exampleRadios21"
                  value="option2"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios21">
                  Own
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios1"
                  id="exampleRadios31"
                  value="option3"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios31">
                  All Data
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios1"
                  id="exampleRadios31"
                  value="option3"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios31">
                  All in Department
                </label>
              </div>
            </div>

            <div className='setting_permission_popup_edit'>
              <div className='setting_permission_common_text_style'>
                Edit
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios1"
                  value="option1"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios1">
                  Restricted
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios2"
                  value="option2"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios2">
                  Allowed to Edit
                </label>
              </div>
            </div>
            <div className='setting_permission_popup_add '>
              <div className='setting_permission_common_text_style'>
                Add
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios2"
                  id="exampleRadios13"
                  value="option1"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios13">
                  Restricted
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios2"
                  id="exampleRadios23"
                  value="option2"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios23">
                  Allowed to Create
                </label>
              </div>
            </div>


            <div className='setting_permission_popup_delete'>
              <div className='setting_permission_common_text_style'>
                Delete
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios3"
                  id="exampleRadios113"
                  value="option1"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios113">
                  None
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios3"
                  id="exampleRadios213"
                  value="option2"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios213">
                  Own
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios3"
                  id="exampleRadios312"
                  value="option3"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios312">
                  All Data
                </label>
              </div>
              <div class="form-check pt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios3"
                  id="exampleRadios312"
                  value="option3"
                />
                <label class="form-check-label setting_permission_edit_popup_content setting_permission_common_text_option" for="exampleRadios312">
                  All in Department
                </label>
              </div>

            </div>

          </div>

          <div className='d-flex settings_permission_popup_save_div gap-4'>
            <div type="button" className='settings_permission_popup_save_btn'>
              Save
            </div>

            <div type="button" className='settings_permission_popup_close_btn' onClick={handleClose}>
              Close
            </div>
          </div>

        </div>
      )}


      {activePage === 'field' && (
        <div className="setting_permission_modal_content">
          <div className='setting_permission_popup_main d-flex'>
            <div className='d-flex setting_permission_head'>
              <div className='me-5'>
                <p className={`setting_permission_text_1 ${activePage === 'record' ? 'active-permission' : ''}`} onClick={handleRecordPermissionClick}>Record Permission</p>
              </div>
              <div className=''>
                <p className={`setting_permission_text_2 ${activePage === 'field' ? 'active-permission' : ''}`} onClick={handleFieldPermissionClick}>Field Permission</p>
              </div>
            </div>
            <div className='setting_permission_popup_cancel ' onClick={handleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M6 18L18 6M18 18L6 6" stroke="#F8F8F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <hr className='setting_permission_edit_underline' />

          <div className='text-center pt-3'>
            Under Progress!
          </div>
        </div>
      )}
    </div>
  );
};





const Permission = ({ locale, setLocale }) => {

  const location = useLocation();
  const passedRole = location.state?.role;


  const initialTableData = [
    {
      role: 'Administrator',
      view: 'All Data',
      edit: 'All Data',
      create: 'All Data',
      delete: 'All Data',
    },
    {
      role: 'Supervisor',
      view: 'All Data',
      edit: 'All Data',
      create: 'Allowed to create',
      delete: 'All Data',
    },
    {
      role: 'Member',
      view: 'All Data',
      edit: 'All Data',
      create: 'Allowed to create',
      delete: 'All Data',
    }


  ];


  const [tableData, setTableData] = useState(initialTableData);
  const [editRole, setEditRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    if (passedRole) {
      const roleIndex = tableData.findIndex((row) => row.role === passedRole);
      if (roleIndex !== -1) {
        handleOpenModal(tableData[roleIndex].role);
      }
    }
  }, [passedRole, tableData]);

  const handleOpenModal = (role) => {
    setEditRole(role);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditRole(null);
  };

  const handlePermissionUpdate = (updatedValues) => {
    const updatedData = tableData.map((row) => {
      if (row.role === editRole) {
        return { ...row, ...updatedValues };
      }
      return row;
    });
    setTableData(updatedData);
    handleCloseModal();
  };


  return (
    <div>
     <Topbar locale={locale} setLocale={setLocale} />
        <div className="d-flex">
          <Sidebar locale={locale} setLocale={setLocale} />
        <div className='setting_permission_top'>
          <SettingTopBar />
          <div className=''>
            <Userpermissioncomponent />
            <div className='setting_permission_main rounded-4 mx-5 py-3 px-5 mt-2 shadow' >
              <div class="table-responsive">
                <table class="table">
                  <thead className='setting_permission_table_headline'>
                    <tr>

                      <th scope="col"> <div className='bg_colour_roles'>Roles</div> </th>
                      <th scope="col"><div className='bg_colour_roles'>View</div> </th>
                      <th scope="col"><div className='bg_colour_roles'>Edit</div> </th>
                      <th scope="col"><div className='bg_colour_roles'>Create</div> </th>
                      <th scope="col"><div className='bg_colour_roles'>Delete</div> </th>
                      <th scope="col"><div className='bg_colour_roles'>Action</div> </th>
                    </tr>
                  </thead>
                  <tbody className='setting_permission_table_row' >
                    {initialTableData.map((row) => (
                      <tr key={row.role}>
                        <td>
                          <div className='setting_permission_table_value'>
                            {row.role}
                          </div>
                        </td>
                        <td>
                          <div className='setting_permission_table_value'>
                            {row.view}
                          </div>
                        </td>
                        <td>
                          <div className='setting_permission_table_value'>
                            {row.edit}
                          </div>
                        </td>
                        <td>
                          <div className='setting_permission_table_value'>
                            {row.create}
                          </div>
                        </td>
                        <td>
                          <div className='setting_permission_table_value'>
                            {row.delete}
                          </div>
                        </td>
                        <td>
                          <button
                            className='btn btn-sm btn-primary px-2 setting_permission_edit_btn'
                            disabled={row.role === 'Administrator'}
                            onClick={() => handleOpenModal(row.role)}
                          >
                            <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3.84488 12.7881C5.69974 14.643 8.11059 15.1987 9.29574 15.3127C9.64402 15.3527 9.83831 15.1384 9.86488 14.9176C9.89174 14.6833 9.74431 14.4287 9.40974 14.3818C8.33831 14.2344 6.12174 13.7524 4.51459 12.1253C1.88945 9.49356 1.39402 5.51585 3.53688 3.37299C5.27802 1.6387 8.17745 1.85956 10.3137 3.01127L11.01 2.33499C8.41174 0.774704 4.91631 0.647561 2.86717 2.70328C0.429737 5.14756 0.751166 9.69442 3.84488 12.7881ZM13.662 3.29928L14.1975 2.76356C14.4517 2.50928 14.4655 2.13413 14.2043 1.89299L14.03 1.73242C13.8026 1.51813 13.4475 1.5247 13.1997 1.75899L12.6709 2.30156L13.662 3.29928ZM7.15974 9.78785L13.1729 3.78128L12.1752 2.79042L6.16859 8.79042L5.61288 10.0693C5.55917 10.2098 5.69974 10.3507 5.84717 10.3036L7.15974 9.78785ZM6.28259 10.7858C8.47202 12.9756 11.9943 13.8396 13.9632 11.8773C15.5703 10.2636 15.3626 7.39728 13.6417 4.93328L12.9589 5.61613C14.3246 7.63842 14.5926 9.9087 13.2935 11.2076C11.7135 12.7881 9.10145 12.0381 7.30688 10.3438L6.28259 10.7858Z" fill="white" />
                            </svg>
                            Edit
                          </button>
                          <EditPermission
                            isVisible={isModalVisible}
                            onClose={handleCloseModal}
                            role={editRole}
                            initialValues={tableData.find((row) => row.role === editRole)}
                            onSave={(updatedValues) => handlePermissionUpdate(updatedValues)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default Permission;
