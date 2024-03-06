import React, { useState } from "react";
import Icon from "../Icon";

export default function Notifications({ messages }) {
    const [ShowMessages, SetShowMessages] = useState(false);

    return (
        <aside id='notifications' onClick={() => SetShowMessages(!ShowMessages)} style={{ marginRight: `${messages.length}px` }} className={ShowMessages ? 'open' : ''}>
            <Icon icon='bell'/>
            {!ShowMessages && messages.length > 0 && 
                <p id='count'>{messages.length}</p>
            }

            {ShowMessages && 
                <section id="window" onMouseLeave={() => SetShowMessages(false) }>
                    <p id="title">Notifications</p>
                    <div id="messages">
                        {messages.map((message, index) => (
                            <p key={index} id='message'>{message}</p>
                        ))}
                    </div>
                </section>
            }
        </aside>
    );
}
