// App.js
import BudgetAdmin from "../components/BudgetAdmin";
import CampaignsDetailsAdmin from "../components/CampaignsDetailsAdmin";
import FullCampaignsAdmin from "../components/FullCampaignsAdmin";
import Dashboard from "./Dashboard";

function Admin() {
  return (
    <Dashboard>
      <div style={{ margin: "2rem" }}>
        <h1 className="admin-header">Admin Dashboard</h1>
        <hr />
        <BudgetAdmin />
        <hr />
        <CampaignsDetailsAdmin />
        <hr />
        <FullCampaignsAdmin />
      </div>
    </Dashboard>
  );
}

export default Admin;
