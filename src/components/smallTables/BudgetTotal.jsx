import { moneyConvertor } from "../../utilities/moneyConvertor";

function BudgetTotal({ totalBudget, fee, totalMaintenanceFee }) {
  return (
    <div className="budget-details remaining-budget">
      <h3>Remaining Budget</h3>
      <p className="remaining-amount">
        {moneyConvertor(totalBudget - fee - totalMaintenanceFee)}
      </p>
    </div>
  );
}

export default BudgetTotal;
