import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const SettingTopBar = () => {
    const location = useLocation();
    const isUserAccessControlActive = location.pathname.startsWith('/settings/UserAcceesControl');
    const navLinkStyle = {
        borderRadius: '0',
        color: 'inherit',
        textDecoration: 'none'
    };


    return (

        <div>
            <div className='settings-fullbody'>
                <div className='settings-topbar-iconandtext'>
                    <h1 className='settings-topbar-heading'> Settings</h1>
                </div>
                <div className='settings-category'>
                    <ul className=" settings-category-list nav nav-tabs" id="myTab" role="tablist">
                        <li className=" settings-category-list-element nav-item">
                            <NavLink className="active-setting-link nav-link" to={'/settings/general'}>General</NavLink>
                        </li>
                        <li className={`settings-category-list-element nav-item`}>
                            <NavLink className={`active-setting-link nav-link   ${isUserAccessControlActive ? 'active' : ''}`} to="/settings/UserAcceesControl/Roles">User Access Control</NavLink>
                        </li>
                        {/* <li className=" settings-category-list-element nav-item">
                            <Link className="active-setting-link nav-link" id="Integration-tab" data-toggle="tab" role="tab" aria-controls="Integration" aria-selected="false" to="#">Integration</Link>
                        </li>
                  
                        <li className=" settings-category-list-element nav-item">
                            <Link className=" active-setting-link nav-link  " id="Customization-tab" data-toggle="tab" role="tab" aria-controls="Customization" aria-selected="false" to="#">Customization</Link>
                        </li> */}
                         <li className=" settings-category-list-element nav-item nav-item">
                         <NavLink className=" active-setting-link nav-link  " id="DataAdmin-tab" data-toggle="tab" role="tab" aria-controls="DataAdmin" aria-selected="false" to="/settings/DataAdministration/Reporting">Data Administration</NavLink>
                         </li>
                          <li class=" settings-category-list-element nav-item nav-item ">
                            <NavLink className=" active-setting-link nav-link  active-setting-link" id="Timeoff-tab" data-toggle="tab" role="tab" aria-controls="Timeoff" aria-selected="false" to="/settings/Leave/Timeoff/Timeoff">Time off</NavLink>
                        </li>             
                        <li class=" settings-category-list-element nav-item nav-item ">
                            <NavLink className=" active-setting-link nav-link  active-setting-link" id="Holidays-tab" data-toggle="tab" role="tab" aria-controls="Holidays" aria-selected="false" to="/settings/Leave/Holiday/HolidaySetup">Holidays</NavLink>
                        </li>
                        <li class=" settings-category-list-element nav-item nav-item ">
                            <NavLink className=" active-setting-link nav-link  active-setting-link" id="payment-tab" data-toggle="tab" role="tab" aria-controls="payment" aria-selected="false" to="/settings/payment">Subscription & Payment</NavLink>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active-setting-link" id="General" role="tabpanel" aria-labelledby="General-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="UAC" role="tabpanel" aria-labelledby="UAC-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="Integration" role="tabpanel" aria-labelledby="Integration-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="Customization" role="tabpanel" aria-labelledby="Customization-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="DataAdmin" role="tabpanel" aria-labelledby="DataAdmin-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="Holidays" role="tabpanel" aria-labelledby="Holidays-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="Timeoff" role="tabpanel" aria-labelledby="Timeoff-tab"></div>
                        <div className="tab-pane fade  active-setting-link" id="payment" role="tabpanel" aria-labelledby="payment-tab"></div>
                    </div>
                    {/* </nav> */}
                </div>
            </div>
        </div>
    )
}

export default SettingTopBar
