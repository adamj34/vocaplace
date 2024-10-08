import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import { AppContext } from "../../App";
import DataService from "../../DataService";
import { usePopup } from "../Popup.tsx";

const placeholder = [
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
];

export function Friends() {
    document.title = `VocaPlace | Friends`
    const C = useContext(AppContext);
    const [Friends, SetFriends] = useState([]);
    const [FriendRequests, SetFriendRequests] = useState([]);
    const [Updated, SetUpdated] = useState(false);
    const [SearchQuery, SetSearchQuery] = useState('');
    const popup = usePopup()
    
    useEffect(() => {
        if(C.AppReady && !Updated){
            DataService.GetFriends().then((res) => {
                SetFriends(res.data);
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to load friends due to an unknown error.")
            })
            DataService.GetFriendRequests().then((res) => {
                SetFriendRequests(res.data);
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to load friend requests due to an unknown error.")
            })
            SetUpdated(true);
        }
    }, [C.AppReady,Updated]);

    function AcceptFriendRequest(userid) {
        DataService.AcceptFriendRequest(userid).then(() => {
            SetUpdated(false);
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to accept friend request due to an unknown error.")
        })
    }
    function DeclineFriendRequest(userid) {
        DataService.DeleteFriendRequest(userid).then(() => {
            SetUpdated(false)
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to delete friend request due to an unknown error.")
        })
    }
    function RemoveFriend(userid, username) {
        if (window.confirm(`Are you sure you want to remove ${username} from friends?`)) {
            DataService.DeleteFriend(userid).then(() => {
                SetUpdated(false);   
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to delete friend due to an unknown error.")
            })
        }
    }


    return (
        <div id="Friends">
            <div id='header'>
                <h1>Friends</h1>
                <p>Manage your friends.</p>
            </div>

            
            <div id="content">
                <div id="friends">
                    {Friends.length === 0 && <p id="nofriends">You have no friends yet.</p>}
                    {Friends.length > 0 && <input className="input" placeholder="Filter friends" onChange={e => SetSearchQuery(e.target.value)}></input>}
                    <div id="friendlist">
                        {Friends.map((friend) => (
                            friend.username.toLowerCase().includes(SearchQuery.toLowerCase()) && <div key={friend.id} id="friend">
                                <Link to={`/profile/${friend.id}`}>
                                    <div id="friend-box">
                                        <div id='pfp' style={{ backgroundImage: `url(${friend.picture || placeholderpfp})`, height: 50, width: 50 }}></div>
                                        <p id="username">{friend.username}</p>
                                    </div>
                                </Link>
                                <div id="buttons">
                                    <button className="button light" onClick={()=>RemoveFriend(friend.id, friend.username)} id="remove">Remove</button>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>
                    <div id="friend-requests">
                        { FriendRequests.length > 0 && <h3>Pending Friend Requests {FriendRequests.length > 0 ? `(${FriendRequests.length})` : ''}</h3>}
                        {FriendRequests.length === 0 && <p>You have no friend requests.</p>}
                        <div id="friend-requests-list">
                        { FriendRequests.map((user) => (
                            <div key={user.id} id="request">
                                <div id="user">
                                    <Link  to={`/profile/${user.id}`}>
                                        <div id="friend-box">
                                            <div id='pfp' style={{ backgroundImage: `url(${ user.picture||placeholderpfp})`, height: 50, width:50 }}></div>
                                            <p id="username">{user.username}</p>
                                        </div>
                                    </Link>
                                    <div id="buttons">
                                        <button className="button" onClick={() => AcceptFriendRequest(user.id)} id="accept">Accept</button>
                                        <button className="button light" onClick={() => DeclineFriendRequest(user.id)} id="decline">Decline</button>
                                    </div>
                                </div>
                            </div>))}
                        </div>

            </div>
            </div>
        </div>
        
    )
}