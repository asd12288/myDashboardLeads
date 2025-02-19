import { createContext } from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// const DEV_BASE_URL = "http://localhost:3001";
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
        setMAINTENANCE_MODE(data.status === "maintenance");
      } catch (error) {
        console.error("Error fetching app status", error);
      }
    };
    fetchAppStatus();
  }, [BASE_URL]);

  const toggleMaintenanceMode = async () => {
    const newStatus = MAINTENANCE_MODE ? "active" : "maintenance";
    try {
      const res = await fetch(`${BASE_URL}/api/app-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          role: localStorage.getItem("role"),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }

      const resData = await res.json();
      console.log("New status:", resData.status);
      setMAINTENANCE_MODE(resData.status === "maintenance");
      toast.success("Maintenance mode updated successfully");
    } catch (error) {
      console.error("Error updating app status:", error);
      toast.error("An error occurred while updating app status.");
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
