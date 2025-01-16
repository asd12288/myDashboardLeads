import BudgetItem from "./BudgetItem";
import { moneyConvertor } from "../../utilities/moneyConvertor";

function BudgetTable({ budgetData, fee }) {
  const totalBudget = budgetData.reduce(
    (sum, item) => Number(sum) + Number(item.amount),
    0
  );

  return (
    <div className="budget-summary">
      <table>
        <thead>
          <tr>
            <th>Latest Deposits</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {budgetData.map((item) => (
            <BudgetItem key={item._id} amount={item.amount} date={item.date} />
          ))}
          <tr>
            <td colSpan="2" style={{ textAlign: "left", fontWeight: "bold" }}>
              Total: {moneyConvertor(totalBudget)}
            </td>
          </tr>
          <tr>
           
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BudgetTable;
