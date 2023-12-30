import React from "react";

interface DashboardHeadingProps {
  icon: string,
  title: string
}

const DashboardHeading: React.FC<DashboardHeadingProps> = ({ icon = "", title = "" }) => {
  return (
    <div className="flex items-center mb-6 ml-4">
      <i className={icon} />
      <span className="ml-3 text-xl font-bold">{title}</span>
    </div>
  );
};

export default DashboardHeading;
