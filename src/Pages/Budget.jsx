import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import BudgetTable from "../components/smallTables/BudgetTable";
import ActiveCampaginTable from "../components/ActiveCampaginTable";
import MaintenanceTable from "../components/smallTables/MaintenanceTable";
import BudgetOverview from "../components/smallTables/BudgetOverview";
import BudgetTotal from "../components/smallTables/BudgetTotal";
import LoadingScreen from "../components/LoadingScreen";
import LowBalance from "../components/LowBalance";
import { moneyConvertor } from "../utilities/moneyConvertor";

function Budget() {
  // 1) Local state for each data set
  const [budgetData, setBudgetData] = useState([]);
  const [fullCampaigns, setFullCampaigns] = useState([]);
  const [campaignsDetails, setCampaignsDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lowBalance, setLowBalance] = useState(false);

  // BASE URL
  // const BASE_URL = "http://localhost:30010";
  const BASE_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production

  // 2) Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resBudget = await fetch(`${BASE_URL}/api/budget`);
        const budgetJson = await resBudget.json();
        setBudgetData(budgetJson);

        const resFull = await fetch(`${BASE_URL}/api/full-campaigns`);
        const fullJson = await resFull.json();
        setFullCampaigns(fullJson);

        const resDetails = await fetch(`${BASE_URL}/api/campaigns-details`);
        const detailsJson = await resDetails.json();
        setCampaignsDetails(detailsJson);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  // 3) Calculate derived values
  const totalBudgetDaily = fullCampaigns.reduce(
    (sum, item) => Number(sum) + (Number(item.budgetDaily) || 0),
    0
  );
  const totalBudget = budgetData.reduce(
    (sum, item) => Number(sum) + Number(item.amount),
    0
  );
  const daysReserve = totalBudgetDaily * 3;
  const totalMaintenanceFee = campaignsDetails.reduce(
    (sum, item) => sum + item.costPerMonth * item.numAccounts,
    0
  );

  const fee = (totalBudget * 5) / 100;

  const remainingBudget = totalBudget - fee - totalMaintenanceFee;

  // 4) Only update lowBalance state if values change
  useEffect(() => {
    if (daysReserve + totalBudgetDaily > remainingBudget) {
      setLowBalance(true);
    } else {
      setLowBalance(false);
    }
  }, [daysReserve, totalBudgetDaily, remainingBudget]);

  console.log("daysReserve", daysReserve);
  console.log("totalBudgetDaily", totalBudgetDaily);
  console.log("totalBudget", totalBudget);
  console.log("fee", fee);
  console.log("totalMaintenanceFee", totalMaintenanceFee);
  console.log("remainingBudget", remainingBudget);

  return (
    <Dashboard>
      <h2>Budget</h2>
      {lowBalance && (
        <LowBalance remainingBudget={moneyConvertor(remainingBudget)} />
      )}

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="budget-container">
            <BudgetTable budgetData={budgetData} fee={fee} />
            <ActiveCampaginTable fullCampaigns={fullCampaigns} />
          </div>
          <div className="maintenance-container">
            <MaintenanceTable campaignsDetails={campaignsDetails} />
          </div>
          <div className="budget-details-container">
            <BudgetOverview
              totalMaintenanceFee={totalMaintenanceFee}
              fee={fee}
              daysReserve={daysReserve}
            />
            <BudgetTotal remainingBudget={remainingBudget} />
          </div>
        </>
      )}
    </Dashboard>
  );
}

export default Budget;
