import { moneyConvertor } from "../../utilities/moneyConvertor";

function BudgetTotal({ remainingBudget}) {
  return (
    <div className="budget-details remaining-budget">
      <h3>Remaining Budget</h3>
      <p className="remaining-amount">
        {moneyConvertor(remainingBudget)}
      </p>
    </div>
  );
}

export default BudgetTotal;
