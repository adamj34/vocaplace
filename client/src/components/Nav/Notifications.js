import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

export default function Notifications({ messages }) {
    const [showMessages, setShowMessages] = useState(false);

    const handleClick = () => {
        setShowMessages(!showMessages);
    };

    return (
        <div id='notifications' >
            
            <div onClick={handleClick}>
                <FaBell id='icon' />
            </div>
            
            {!showMessages && messages.length > 0 && (
                <p id='messages'>{messages.length}</p>
            )}

            {showMessages && (
                <div id="messageWindow">
                    <p id="alerts">Notifications</p>
                    <div id="message-scroll">
                    {messages.map((message, index) => (
                        <div key={index} id='message'>
                            {message}
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
}
