import { useContext } from "react";
import { DbContext } from "../contexts/DbContext";

export const useDbContext = () => {
  const ctx = useContext(DbContext);
  if (!ctx) throw new Error("useDbContext deve ser usado dentro de um DbProvider");
  return ctx;
};