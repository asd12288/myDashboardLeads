// FullCampaignsAdmin.jsx
import { useState, useEffect } from "react";
import { moneyConvertor } from "../../utilities/moneyConvertor";

// const BASE_URL = "http://localhost:30010";
const BASE_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production

// Note: we now track the 'File' separately from the existing URL
const initialState = {
  campaignName: "",
  status: "",
  budgetDaily: "",
  results: "",
  reaches: "",
  impressions: "",
  linkClicks: "",
  cpm: "",
  cpc: "",
  ctr: "",
  clicks: "",
  costPerResult: "",
  amountSpent: "",
  startingDate: "",
  imageFile: null, // <--- The actual File object
  imageUrl: null, // <--- The existing image path from server (if any)
  imagePreview: null, // <--- Local preview (string URL)
};

function FullCampaignsAdmin() {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState(initialState);
  const [editCampaign, setEditCampaign] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
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
      alert(`Error fetching campaigns: ${error.message}`);
    }
  };

  // Handle input changes for NEW campaign
  const handleNewCampaignChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      setNewCampaign((prev) => ({
        ...prev,
        imageFile: file, // store the actual File
        imagePreview: URL.createObjectURL(file), // local preview
      }));
    } else {
      setNewCampaign((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add a new campaign (including the image file, if any)
  const addCampaign = async () => {
    // Validate required fields

    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append all fields except the ones that are not meant to be directly sent
      Object.keys(newCampaign).forEach((key) => {
        if (["imagePreview", "imageFile"].includes(key)) return;
        formData.append(key, newCampaign[key]);
      });

      // Append the file if it exists
      if (newCampaign.imageFile) {
        formData.append("image", newCampaign.imageFile);
      }

      const response = await fetch(`${BASE_URL}/api/full-campaigns`, {
        method: "POST",
        headers: {
          role: localStorage.getItem("role"),
          // Do NOT set 'Content-Type' header here because we're sending FormData
        },
        body: formData,
      });

      if (response.ok) {
        alert("Campaign added successfully");
        setNewCampaign(initialState);
        fetchCampaigns();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
      alert("An error occurred while adding the campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare for editing: copy existing data into 'editCampaign' state
  const startEdit = (campaign) => {
    setEditCampaign({
      ...campaign,

      // The server's stored image path
      imageUrl: campaign.imageUrl || null,

      // Assume no new file chosen yet
      imageFile: null,
      imagePreview: null,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditCampaign(null);
    setIsEditing(false);
  };

  // Handle input changes for EDIT campaign
  const handleEditCampaignChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      setEditCampaign((prev) => ({
        ...prev,
        imageFile: file, // actual File
        imagePreview: URL.createObjectURL(file), // local preview
      }));
    } else {
      setEditCampaign((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Save changes to the edited campaign
  const saveEdit = async () => {
    if (!editCampaign) return;
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append all fields except local-only properties
      Object.keys(editCampaign).forEach((key) => {
        if (["imagePreview", "imageFile", "id"].includes(key)) return;
        formData.append(key, editCampaign[key]);
      });

      // If user chose a new file, append it
      if (editCampaign.imageFile) {
        formData.append("image", editCampaign.imageFile);
      }

      const response = await fetch(
        `${BASE_URL}/api/full-campaigns/${editCampaign.id}`,
        {
          method: "PUT",
          headers: {
            role: localStorage.getItem("role"),
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Campaign updated successfully");
        fetchCampaigns();
        cancelEdit();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("An error occurred while updating the campaign.");
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
        alert("Campaign deleted successfully");
        fetchCampaigns();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("An error occurred while deleting the campaign.");
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
            <tr key={campaign.id}>
              <td>{campaign.campaignName}</td>
              <td>{campaign.status}</td>
              <td>{moneyConvertor(campaign.budgetDaily)}</td>
              <td>{campaign.results}</td>
              <td>{campaign.reaches}</td>
              <td>{campaign.impressions}</td>
              <td>{campaign.linkClicks}</td>
              <td>{moneyConvertor(campaign.cpm)}</td>
              <td>{moneyConvertor(campaign.cpc)}</td>
              <td>{campaign.ctr}</td>
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
                  className="delete btn "
                  onClick={() => deleteCampaign(campaign.id)}
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
          placeholder="Status"
          value={newCampaign.status}
          onChange={handleNewCampaignChange}
        >
          <option value="Learning">Learning</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
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
          name="cpm"
          placeholder="CPM"
          value={newCampaign.cpm}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="cpc"
          placeholder="CPC"
          value={newCampaign.cpc}
          onChange={handleNewCampaignChange}
        />
        <input
          type="number"
          name="ctr"
          placeholder="CTR %"
          value={newCampaign.ctr}
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
        <input
          type="number"
          name="amountSpent"
          placeholder="Amount Spent"
          value={newCampaign.amountSpent}
          onChange={handleNewCampaignChange}
        />
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
        <button className="add btn " onClick={addCampaign}>
          Add Campaign
        </button>
      </div>

      {/* Edit Campaign Form */}
      {isEditing && editCampaign && (
        <div>
          <h3>Edit Campaign (ID={editCampaign.id})</h3>
          <label>
            Campaign name
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
              type="text"
              name="status"
              placeholder="Status"
              value={editCampaign.status}
              onChange={handleEditCampaignChange}
            >
              <option value="Learning">Learning</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
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
            CPM
            <input
              type="number"
              name="cpm"
              placeholder="CPM"
              value={editCampaign.cpm}
              onChange={handleEditCampaignChange}
            />
          </label>
          <label>
            CPC
            <input
              type="number"
              name="cpc"
              placeholder="CPC"
              value={editCampaign.cpc}
              onChange={handleEditCampaignChange}
            />
          </label>
          <label>
            CTR
            <input
              type="number"
              name="ctr"
              placeholder="CTR %"
              value={editCampaign.ctr}
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
          <label>
            Amount Spent
            <input
              type="number"
              name="amountSpent"
              placeholder="Amount Spent"
              value={editCampaign.amountSpent}
              onChange={handleEditCampaignChange}
            />
          </label>
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
          {/* 
            Show either a preview of the new file (if chosen) OR 
            the existing server URL if no new file is chosen 
          */}
          {(editCampaign.imagePreview || editCampaign.imageUrl) && (
            <img
              src={editCampaign.imagePreview || editCampaign.imageUrl}
              alt="Campaign Preview"
              style={{ maxWidth: "200px", display: "block", marginTop: "10px" }}
            />
          )}
          <button className="save btn" onClick={saveEdit}>
            Save Changes
          </button>
          <button className="cancel btn" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}

export default FullCampaignsAdmin;
