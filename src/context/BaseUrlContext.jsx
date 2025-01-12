import { createContext } from "react";

// const DEV_BASE_URL = "http://localhost:30010";
const PROD_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production

export const BaseUrlContext = createContext();

export function BaseUrlProvider({ children }) {
  const baseUrl = DEV_BASE_URL;
  return (
    <BaseUrlContext.Provider value={baseUrl}>
      {children}
    </BaseUrlContext.Provider>
  );
}
