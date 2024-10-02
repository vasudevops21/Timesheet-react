import React, { useEffect } from "react";
import Topbar from "../../../Components/Topbar";
import Sidebar from "../../../Components/Sidebar";
import SettingTopBar from "../SettingTopBar";
import "./subscription.css";
function Subscription({ locale, setLocale }) {
  useEffect(() => {
    if (window.StripeBuyButton) {
      window.StripeBuyButton.mount();
    }
  }, []);

  return (
    <>
      <Topbar locale={locale} setLocale={setLocale} />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale} />
        <div className="subscription">
          <SettingTopBar />

          <div className="subscription_div d-flex gap-5 mt-5">
       
            <div className="stripe_btn">
              <stripe-buy-button
                buy-button-id="buy_btn_1PaxEhP3J1N333V0UFF5j1hO"
                publishable-key="pk_test_51PWI3WP3J1N333V0Wmx6p0kvwHkOqffxL1gH9pLaNBGAKLs2lHm4V5nzz7KmTzafoiBP0eBfh2rxO7XBDfD9fVKM00EWtmEqpH"
              ></stripe-buy-button>
            </div>

            <div className="stripe_btn">
              <stripe-buy-button
                buy-button-id="buy_btn_1Pb0uaP3J1N333V0Amh4eFzW"
                publishable-key="pk_test_51PWI3WP3J1N333V0Wmx6p0kvwHkOqffxL1gH9pLaNBGAKLs2lHm4V5nzz7KmTzafoiBP0eBfh2rxO7XBDfD9fVKM00EWtmEqpH"
              ></stripe-buy-button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subscription;
