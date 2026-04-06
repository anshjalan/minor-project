import { useContext } from "react";

import { AuthContext } from "../store/AuthContext.jsx";

export function useAuth() {
  return useContext(AuthContext);
}

