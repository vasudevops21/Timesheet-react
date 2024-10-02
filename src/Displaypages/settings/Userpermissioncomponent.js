import React, { useState } from 'react';
import './UserAccessControl/Roles.css'
import { NavLink } from 'react-router-dom';
import './Userpermissioncomponent.css'

const Userpermissioncomponent = () => {
    const [selectedRole, setSelectedRole] = useState('');
  return (
    <div className='roles'>
      <ul>
        {/* Apply a different class to always underline "Roles", using activeClassName */}
        <li className="always-underline" onClick={() => setSelectedRole('')}>
          <NavLink
            className={({ isActive }) => isActive ? 'link-css selected' : 'link-css'}
            to="/settings/UserAcceesControl/Roles"
          >
            Roles
          </NavLink>
        </li>
        {/* Other items toggle the underline based on selection */}
        <li onClick={() => setSelectedRole('Permissions')}>
          <NavLink
            className={({ isActive }) => isActive ? 'link-css selected ' : 'link-css'}
            to="/settings/UserAcceesControl/Permission"
          >
            Permissions
          </NavLink>
        </li>
        {/* <li onClick={() => setSelectedRole('Module')}>
          <NavLink
            className={({ isActive }) => isActive ? 'link-css selected' : 'link-css'}
            to="/settings/UserAcceesControl/Module"
          >
            Module
          </NavLink>
        </li>
        <li onClick={() => setSelectedRole('Ip & GeoRestrict')}>
          <NavLink
            className={({ isActive }) => isActive ? 'link-css selected' : 'link-css'}
            to="/settings/UserAcceesControl/IpGeoRestrict"
          >
            Ip & GeoRestrict
          </NavLink>
        </li> */}
      </ul>
    </div>
  )
}

export default Userpermissioncomponent
