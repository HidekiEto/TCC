import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";

export const useDataContext = () => useContext(DataContext);