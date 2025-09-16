import { createContext } from "react";

interface DbContextType {

}
export const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <DbContext.Provider value={{}}>
            {children}
        </DbContext.Provider>
    );
};

