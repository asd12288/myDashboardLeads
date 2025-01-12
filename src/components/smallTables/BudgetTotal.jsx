import { moneyConvertor } from "../../utilities/moneyConvertor";

function BudgetTotal({ remainingBudget, daysReserve }) {
  return (
    <div className="budget-details remaining-budget">
      <div className="reserve">
      <h4>3 Days Reserve</h4>
      <p>{moneyConvertor(daysReserve)}</p>
      </div>
      <h3>Remaining Budget</h3>
      <p className="remaining-amount">{moneyConvertor(remainingBudget)}</p>
    </div>
  );
}

export default BudgetTotal;
