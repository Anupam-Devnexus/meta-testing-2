// src/Pages/Dashboard/Integrations/IntegrationPage.jsx
import React, { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import IntegrationCard from "../../../Components/Cards/IntigrationCard";

const IntegrationPage = () => {
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v19.0",
        });
      };

      (function (d, s, id) {
        let js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);


  const statusChangeCallback = (response) => {
    console.log("FB login status:", response);

    if (response.status === "connected") {
      const { accessToken } = response.authResponse;
      console.log("User is logged in. AccessToken:", accessToken);
      localStorage.setItem("fb_access_token", accessToken);
    } else {
      console.log("User not authenticated with Facebook.");
    }
  };


  const checkLoginState = () => {
    window.FB.getLoginStatus((response) => {
      statusChangeCallback(response);
    });
  };

  const handleFacebook = async () => {
    try {
      setLoadingId(1);

      window.FB.login(
        (response) => {
          if (response.authResponse) {
            console.log("FB login success:", response);
            statusChangeCallback(response);
          } else {
            console.log("FB login cancelled or failed.");
          }
          setLoadingId(null);
        },
        { scope: "public_profile,email,pages_show_list,pages_read_engagement,leads_retrieval" }
      );
    } catch (err) {
      console.error("Facebook Login Error:", err.message);
      setLoadingId(null);
    }
  };

  const integrationsData = [
    {
      id: 1,
   
      icon: FaFacebook,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      buttonText: "Connect Facebook",
      buttonColor: "bg-blue-600",
      onClick: handleFacebook,
    },
  ];

  return (
    <div className="">
     

      
        {integrationsData.map((integration) => (
          <IntegrationCard
            key={integration.id}
            {...integration}
            isLoading={loadingId === integration.id}
          />
        ))}
      
    </div>
  );
};

export default IntegrationPage;
