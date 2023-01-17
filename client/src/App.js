import "./App.css";
import "./App.scss";
/// REACT ROUTER ///
import { Outlet } from "react-router-dom";
/// COMPONENTS ///
import Header from "./components/header/Header.tsx";
import React, { useEffect, useState } from "react";
// import React from "react";
import { IphoneFrame } from "./styles/components/IphoneFrame.tsx";

function App() {
  const [showPhone, setShowPhone] = useState(true);

  // const handleResize = () => {
  //   if (window.innerWidth < 391) {
  //     setShowPhone(false);
  //     console.log("tjena");
  //   }
  // };

  // window.addEventListener("resize", handleResize);

  useEffect(() => {
    window.innerWidth < 400 ? setShowPhone(false) : setShowPhone(true);
    const handleResize = () => {
      if (window.innerWidth < 400 && showPhone) {
        setShowPhone(false);
      }
      if (window.innerWidth > 400 && !showPhone) {
        setShowPhone(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showPhone]);

  return (
    <div className="App">
      {showPhone ? (
        <>
          <IphoneFrame>
            <Header />
            <Outlet />
          </IphoneFrame>
        </>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
