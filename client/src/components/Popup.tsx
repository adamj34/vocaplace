import React, { createContext, useContext, useState, ReactNode } from "react";
import Icon from "./Icon";

type PopupFunction = (title: string, content: string) => void;

const PopupContext = createContext<PopupFunction | undefined>(undefined);

export const usePopup = (): PopupFunction => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};

export const PopupProvider: React.FC<{children:ReactNode}> = ({ children }) => {
    const [message, setMessage] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [shown, setShown] = useState<boolean>(false);
    const [key, setKey] = useState<number>(0);

    const popup: PopupFunction = (title, content) => {
        setTitle(title);
        setMessage(content);
        setShown(true);
        setKey(k=>k+1)
    };

    return (
        <PopupContext.Provider value={popup}>
            {children}
            <div id="Popup" className={shown ? "shown" : ""} key={key}>
                <header>
                    <p id="title">{title}</p>
                    <Icon
                        icon="x"
                        className="hovertext"
                        onClick={() => setShown(false)}
                    />
                </header>
                <p id="message">{message}</p>
            </div>
        </PopupContext.Provider>
    );
};
