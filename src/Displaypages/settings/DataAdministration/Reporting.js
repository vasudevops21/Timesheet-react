import React, { useState } from 'react';
import './Reporting.css';
import SettingTopBar from '../SettingTopBar';
import { NavLink } from 'react-router-dom';
import Topbar from '../../../Components/Topbar';
import Sidebar from '../../../Components/Sidebar';

function Reporting({ locale, setLocale }) {
    const [selectedRole, setSelectedRole] = useState('');
  return (
    <>
    <div>
      <Topbar locale={locale} setLocale={setLocale} />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale} />
        <div className="roles-container">
          <SettingTopBar />
          <div className='roles'>
      <ul>
        {/* Apply a different class to always underline "Roles", using activeClassName */}
        <li className="always-underline" onClick={() => setSelectedRole('')}>
          <NavLink
            className={({ isActive }) => isActive ? 'link-css selected' : 'link-css'}
            to="/settings/DataAdministration/Reporting"
          >
            Reporting
          </NavLink>
        </li>
        {/* Other items toggle the underline based on selection */}
        <li onClick={() => setSelectedRole('')}>
          <NavLink
            className={({ isActive }) => isActive ? 'link-css selected ' : 'link-css'}
            to="/settings/DataAdministration/AuditData"
          >
            Audit Data
          </NavLink>
        </li>
      </ul>
    </div>
    </div>
      </div>
    </div>
    </>
  )
}

export default Reporting
