import React, { createContext, useContext, useState, ReactNode } from "react";

interface StoreContextType {
  pipMode: boolean;
  setPipMode: (mode: boolean) => void;
  pipVideoId: string;
  setPipVideoId: (id: string) => void;
  pipVideoUrl: string;
  setPipVideoUrl: (url: string) => void;
  pipVideoTitle: string;
  setPipVideoTitle: (title: string) => void;
  pipCurrentTime: number;
  setPipCurrentTime: (time: number) => void;
  pipVideoChannelName: string;
  setPipVideoChannelName: (name: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [pipMode, setPipMode] = useState(false);
  const [pipVideoId, setPipVideoId] = useState("");
  const [pipVideoUrl, setPipVideoUrl] = useState("");
  const [pipVideoTitle, setPipVideoTitle] = useState("");
  const [pipCurrentTime, setPipCurrentTime] = useState(0);
  const [pipVideoChannelName, setPipVideoChannelName] = useState("");

  return (
    <StoreContext.Provider
      value={{
        pipMode,
        setPipMode,
        pipVideoId,
        setPipVideoId,
        pipVideoUrl,
        setPipVideoUrl,
        pipVideoTitle,
        setPipVideoTitle,
        pipCurrentTime,
        setPipCurrentTime,
        pipVideoChannelName,
        setPipVideoChannelName,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
