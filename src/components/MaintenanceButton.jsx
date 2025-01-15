import { useContext } from "react";
import { BaseUrlContext } from "../context/BaseUrlContext";

function MaintenanceButton() {
  let { MAINTENANCE_MODE, setMAINTENANCE_MODE } = useContext(BaseUrlContext);

  function toggleMaintenanceMode() {
    setMAINTENANCE_MODE(!MAINTENANCE_MODE);
  }

  return (
    <div className="maintenance-section">
      <button onClick={toggleMaintenanceMode} className="btn btn-primary btn-maintenance">
        Maintenance Mode
      </button>
      <p>Mode: {MAINTENANCE_MODE ? "Active ⚒️ The Client Dont Have Access!" : "Not Active ✅ Everything Work!"}</p>
    </div>
  );
}

export default MaintenanceButton;
