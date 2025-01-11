import { useState } from "react";
import styles from "./FullCampaignItem.module.css";
import { moneyConvertor } from "../utilities/moneyConvertor";

function FullCampaignItem({
  campaignName,
  status,
  dailyBudget,
  results,
  reaches,
  impressions,
  linkClicks,
  cpm,
  cpc,
  ctr,
  clicks,
  costPerResult,
  amountSpent,
  imageUrl, // Added imageUrl prop
}) {
  const [isHovered, setIsHovered] = useState(false);
  console.log(imageUrl);
  const BASE_URL = "https://mydashleads-70713a400aca.herokuapp.com";

  return (
    <>
      <tr
        className={styles.campaignRow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <td>{campaignName}</td>
        <td>
          <span className={`status ${status.toLowerCase()}`}>{status}</span>
        </td>
        <td>{moneyConvertor(dailyBudget)}</td>
        <td>{results}</td>
        <td>{reaches}</td>
        <td>{impressions}</td>
        <td>{linkClicks}</td>
        <td>{cpm}</td>
        <td>{cpc}</td>
        <td>{ctr}</td>
        <td>{clicks}</td>
        <td>{costPerResult}</td>
        <td>{moneyConvertor(amountSpent)}</td>
      </tr>
      {isHovered && imageUrl && (
        <div className={styles.imagePopup}>
          <img
            src={`${BASE_URL}${imageUrl}`}
            alt="Campaign Image"
            className={styles.previewImage}
          />
          />
        </div>
      )}
    </>
  );
}

export default FullCampaignItem;
