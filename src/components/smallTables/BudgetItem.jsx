import { moneyConvertor } from "../../utilities/moneyConvertor";

function BudgetItem({ amount, date }) {
  const amountConverted = moneyConvertor(amount);

  return (
    <tr>
      <td>{amountConverted}</td>
      <td>{date}</td>
    </tr>
  );
}

export default BudgetItem;
