// FullCampaignsAdmin.jsx
import { useState, useEffect, useContext } from "react";
import { moneyConvertor } from "../../utilities/moneyConvertor";
import { BaseUrlContext } from "../../context/BaseUrlContext";
import toast from "react-hot-toast";

const initialState = {
  campaignName: "",
  status: "Learning",
  budgetDaily: "",
  results: "",
  reaches: "",
  impressions: "",
  linkClicks: "",
  clicks: "",
  costPerResult: "",
  // The following four will be calculated automatically (no manual input).
  amountSpent: 0,
  cpm: 0,
  cpc: 0,
  ctr: 0,

  startingDate: "",
  imageFile: null,
  imageUrl: null,
  imagePreview: null,
};

function FullCampaignsAdmin() {
  const { BASE_URL } = useContext(BaseUrlContext);

  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState(initialState);
  const [editCampaign, setEditCampaign] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/full-campaigns`, {
        headers: {
          role: localStorage.getItem("role"),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch campaigns");
      }
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error(`Error fetching campaigns: ${error.message}`);
    }
  };

  // Utility to recalculate cpm/cpc/ctr/amountSpent
  const recalcCampaignMetrics = (campaign) => {
    const results = parseFloat(campaign.results) || 0;
    const costPerResult = parseFloat(campaign.costPerResult) || 0;
    const impressions = parseFloat(campaign.impressions) || 0;
    const linkClicks = parseFloat(campaign.linkClicks) || 0;
    const clicks = parseFloat(campaign.clicks) || 0;

    const amountSpent = results * costPerResult;
    const cpm = impressions > 0 ? (amountSpent / impressions) * 1000 : 0;
    const cpc = clicks > 0 ? amountSpent / clicks : 0;
    const ctr = impressions > 0 ? (linkClicks / impressions) * 100 : 0;

    return {
      ...campaign,
      amountSpent,
      cpm,
      cpc,
      ctr,
    };
  };

  // Handle changes for NEW campaign
  const handleNewCampaignChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setNewCampaign((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setNewCampaign((prev) => {
        const updated = { ...prev, [name]: value };
        return recalcCampaignMetrics(updated);
      });
    }
  };

  // Add a new campaign
  const addCampaign = async () => {
    if (!newCampaign.campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }

    try {
      setIsLoading(true);

      // Recalculate before sending, just to ensure up-to-date
      const finalData = recalcCampaignMetrics(newCampaign);

      const formData = new FormData();
      // Append all except local-only keys
      Object.keys(finalData).forEach((key) => {
        if (["imagePreview", "imageFile"].includes(key)) return;
        formData.append(key, finalData[key]);
      });
      // Image file if present
      if (finalData.imageFile) {
        formData.append("image", finalData.imageFile);
      }

      const response = await fetch(`${BASE_URL}/api/full-campaigns`, {
        method: "POST",
        headers: {
          role: localStorage.getItem("role"),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Campaign added successfully");
        setNewCampaign(initialState);
        fetchCampaigns();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
      toast.error("An error occurred while adding the campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const startEdit = (campaign) => {
    setEditCampaign({
      ...campaign,
      imageUrl: campaign.imageUrl || null,
      imageFile: null,
      imagePreview: null,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditCampaign(null);
    setIsEditing(false);
  };

  // Handle changes for EDIT campaign
  const handleEditCampaignChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setEditCampaign((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setEditCampaign((prev) => {
        const updated = { ...prev, [name]: value };
        return recalcCampaignMetrics(updated);
      });
    }
  };

  // Save edited campaign
  const saveEdit = async () => {
    if (!editCampaign) return;
    try {
      setIsLoading(true);

      // Recalculate to ensure everything is up-to-date
      const finalData = recalcCampaignMetrics(editCampaign);

      const formData = new FormData();
      // Append all except local-only properties
      Object.keys(finalData).forEach((key) => {
        if (["imagePreview", "imageFile", "id"].includes(key)) return;
        formData.append(key, finalData[key]);
      });
      // If new file
      if (finalData.imageFile) {
        formData.append("image", finalData.imageFile);
      }

      const response = await fetch(
        `${BASE_URL}/api/full-campaigns/${editCampaign._id}`,
        {
          method: "PUT",
          headers: {
            role: localStorage.getItem("role"),
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Campaign updated successfully");
        fetchCampaigns();
        cancelEdit();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("An error occurred while updating the campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete campaign
  const deleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    try {
      const response = await fetch(`${BASE_URL}/api/full-campaigns/${id}`, {
        method: "DELETE",
        headers: {
          role: localStorage.getItem("role"),
        },
      });

      if (response.ok) {
        toast.success("Campaign deleted successfully");
        fetchCampaigns();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("An error occurred while deleting the campaign.");
    }
  };

  return (
    <section className="admin-section">
      <h2>Full Campaigns Admin</h2>
      {isLoading && <p>Loading...</p>}

      {/* Existing Campaigns Table */}
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
            {/* Automated fields */}
            <th>CPM</th>
            <th>CPC</th>
            <th>CTR</th>
            <th>Clicks</th>
            <th>Cost Per Result</th>
            <th>Amount Spent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.campaignName}</td>
              <td>{campaign.status}</td>
              <td>{moneyConvertor(campaign.budgetDaily)}</td>
              <td>{campaign.results}</td>
              <td>{campaign.reaches}</td>
              <td>{campaign.impressions}</td>
              <td>{campaign.linkClicks}</td>
              {/* 
                We expect the backend to store cpm/cpc/ctr/amountSpent 
                or recalc them on retrieval. 
                Or if the backend does not store them, 
                we can show them from the state as well.
              */}
              <td>{moneyConvertor(campaign.cpm)}</td>
              <td>{moneyConvertor(campaign.cpc)}</td>
              <td>{Number(campaign.ctr ?? 0).toFixed(2)}%</td>
              <td>{campaign.clicks}</td>
              <td>{moneyConvertor(campaign.costPerResult)}</td>
              <td>{moneyConvertor(campaign.amountSpent)}</td>
              <td>
                <button
                  className="edit btn"
                  onClick={() => startEdit(campaign)}
                >
                  Edit
                </button>
                <button
                  className="delete btn"
                  onClick={() => deleteCampaign(campaign._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Campaign Form */}
      <div>
        <h3>Add Active Campaign</h3>
        <input
          type="text"
          name="campaignName"
          placeholder="Campaign Name"
          value={newCampaign.campaignName}
          onChange={handleNewCampaignChange}
        />
        <select
          name="status"
          value={newCampaign.status}
          onChange={handleNewCampaignChange}
        >
          <option value="Learning">Learning</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input
          type="number"
          name="budgetDaily"
          placeholder="Daily Budget"
          value={newCampaign.budgetDaily}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="results"
          placeholder="Results"
          value={newCampaign.results}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="reaches"
          placeholder="Reaches"
          value={newCampaign.reaches}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="impressions"
          placeholder="Impressions"
          value={newCampaign.impressions}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="linkClicks"
          placeholder="Link Clicks"
          value={newCampaign.linkClicks}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="clicks"
          placeholder="Clicks"
          value={newCampaign.clicks}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="costPerResult"
          placeholder="Cost Per Result"
          value={newCampaign.costPerResult}
          onChange={handleNewCampaignChange}
        />
        {/* Notice we removed cpm, cpc, ctr, and amountSpent inputs */}

        <input
          type="date"
          name="startingDate"
          placeholder="Starting Date"
          value={newCampaign.startingDate}
          onChange={handleNewCampaignChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleNewCampaignChange}
        />
        {newCampaign.imagePreview && (
          <img
            src={newCampaign.imagePreview}
            alt="Campaign Preview"
            style={{ maxWidth: "200px", display: "block", marginTop: "10px" }}
          />
        )}
        <button className="add btn" onClick={addCampaign}>
          Add Campaign
        </button>
      </div>

      {/* Edit Campaign Form */}
      {isEditing && editCampaign && (
        <div className="all-edit-form">
          <div className="edit-campaign-form">
            <div className="edit-campaign-inputs">
              <h3>Edit Campaign (ID={editCampaign._id})</h3>
              <label>
                Campaign Name
                <input
                  type="text"
                  name="campaignName"
                  placeholder="Campaign Name"
                  value={editCampaign.campaignName}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Status
                <select
                  name="status"
                  value={editCampaign.status}
                  onChange={handleEditCampaignChange}
                >
                  <option value="Learning">Learning</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label>
                Budget Daily
                <input
                  type="number"
                  name="budgetDaily"
                  placeholder="Daily Budget"
                  value={editCampaign.budgetDaily}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Results
                <input
                  type="number"
                  name="results"
                  placeholder="Results"
                  value={editCampaign.results}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Reaches
                <input
                  type="number"
                  name="reaches"
                  placeholder="Reaches"
                  value={editCampaign.reaches}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Impressions
                <input
                  type="number"
                  name="impressions"
                  placeholder="Impressions"
                  value={editCampaign.impressions}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Link Clicks
                <input
                  type="number"
                  name="linkClicks"
                  placeholder="Link Clicks"
                  value={editCampaign.linkClicks}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Clicks
                <input
                  type="number"
                  name="clicks"
                  placeholder="Clicks"
                  value={editCampaign.clicks}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Cost Per Result
                <input
                  type="number"
                  name="costPerResult"
                  placeholder="Cost Per Result"
                  value={editCampaign.costPerResult}
                  onChange={handleEditCampaignChange}
                />
              </label>
              {/* cpm, cpc, ctr, amountSpent are automatically recalculated */}
              <label>
                Starting Date
                <input
                  type="date"
                  name="startingDate"
                  placeholder="Starting Date"
                  value={editCampaign.startingDate}
                  onChange={handleEditCampaignChange}
                />
              </label>
              <label>
                Image
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEditCampaignChange}
                />
              </label>
            </div>
            {(editCampaign.imagePreview || editCampaign.imageUrl) && (
              <>
                <img
                  className="display-image-edit-form"
                  src={editCampaign.imagePreview || editCampaign.imageUrl}
                  alt="Campaign Preview"
                  style={{
                    maxWidth: "500px",
                    maxHeight: "500px",
                    display: "block",
                    marginTop: "10px",
                  }}
                />
              </>
            )}
          </div>
          <div className="edit-from-buttons">
            <button className="save btn" onClick={saveEdit}>
              Save Changes
            </button>
            <button className="cancel btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default FullCampaignsAdmin;
