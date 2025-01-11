import { moneyConvertor } from "../utilities/moneyConvertor";

function BudgetOverview({ totalMaintenanceFee, fee, daysReserve }) {
  
  return (
    <div className="budget-details">
      <h3>Budget Overview</h3>
      <ul>
        <li>
          <span>Maintenance fee:</span> {moneyConvertor(totalMaintenanceFee)}
        </li>
        <li>
          <span>Exchange fees:</span> {moneyConvertor(fee)}
        </li>
        <li>
          <span>3 days reserve:</span> {moneyConvertor(daysReserve)}
        </li>
      </ul>
    </div>
  );
}

export default BudgetOverview;
