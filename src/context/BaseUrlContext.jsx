import { use } from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";

const DEV_BASE_URL = "http://localhost:30010";
const PROD_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production\\

export const BaseUrlContext = createContext();

export function BaseUrlProvider({ children }) {
  const [MAINTENANCE_MODE, setMAINTENANCE_MODE] = useState(false);

  const BASE_URL = PROD_URL;

  useEffect(() => {
    const fetchAppStatus = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/app-status`, {
          headers: {
            role: localStorage.getItem("role"),
          },
        });
        if (!res.ok) {
          console.error("Error fetching app status");
          return;
        }
        const data = await res.json();
        setMAINTENANCE_MODE(
          data.status === "maintenance" || data.status === "active"
        );
      } catch (error) {
        console.error("Error fetching app status", error);
      }
    };
    fetchAppStatus();
  }, [BASE_URL]);

  const toggleMaintenanceMode = async () => {
    const newStatus = !MAINTENANCE_MODE ? "maintenance" : "active";
    try {
      const res = await fetch(`${BASE_URL}/api/app-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          role: localStorage.getItem("role"),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const resData = await res.json();
      setMAINTENANCE_MODE(newStatus === "maintenance");
      alert("App status updated successfully");
    } catch (error) {
      console.error("Error updating app status:", error);
      alert("An error occurred while updating app status.");
    }
  };

  return (
    <BaseUrlContext.Provider
      value={{
        BASE_URL,
        MAINTENANCE_MODE,
        setMAINTENANCE_MODE,
        toggleMaintenanceMode,
      }}
    >
      {children}
    </BaseUrlContext.Provider>
  );
}
