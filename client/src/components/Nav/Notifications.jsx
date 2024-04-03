import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import DataService from "../../DataService";
import { usePopup } from "../Popup.tsx";

const notifications = [ // placeholder
    { type: 'group_request_accepted', group_name: 'Englovers', group_id: '1' },
    { type: 'friend_request_accepted', friend_name: 'Bajojajo', friend_id: 'dd0ac737-5534-46fd-8715-a28634f8c86b' },
    { type: 'new_friend_request', friend_name: 'Bajojajo', friend_id: 'dd0ac737-5534-46fd-8715-a28634f8c86b' },
    { type: 'streak_reminder' },
    { type: 'group_name_change', group_name: 'Enghaters', old_group_name: 'Englovers', group_id: '1' },
    { type: 'group_admin', group_name: 'Englovers', group_id: '1' },
]

export default function Notifications() {
    const [ShowMessages, SetShowMessages] = useState(false);
    const [Messages, SetMessages] = useState([]);
    const C = useContext(AppContext);
    const popup = usePopup()

    useEffect(() => {
        if (C.AppReady) {
            // DataService.GetNotifications().then((res) => {
            //     SetMessages(res.data)
            //     console.log(res.data)
            // }).catch(e => {
            //     console.log(e)
            //     popup('Error', 'Failed to load notifications due to an unknown error.')
            // }) 
            SetMessages(notifications) // temporary

        }
    }, [C.AppReady])

    return (
        <aside id='notifications' onClick={() => SetShowMessages(!ShowMessages)} style={{ marginRight: `${Messages.length}px` }} className={ShowMessages ? 'open' : ''}>
            <Icon icon='bell'/>
            {!ShowMessages && Messages.length > 0 && 
                <p id='count'>{Messages.length}</p>
            }

            {ShowMessages && 
            //onMouseLeave={() => SetShowMessages(false) }
                <section id="window" > 
                    <p id="title">Notifications</p>
                    <div id="messages">
                        {Messages.map((msg, i) => (
                            <p key={i} id='message' onClick={()=>SetMessages(Messages.filter((x,i2)=>i!==i2))}>
                                {msg.type === 'group_request_accepted' && 
                                    <Link to={'/groups/' + msg.group_id}>
                                        Your request to join <span className="color">{msg.group_name}</span> has been accepted.
                                    </Link>
                                }
                                {msg.type === 'friend_request_accepted' && 
                                    <Link to={'/profile/' + msg.friend_id}>
                                        <span className="color">{msg.friend_name}</span> has accepted your friend request.
                                    </Link> 
                                }
                                {msg.type === 'new_friend_request' && 
                                    <Link to={'/profile/' + msg.friend_id}><span className="color">{msg.friend_name}</span> has sent you a friend request.</Link>
                                }
                                {msg.type === 'streak_reminder' &&
                                    <span className="disabled">Don't forget about your streak!</span>
                                }
                                {msg.type === 'group_name_change' &&
                                    <Link to={'/groups/' + msg.group_id}>
                                        Group {msg.old_group_name} has changed name to <span className="color">{msg.group_name}</span>.
                                    </Link>
                                }
                                {msg.type === 'group_admin' &&
                                    <Link to={'/groups/' + msg.group_id}>
                                        You have been appointed the new group owner of <span className="color">{msg.group_name}</span>.
                                    </Link>
                                }
                            </p>
                        ))}
                        {Messages.length === 0 && <p id='empty'>There are no new notifications.</p>}
                        {Messages.length > 0 && <p id='clear' onClick={()=>SetMessages([])}>Clear all</p>}
                    </div>
                </section>
            }
        </aside>
    );
}
