import React from 'react'
import Topbar from '../../../Components/Topbar'
import Sidebar from '../../../Components/Sidebar'
import SettingTopBar from '../SettingTopBar'
import Userpermissioncomponent from '../Userpermissioncomponent'

const IpGeoRestrict = ({ locale, setLocale }) => {
  return (
    <div>
     <Topbar locale={locale} setLocale={setLocale} />
        <div className="d-flex">
          <Sidebar locale={locale} setLocale={setLocale} />
        <div>
          <SettingTopBar />
          <div>
            <Userpermissioncomponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default IpGeoRestrict
