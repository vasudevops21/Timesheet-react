
import Sidebar from '../../Components/Sidebar';
import Topbar from '../../Components/Topbar';


import './Settingspage.css';
import SettingTopBar from './SettingTopBar';

function SettingsPages({ locale, setLocale }) {



    return (
        <>
            <div>
                <Topbar locale={locale} setLocale={setLocale}/>
                <div className="d-flex">
                    <Sidebar locale={locale} setLocale={setLocale}/>
                    <SettingTopBar locale={locale} setLocale={setLocale}/>

                </div>
            </div>
        </>
    );
}

export default SettingsPages;
