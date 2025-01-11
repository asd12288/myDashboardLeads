import { useState, useEffect } from "react";
import CampaginItem from "./CampaginItem";
import { moneyConvertor } from "../utilities/moneyConvertor";

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
        <strong>Total spending of the day: </strong>
        {moneyConvertor(totalBudgetDaily)}
      </div>
    </div>
  );
}

export default ActiveCampaginTable;
