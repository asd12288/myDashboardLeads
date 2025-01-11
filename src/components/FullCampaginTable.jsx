import { useState, useEffect } from "react";
import FullCampaignItem from "./FullCampaignItem";
import { moneyConvertor } from "../utilities/moneyConvertor";
import LoadingScreen from "./LoadingScreen";

function FullCampaignTable() {
  const [fullCampaigns, setFullCampaigns] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch full campaigns
        const resFull = await fetch("http://localhost:3001/api/full-campaigns");
        const fullJson = await resFull.json();
        setFullCampaigns(fullJson);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  function getFilteredCampaigns() {
    if (filter === "Active") {
      return fullCampaigns.filter((camp) => camp.status === "Active");
    } else if (filter === "Inactive") {
      return fullCampaigns.filter(
        (camp) => camp.status === "Paused" || camp.status === "Ended"
      );
    } else if (filter === "Learning") {
      return fullCampaigns.filter((camp) => camp.status === "Learning");
    }
    return fullCampaigns;
  }

  const filteredCampaigns = getFilteredCampaigns();

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <div className="filters">
        <select
          id="campaign-filter"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="All">All Campaigns</option>
          <option value="Active">Active Campaigns</option>
          <option value="Inactive">Inactive Campaigns</option>
          <option value="Learning">Learning Campaigns</option>
        </select>
      </div>
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Status</th>
            <th>Budget Daily</th>
            <th>Results</th>
            <th>Reaches</th>
            <th>Impressions</th>
            <th>Link Clicks</th>
            <th>CPM</th>
            <th>CPC</th>
            <th>CTR</th>
            <th>Clicks</th>
            <th>Cost Per Result</th>
            <th>Amount Spent</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.map((item) => (
            <FullCampaignItem
              key={item.id}
              campaignName={item.campaignName}
              status={item.status}
              dailyBudget={item.budgetDaily}
              results={item.results}
              reaches={item.reaches}
              impressions={item.impressions}
              linkClicks={item.linkClicks}
              cpm={moneyConvertor(item.cpm)}
              cpc={moneyConvertor(item.cpc)}
              ctr={item.ctr}
              clicks={item.clicks}
              costPerResult={moneyConvertor(item.costPerResult)}
              amountSpent={item.amountSpent}
              imageUrl={item.imageUrl}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default FullCampaignTable;
