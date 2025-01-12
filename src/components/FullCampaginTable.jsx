import { useState, useEffect } from "react";
import FullCampaignItem from "./FullCampaignItem";
import { moneyConvertor } from "../utilities/moneyConvertor";
import LoadingScreen from "./LoadingScreen";
import styles from "./FullCampaignTable.module.css";
import ReactDOM from "react-dom";

const columnExplanations = {
  campaignName: "The name of the campaign.",
  status: "The current status of the campaign.",
  budgetDaily: "The daily budget allocated to the campaign.",
  results: "The total results achieved by the campaign.",
  reaches: "The number of unique people who saw the campaign.",
  impressions: "The total number of times the campaign was viewed.",
  linkClicks: "The number of clicks on the campaign's link.",
  cpm: "Cost per 1,000 impressions.",
  cpc: "Cost per click.",
  ctr: "Click-through rate (percentage of clicks per impression).",
  clicks: "Total number of clicks on the campaign.",
  costPerResult: "The average cost per result achieved.",
  amountSpent: "The total amount spent on the campaign.",
};

function FullCampaignTable() {
  const [fullCampaigns, setFullCampaigns] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  // const BASE_URL = "http://localhost:30010";
  const BASE_URL = "https://mydashleads-70713a400aca.herokuapp.com" // For production

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch full campaigns
        const resFull = await fetch(`${BASE_URL}/api/full-campaigns`);
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
            {Object.keys(columnExplanations).map((key) => (
              <th
                key={key}
                onMouseEnter={(e) =>
                  setHoveredColumn({
                    key,
                    position: {
                      top: e.target.getBoundingClientRect().top - 10,
                      left:
                        e.target.getBoundingClientRect().left +
                        e.target.offsetWidth / 2,
                    },
                  })
                }
                onMouseLeave={() => setHoveredColumn(null)}
              >
                {key === "campaignName"
                  ? "Campaign Name"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <Tooltip
          text={hoveredColumn?.key && columnExplanations[hoveredColumn.key]}
          position={hoveredColumn?.position || { top: 0, left: 0 }}
          visible={!!hoveredColumn}
        />
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

function Tooltip({ text, position, visible }) {
  if (!visible) return null;

  const tooltipStyle = {
    top: `${position.top - 35}px `,
    left: `${position.left}px`,
  };

  return ReactDOM.createPortal(
    <div style={tooltipStyle} className={`tooltip ${visible ? "visible" : ""}`}>
      {text}
      <div className="tooltip-arrow" />
    </div>,
    document.body
  );
}

export default FullCampaignTable;
