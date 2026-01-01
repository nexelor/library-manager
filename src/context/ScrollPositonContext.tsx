import { createContext, useContext, useRef } from "react";

type ScrollContextType = {
    setScroll: (key: string, value: number) => void;
    getScroll: (key: string) => number;
};

const ScrollPositionContext = createContext<ScrollContextType>({
    setScroll: () => {},
    getScroll: () => 0,
});

export const ScrollPositionProvider = ({ children }: { children: React.ReactNode }) => {
    const positions = useRef<Record<string, number>>({});

    const setScroll = (key: string, value: number) => {
        positions.current[key] = value;
    };

    const getScroll = (key: string) => positions.current[key] ?? 0;

    return (
        <ScrollPositionContext.Provider value={{ setScroll, getScroll }}>
            {children}
        </ScrollPositionContext.Provider>
    );
};

export const useScrollPosition = () => useContext(ScrollPositionContext);