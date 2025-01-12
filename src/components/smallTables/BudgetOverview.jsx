import { moneyConvertor } from "../../utilities/moneyConvertor";

function BudgetOverview({
  totalMaintenanceFee,
  fee,
  totalSpent,
  totalExpenses,
}) {
  return (
    <div className="budget-details">
      <h3>Expenses Overview</h3>
      <ul>
        <li>
          <span>Maintenance fee:</span> {moneyConvertor(totalMaintenanceFee)}
        </li>
        <li>
          <span>Exchange fees:</span> {moneyConvertor(fee)}
        </li>
        <li>
          <span>All campaigns:</span> {moneyConvertor(totalSpent)}
        </li>
        <li>
          <span>Total Expenses: </span>
          {moneyConvertor(totalExpenses)}
        </li>
      </ul>
    </div>
  );
}

export default BudgetOverview;
