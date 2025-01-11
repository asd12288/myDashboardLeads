import { moneyConvertor } from "../../utilities/moneyConvertor";

function CampaginType({ type, numAccounts, costPerMonth }) {
  return (
    <tr>
      <td>{type}</td>
      <td>{numAccounts}</td>
      <td>{moneyConvertor(costPerMonth)}</td>
      <td>{moneyConvertor(numAccounts * costPerMonth)}</td>
    </tr>
  );
}

export default CampaginType;
