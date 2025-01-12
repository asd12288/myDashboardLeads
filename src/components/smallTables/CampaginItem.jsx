import { moneyConvertor } from "../../utilities/moneyConvertor";

function CampaginItem({ name, amount, date, amountSpent }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{moneyConvertor(amount)}</td>
      <td>{moneyConvertor(amountSpent)}</td>
      <td>{date}</td>
    </tr>
  );
}

export default CampaginItem;
