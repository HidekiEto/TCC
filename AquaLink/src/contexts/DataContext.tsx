import React, { createContext, useState, useEffect } from "react";

interface DataContextType {
  volume: number | null;
  volumeAnterior: number | null;
  consumo: number | null;
  consumoAcumulado: number | null;
  setVolume: (v: number) => void;
  setVolumeAnterior: (v: number) => void;
  setConsumo: (c: number) => void;
  setConsumoAcumulado: (c: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [volume, setVolume] = useState<number | null>(null);
  const [volumeAnterior, setVolumeAnterior] = useState<number | null>(null);
  const [consumo, setConsumo] = useState<number | null>(null);
  const [consumoAcumulado, setConsumoAcumulado] = useState<number>(0);

  useEffect(() => {
    
  }, [volume, volumeAnterior, consumo, consumoAcumulado]);

  return (
    <DataContext.Provider value={{ volume, setVolume, volumeAnterior, setVolumeAnterior, consumo, setConsumo, consumoAcumulado, setConsumoAcumulado }}>
      {children}
    </DataContext.Provider>
  );
};