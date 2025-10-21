import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Outlet, useLocation } from "react-router-dom";

function RootLayout() {
  const location = useLocation();
  const path = location.pathname;

  const hideFooterRoutes = ["/login", "/register"];

  return (
    <div>
      <Header />
      <div style={{ minHeight: "90vh" }}>
        <Outlet />
      </div>
      {!hideFooterRoutes.includes(path) && <Footer />}
    </div>
  );
}

export default RootLayout;