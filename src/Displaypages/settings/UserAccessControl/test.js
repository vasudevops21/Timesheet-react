const initialTableData = [
  {
    role: 'Administrator',
    view: 'All Data',
    edit: 'All Data',
    create: 'All Data',
    delete: 'All Data',
  },
  {
    role: 'Manager',
    view: 'All Data',
    edit: 'All Data',
    create: 'Allowed to create',
    delete: 'All Data',
  },
  {
    role: 'Reporting Manager',
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
  },
];

const Permission = () => {
  const [tableData, setTableData] = useState(initialTableData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editRole, setEditRole] = useState(null);

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
      {/* ... */}
      <table>
        <thead>
          {/* ... */}
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.role}>
              <td>{row.role}</td>
              <td>{row.view}</td>
              <td>{row.edit}</td>
              <td>{row.create}</td>
              <td>{row.delete}</td>
              <td>
                <button onClick={() => handleOpenModal(row.role)}>Edit</button>
                <EditPermission
                  isVisible={isModalVisible && editRole === row.role}
                  onClose={handleCloseModal}
                  initialValues={row}
                  onSave={handlePermissionUpdate}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ... */}
    </div>
  );
};




import React, { useState, useEffect, useRef } from 'react';
import './Roles.css';
import Topbar from '../../../Components/Topbar';
import Sidebar from '../../../Components/Sidebar';
import SettingTopBar from '../SettingTopBar';
import { Link } from 'react-router-dom';
import Userpermissioncomponent from '../Userpermissioncomponent';
import { CgAdd } from "react-icons/cg";
import { MdOutlineCancel } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Modal, Button, Toast } from "react-bootstrap";
import { AiOutlineSync } from "react-icons/ai";
import { FormattedMessage } from 'react-intl';
import { ToastContainer, toast } from "react-toastify";

// ... (AddRoleModal and EditRoleModal components)

const Roles = () => {
  const [editingRoleIndex, setEditingRoleIndex] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roles, setRoles] = useState([
    { name: 'Administrator', department: 'Default Role', isDefault: true },
    { name: 'Supervisor', department: 'Default Role', isDefault: true },
    { name: 'Member', department: 'Default Role', isDefault: true }
  ]);

  const [newRoles, setNewRoles] = useState([]);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRole(null);
    setEditingRoleIndex(null);
  };

  const handleSave = (roleName, department) => {
    setNewRoles(currentRoles => [...currentRoles, { name: roleName, department, isDefault: false }]);
    handleCloseModal();
  };

  const handleDeleteRole = (roleIndex) => {
    const updatedRoles = [...roles];
    if (updatedRoles[roleIndex].isDefault) {
      // Do not allow deleting default roles
      toast('Default roles cannot be deleted', {
        style: {
          textAlign: 'center'
        }
      });
      return;
    }
    updatedRoles.splice(roleIndex, 1);
    setRoles(updatedRoles);
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);

  const handleOpenDeleteModal = (index) => {
    setSelectedRoleIndex(index);
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setSelectedRoleIndex(null);
  };

  const handleEditRole = (role, index) => {
    setEditingRole(role);
    setEditingRoleIndex(index);
    handleOpenModal();
  };

  return (
    <div>
      <Topbar />
      <div className='d-flex'>
        <Sidebar />
        <div className='roles-container'>
          <SettingTopBar />
          <div className=''>
            <Userpermissioncomponent />
            <div className='setting-con justify-content-center mx-5'>
              <div className='text-end me-5'>
                <div className="content-area">
                  <div className='d-flex justify-content-end'>
                    <div className="add-btn d-flex setting_role_create" onClick={handleOpenModal}>
                      {/* ... */}
                    </div>
                  </div>
                  <AddRoleModal
                    isVisible={isModalVisible && editingRoleIndex === null}
                    onClose={handleCloseModal}
                    onSave={(roleName, department) => handleSave(roleName, department)}
                  />

                  <EditRoleModal
                    isVisible={isModalVisible && editingRoleIndex !== null}
                    onClose={handleCloseModal}
                    onSave={(roleName, department) => {
                      const updatedRoles = [...roles];
                      updatedRoles[editingRoleIndex] = { ...updatedRoles[editingRoleIndex], name: roleName, department };
                      setRoles(updatedRoles);
                      handleCloseModal();
                    }}
                    initialRole={editingRole?.name ?? ''}
                    initialDepartment={editingRole?.department ?? ''}
                  />
                </div>
              </div>
              <div className=''>
                <div className='roles mx-4'>
                  {roles.map((role, index) => (
                    <div key={index} className={role.isDefault ? 'card1 shadow mb-3 pt-2' : 'custom_card1 mt-4 shadow mb-3'}>
                      <p className='dp'>{role.name}</p>
                      <p className='dp1'>{role.department}</p>
                      <div className={role.isDefault ? 'ps-5 roles-box-design2' : 'ps-5 custom_roles_box_design'}>
                        (0) <Link className='permission' to="/settings/UserAcceesControl/Permission"> Configure Permission</Link>
                      </div>
                      {!role.isDefault && (
                        <div className='edit-role-delete-div justify-content-end text-end'>
                          <button className='edit-role-button fs-5' onClick={() => handleEditRole(role, index)}>
                            {/* ... */}
                          </button>
                          <button className='delete-role-button fs-5' data-bs-toggle="modal" data-bs-target="#conformationdeleteModal" onClick={() => handleOpenDeleteModal(index)}>
                            {/* ... */}
                          </button>
                          {/* ... (delete confirmation modal) */}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;