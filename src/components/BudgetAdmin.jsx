// components/BudgetAdmin.jsx
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";

function BudgetAdmin() {
  const [budgetData, setBudgetData] = useState([]);
  const [newBudgetItem, setNewBudgetItem] = useState({
    id: "",
    date: "",
    amount: "",
  });

  // This will hold the item we’re editing (if any).
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/budget", {
        headers: {
          role: localStorage.getItem("role"),
        },
      });
      const data = await res.json();
      setBudgetData(data);
    } catch (error) {
      console.error("Error fetching Budget Data", error);
    }
  };

  const addBudgetItem = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role: localStorage.getItem("role"),
        },
        body: JSON.stringify(newBudgetItem),
      });
      if (res.ok) {
        // Refresh the list and reset the form
        await fetchBudgetData();
        setNewBudgetItem({ id: "", date: "", amount: "" });
      }
    } catch (error) {
      console.error("Error adding Budget Item", error);
    }
  };

  // Start editing an item (populate edit form)
  const startEdit = (item) => {
    setEditItem({ ...item }); // copy to avoid mutating original
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditItem(null);
  };

  // Commit edit changes to server
  const saveEdit = async () => {
    if (!editItem) return;
    try {
      const res = await fetch(`${BASE_URL}/api/budget/${editItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          role: localStorage.getItem("role"),
        },
        body: JSON.stringify(editItem),
      });
      if (res.ok) {
        await fetchBudgetData();
        setEditItem(null);
      }
    } catch (error) {
      console.error("Error updating Budget Item", error);
    }
  };

  const deleteBudgetItem = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/budget/${id}`, {
        method: "DELETE",
        headers: { role: localStorage.getItem("role") },
      });
      if (res.ok) {
        fetchBudgetData();
      }
    } catch (error) {
      console.error("Error deleting Budget Item", error);
    }
  };

  return (
    <section className="admin-section">
      <h2>Budget Data</h2>

      {/* TABLE of existing budget items */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgetData.map((item) => (
            <tr key={item.id + item.date}>
              <td>{item.date}</td>
              <td>{item.amount}</td>
              <td>
                <button className="edit" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => deleteBudgetItem(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to Add a new item */}
      <div style={{ marginTop: "1rem" }}>
        <h3>Add Budget Item</h3>

        <input
          type="date"
          placeholder="Date"
          value={newBudgetItem.date}
          onChange={(e) =>
            setNewBudgetItem((prev) => ({ ...prev, date: e.target.value }))
          }
        />
        <input
          placeholder="Amount"
          value={newBudgetItem.amount}
          onChange={(e) =>
            setNewBudgetItem((prev) => ({ ...prev, amount: e.target.value }))
          }
        />
        <button className="add" onClick={addBudgetItem}>
          Add
        </button>
      </div>

      {/* Form to EDIT an existing item */}
      {editItem && (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h3>Edit Budget Item (ID = {editItem.id})</h3>
          <input
            placeholder="Date"
            type="date"
            value={editItem.date}
            onChange={(e) =>
              setEditItem((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <input
            placeholder="Amount"
            value={editItem.amount}
            onChange={(e) =>
              setEditItem((prev) => ({ ...prev, amount: e.target.value }))
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

export default BudgetAdmin;
