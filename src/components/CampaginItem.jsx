import { moneyConvertor } from "../utilities/moneyConvertor";

function CampaginItem({ name, amount, date }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{moneyConvertor(amount)}</td>
      <td>{date}</td>
    </tr>
  );
}

export default CampaginItem;
