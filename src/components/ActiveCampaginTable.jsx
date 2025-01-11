import CampaginItem from "./smallTables/CampaginItem";
import { moneyConvertor } from "../utilities/moneyConvertor";
import { NavLink } from "react-router-dom";

function ActiveCampaginTable({ fullCampaigns }) {
  const filtredFullCampaings = fullCampaigns.filter(
    (item) => item.status === "Active"
  );

  const totalBudgetDaily = filtredFullCampaings.reduce(
    (sum, item) => Number(sum) + (Number(item.budgetDaily) || 0),
    0
  );

  return (
    <div className="active-campaigns">
      <table>
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Budget/Daily</th>
            <th>Starting Date</th>
          </tr>
        </thead>
        <tbody>
          {filtredFullCampaings.map((item) => (
            <CampaginItem
              key={item.id}
              amount={item.budgetDaily}
              date={item.startingDate}
              name={item.campaignName}
            />
          ))}
        </tbody>
      </table>
      <div className="total-spending">
        Total spending of the day:
        <strong> {moneyConvertor(totalBudgetDaily)}</strong>
        <br />
        <NavLink to="/campaign">View All Campaigns</NavLink>
      </div>
    </div>
  );
}

export default ActiveCampaginTable;
