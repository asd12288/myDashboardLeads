// components/CampaignsDetailsAdmin.jsx
import { useEffect, useState, useContext } from "react";
import { BaseUrlContext } from "../../context/BaseUrlContext";
import toast from "react-hot-toast";

function CampaignsDetailsAdmin() {
  const { BASE_URL } = useContext(BaseUrlContext);

  const [details, setDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    id: "",
    type: "",
    numAccounts: "",
    costPerMonth: "",
  });
  const [editDetail, setEditDetail] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/campaigns-details`, {
        headers: {
          role: localStorage.getItem("role"),
        },
      });
      const data = await res.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching Campaigns Details", error);
    }
  };

  const addDetail = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/campaigns-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role: localStorage.getItem("role"),
        },
        body: JSON.stringify(newDetail),
      });
      if (res.ok) {
        await fetchDetails();
        setNewDetail({ id: "", type: "", numAccounts: "", costPerMonth: "" });
        toast.success("Account Added!");
      }
    } catch (error) {
      console.error("Error adding detail", error);
    }
  };

  const startEdit = (item) => {
    setEditDetail({ ...item });
  };

  const cancelEdit = () => {
    setEditDetail(null);
  };

  const saveEdit = async () => {
    if (!editDetail) return;
    // if there's no real ID, you may have to pass index or something else
    const editId = editDetail._id || "";
    try {
      const res = await fetch(`${BASE_URL}/api/campaigns-details/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          role: localStorage.getItem("role"),
        },
        body: JSON.stringify(editDetail),
      });
      if (res.ok) {
        await fetchDetails();
        setEditDetail(null);
      }
    } catch (error) {
      console.error("Error updating detail", error);
    }
  };

  const deleteDetail = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/campaigns-details/${id}`, {
        method: "DELETE",
        headers: { role: localStorage.getItem("role") },
      });
      if (res.ok) {
        fetchDetails();
        toast.success("Account Deleted");
      }
    } catch (error) {
      console.error("Error deleting detail", error);
    }
  };

  return (
    <section className="admin-section">
      <h2>Account Details</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Type</th>
            <th>#Accounts</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, idx) => {
            const rowId = item._id ?? idx; // fallback to index if item.id doesn’t exist
            return (
              <tr key={rowId}>
                <td>{item.type}</td>
                <td>{item.numAccounts}</td>
                <td>{item.costPerMonth}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => startEdit({ ...item, _id: rowId })}
                  >
                    Edit
                  </button>
                  <button
                    className="delete btn"
                    onClick={() => deleteDetail(rowId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add new detail */}
      <div style={{ marginTop: "1rem" }}>
        <h3>Add Detail</h3>

        <input
          placeholder="Type"
          value={newDetail.type}
          onChange={(e) =>
            setNewDetail((prev) => ({ ...prev, type: e.target.value }))
          }
        />
        <input
          placeholder="Num Accounts"
          value={newDetail.numAccounts}
          onChange={(e) =>
            setNewDetail((prev) => ({ ...prev, numAccounts: e.target.value }))
          }
        />
        <input
          placeholder="Cost/Month"
          value={newDetail.costPerMonth}
          onChange={(e) =>
            setNewDetail((prev) => ({ ...prev, costPerMonth: e.target.value }))
          }
        />
        <button className="add" onClick={addDetail}>
          Add
        </button>
      </div>

      {/* Edit detail */}
      {editDetail && (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h3>Edit Detail (ID={editDetail._id})</h3>
          <input
            placeholder="Type"
            value={editDetail.type}
            onChange={(e) =>
              setEditDetail((prev) => ({ ...prev, type: e.target.value }))
            }
          />
          <input
            placeholder="Num Accounts"
            value={editDetail.numAccounts}
            onChange={(e) =>
              setEditDetail((prev) => ({
                ...prev,
                numAccounts: e.target.value,
              }))
            }
          />
          <input
            placeholder="Cost/Month"
            value={editDetail.costPerMonth}
            onChange={(e) =>
              setEditDetail((prev) => ({
                ...prev,
                costPerMonth: e.target.value,
              }))
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

export default CampaignsDetailsAdmin;
