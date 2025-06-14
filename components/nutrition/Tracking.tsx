import React from "react";
import UserProfileHistoryTable from "./UserProfileHistoryTable";
import UserProfileChart from "./UserProfileChart";

const Tracking = () => {
  return (
    <div>
      <UserProfileChart />
      <UserProfileHistoryTable />
    </div>
  );
};

export default Tracking;
