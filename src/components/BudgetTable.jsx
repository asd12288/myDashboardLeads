import BudgetItem from "./BudgetItem";
import { moneyConvertor } from "../utilities/moneyConvertor";

function BudgetTable({ budgetData, fee }) {
  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="budget-summary">
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {budgetData.map((item) => (
            <BudgetItem key={item.id} amount={item.amount} date={item.date} />
          ))}
          <tr>
            <td colSpan="2" style={{ textAlign: "left", fontWeight: "bold" }}>
              Total: {moneyConvertor(totalBudget)}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: "left", fontSize: "0.9rem" }}>
              Fee crypto: {fee}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BudgetTable;
