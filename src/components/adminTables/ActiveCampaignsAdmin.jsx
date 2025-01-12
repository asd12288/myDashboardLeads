// components/ActiveCampaignsAdmin.jsx
import { useEffect, useState, useContext } from "react";
import { BaseUrlContext } from "../../context/BaseUrlContext";

function ActiveCampaignsAdmin() {
  const BASE_URL = useContext(BaseUrlContext);

  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    id: "",
    name: "",
    amount: "",
    date: "",
  });
  const [editCampaign, setEditCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/active-campaigns`);
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching Active Campaigns", error);
    }
  };

  const addCampaign = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/active-campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (res.ok) {
        await fetchCampaigns();
        setNewCampaign({ id: "", name: "", amount: "", date: "" });
      }
    } catch (error) {
      console.error("Error adding campaign", error);
    }
  };

  const startEdit = (item) => {
    setEditCampaign({ ...item });
  };

  const cancelEdit = () => {
    setEditCampaign(null);
  };

  const saveEdit = async () => {
    if (!editCampaign) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/active-campaigns/${editCampaign.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editCampaign),
        }
      );
      if (res.ok) {
        await fetchCampaigns();
        setEditCampaign(null);
      }
    } catch (error) {
      console.error("Error updating campaign", error);
    }
  };

  const deleteCampaign = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/active-campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting campaign", error);
    }
  };

  return (
    <section className="admin-section">
      <h2>Active Campaigns</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => deleteCampaign(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add new Campaign Form */}
      <div style={{ marginTop: "1rem" }}>
        <h3>Add Active Campaign</h3>

        <input
          placeholder="Name"
          value={newCampaign.name}
          onChange={(e) =>
            setNewCampaign((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Amount"
          value={newCampaign.amount}
          onChange={(e) =>
            setNewCampaign((prev) => ({ ...prev, amount: e.target.value }))
          }
        />
        <input
          type="date"
          placeholder="Date"
          value={newCampaign.date}
          onChange={(e) =>
            setNewCampaign((prev) => ({ ...prev, date: e.target.value }))
          }
        />
        <button className="add" onClick={addCampaign}>
          Add
        </button>
      </div>

      {/* Edit form */}
      {editCampaign && (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h3>Edit Campaign (ID={editCampaign.id})</h3>
          <input
            placeholder="Name"
            value={editCampaign.name}
            onChange={(e) =>
              setEditCampaign((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            placeholder="Amount"
            value={editCampaign.amount}
            onChange={(e) =>
              setEditCampaign((prev) => ({ ...prev, amount: e.target.value }))
            }
          />
          <input
            type="date"
            placeholder="Date"
            value={editCampaign.date}
            onChange={(e) =>
              setEditCampaign((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <div>
            <button className="save" onClick={saveEdit}>
              Save
            </button>
            <button className="cancel" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ActiveCampaignsAdmin;
