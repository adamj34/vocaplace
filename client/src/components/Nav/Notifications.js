import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

export default function Notifications({ messages }) {
    const [showMessages, setShowMessages] = useState(false);

    return (
        <div id='notifications' onClick={()=>setShowMessages(!showMessages)} style={{marginRight:`${messages.length}px`}}>
            <FaBell id='icon' />
            {!showMessages && messages.length > 0 && (
                <p id='count'>{messages.length}</p>
            )}

            {showMessages && (
                <div id="messageWindow">
                    <p id="title">Notifications</p>
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
