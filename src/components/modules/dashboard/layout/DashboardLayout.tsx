import { Outlet } from "react-router-dom"
import { Fragment } from "react";
import NavbarDashboard from "../navbar/NavbarDashboard";
import "./DashboardLayout.scss"
import Topbar from "../header/Topbar";

const DashboardLayout = () => {
  return (
    <Fragment>
      <NavbarDashboard />
      <section className="dashboard">
        <Topbar />
        <div className="bg-[#EFF3F8] pt-14 h-full overflow-hidden">
          <Outlet />
        </div>
      </section>
    </Fragment>
  );
};

export default DashboardLayout;
