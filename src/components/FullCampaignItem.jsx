import { useContext, useState } from "react";
import styles from "./FullCampaignItem.module.css";
import { moneyConvertor } from "../utilities/moneyConvertor";
import { BaseUrlContext } from "../context/BaseUrlContext";

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

  const { BASE_URL } = useContext(BaseUrlContext);

  return (
    <>
      <tr>
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
        <td>{Number(ctr ?? 0).toFixed(2)}%</td>
        <td>{clicks}</td>
        <td>{costPerResult}</td>
        <td>{moneyConvertor(amountSpent)}</td>
        <td
          className={styles.campaignRow}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Screen Capture &rarr;
        </td>
      </tr>
      {isHovered && imageUrl && (
        <div className={styles.imagePopup}>
          <img
            src={`${imageUrl}`}
            alt="Campaign Image"
            className={styles.previewImage}
          />
        </div>
      )}
    </>
  );
}

export default FullCampaignItem;
