import { createContext } from "react";
import { useState } from "react";

const DEV_BASE_URL = "http://localhost:30010";
const PROD_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production\\

export const BaseUrlContext = createContext();

export function BaseUrlProvider({ children }) {
  const [MAINTENANCE_MODE, setMAINTENANCE_MODE] = useState(false);
  
  const BASE_URL = PROD_URL;

  return (
    <BaseUrlContext.Provider
      value={{ BASE_URL, MAINTENANCE_MODE, setMAINTENANCE_MODE }}
    >
      {children}
    </BaseUrlContext.Provider>
  );
}
