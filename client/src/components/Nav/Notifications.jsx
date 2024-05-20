import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import DataService from "../../DataService";
import { usePopup } from "../Popup.tsx";
import {socket} from "../../socket";

function BellOffset(unreadmessages) {
    if (unreadmessages.length > 0) {
        return (unreadmessages.length.toString().length)*6
    } else {
        return 0
    }
    
}

export default function Notifications() {
    const [ShowMessages, SetShowMessages] = useState(false);
    const [Messages, SetMessages] = useState([]);
    const C = useContext(AppContext);
    const popup = usePopup()

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetNotifications(C.UserData.id).then(res => {
                SetMessages(res.data);
            }).catch(e => {
                console.error(e);
                popup('Error', 'Failed to load notifications due to an unknown error.');
            });
    
            const handleNewNotification = notification => {
                SetMessages(prevMessages => {
                    if (!prevMessages.some(msg => msg.id === notification.id)) {
                        return [notification, ...prevMessages];
                    }
                    return prevMessages;
                });
            };
    
            const handleDeleteNotification = notificationId => {
                SetMessages(prevMessages => prevMessages.filter(msg => msg.id !== notificationId));
            };
    
            socket.on('newNotification', handleNewNotification);
            socket.on('deleteNotification', handleDeleteNotification);
    
            // return () => {
            //     socket.off('newNotification', handleNewNotification);
            //     socket.off('deleteNotification', handleDeleteNotification);
            // };
        }
    }, [C.AppReady, C.UserData.id, popup]);

    const handleDelete = (id) => {
            
            DataService.DeleteNotification(id).then((res) => {
                SetMessages(prevMessages => {
                    const filteredMessages = prevMessages.filter(message => message.id !== id);
                    return filteredMessages;
                });
            }).catch(e => {
                console.error(e)
                popup('Error', 'Failed to delete notification due to an unknown error.')
            })
            
        }
    const handleClearAll = () => {    
        DataService.DeleteNotifications(C.UserData.id).then((res) => {
            SetMessages([])
        }).catch(e => {
            console.error(e)
            popup('Error', 'Failed to delete notifications due to an unknown error.')
        })
    }

    const handleMarkAsRead = (id) => {
        DataService.MarkNotificationAsRead(id).then((res) => {
            SetMessages(Messages.map((msg) => msg.id === id ? {...msg, read: true} : msg))
        }).catch(e => {
            console.error(e)
            popup('Error', 'Failed to mark notification as read due to an unknown error.')
        })
    }

    const handleMarkAllAsRead = () => {
        DataService.MarkAllNotificationsAsRead(C.UserData.id).then((res) => {
            SetMessages(Messages.map((msg) => ({...msg, read: true})))
        }).catch(e => {
            console.error(e)
            popup('Error', 'Failed to mark notifications as read due to an unknown error.')
        })
    }



        return (
        <aside id='notifications'  style={{ marginRight: `${BellOffset(Messages.filter(x=>!x.read))}px` }} className={ShowMessages ? 'open' : ''}>
            <Icon icon='bell' onClick={() => SetShowMessages(!ShowMessages)} />
            {Messages.filter((x)=>!x.read).length > 0 && 
                <p id='count'>{Messages.length}</p>
            }

            {ShowMessages && 
            //onMouseLeave={() => SetShowMessages(false) }
                <section id="window" > 
                    <p id="title">Notifications</p>
                    <div id="messages">
                        {Messages.map((msg) => (
                            <div key={msg.id} id='message' >
                                <div id="message-content" onClick={()=>handleMarkAsRead(msg.id)}>
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
                                {msg.notification_type === 'group_admin_received' &&
                                    <Link to={'/groups/' + msg.group_id}>
                                        You have been appointed the new group owner of <span className="color">{msg.group_name}</span>.
                                    </Link>
                                }
                                </div>
                                
                                <Icon icon='trash' onClick={() => handleDelete(msg.id)} />
                            </div>
                        ))}
                        {Messages.length === 0 && <p id='empty'>There are no new notifications.</p>}
                        {Messages.length > 0 && 
                            <div id='bottom'>
                                <p id='markread'onClick={handleMarkAllAsRead}>Mark all as read</p>
                                <p id='clear' onClick={handleClearAll}>Clear all</p>
                            </div>}
                    </div>
                </section>
            }
        </aside>
    );
}
