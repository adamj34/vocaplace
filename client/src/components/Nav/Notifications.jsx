import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import DataService from "../../DataService";
import { usePopup } from "../Popup.tsx";
import {socket} from "../../socket";



export default function Notifications() {
    const [ShowMessages, SetShowMessages] = useState(false);
    const [Messages, SetMessages] = useState([]);
    const C = useContext(AppContext);
    const popup = usePopup()

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetNotifications(C.UserData.id).then((res) => {
                SetMessages(res.data)
                socket.on('newNotification', (notification) => {
                    console.log(notification);
                    SetMessages(Messages.concat(notification))
                });
                console.log(Messages);
            }).catch(e => {
                console.log(e)
                popup('Error', 'Failed to load notifications due to an unknown error.')
            }) 

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
                        {Messages.map((msg) => (
                            <p key={msg.id} id='message' onClick={()=>SetMessages(Messages.filter((x,i2)=>msg.id!==i2))}>
                                {msg.notification_type === 'group_request_accepted' && 
                                    <Link to={'/groups/' + msg.group_id}>
                                        Your request to join <span className="color">{msg.group_name}</span> has been accepted.
                                    </Link>
                                }
                                {msg.notification_type === 'friend_request_accepted' && 
                                    <Link to={'/profile/' + msg.friend_id}>
                                        <span className="color">{msg.friend_name}</span> has accepted your friend request.
                                    </Link> 
                                }
                                {msg.notification_type === 'new_friend_request' && 
                                    <Link to={'/profile/' + msg.friend_id}><span className="color">{msg.friend_name}</span> has sent you a friend request.</Link>
                                }
                                {msg.notification_type === 'streak_reminder' &&
                                    <span className="disabled">Don't forget about your streak!</span>
                                }
                                {msg.notification_type === 'group_name_change' &&
                                    <Link to={'/groups/' + msg.group_id}>
                                        Group {msg.old_group_name} has changed name to <span className="color">{msg.group_name}</span>.
                                    </Link>
                                }
                                {msg.notification_type === 'group_admin' &&
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
