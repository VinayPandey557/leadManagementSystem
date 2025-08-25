import api from "./client";

export const register = (data) =>
  api.post("/auth/signup", data, { withCredentials: true });

export const login = (data) =>
  api.post("/auth/signin", data, { withCredentials: true });

export const logout = () =>
  api.post("/auth/signout", {}, { withCredentials: true });

export const getCurrentUser = () =>
  api.get("/auth/me", { withCredentials: true });
