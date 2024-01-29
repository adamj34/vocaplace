import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import { AppContext } from "../../App";
import DataService from "../../DataService";

const initialFreiendsData = [
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
    { username: "Bill", points: 117 },
];

export function Friends() {
    const { keycloak } = useKeycloak();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    
    const C = useContext(AppContext);
    useEffect(() => {
        if(C.AppReady && !isUpdated){
            // Getingfriends
            DataService.GetFriends().then((res) => {
                setFriends(res.data);
            }).catch((err) => {
                console.log(err);
            });
            // Getting friend requests
            DataService.GetFriendRequests().then((res) => {
                setFriendRequests(res.data);
            }).catch((err) => {
                console.log(err);
            });
            setIsUpdated(true);
        }
    }, [C.AppReady,isUpdated]);
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Friends`
    const handleAccept = (userId) => {
        DataService.AcceptFriendRequest(userId).then((res) => {
            setIsUpdated(false);
            
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleDecline = () => {
        console.log("Decline")
    }
    const handleRemove = (userId) => {
        DataService.DeleteFriend(userId).then((res) => {
            setIsUpdated(false);
            
        }
        ).catch((err) => {
            console.log(err)
        })

    }


    return (
        <div id="Friends">
            <div id='header'>
                <h1>Friends</h1>
                <p>Manage your friends.</p>
            </div>
            <div id="friends-container">

                <div id="friend-requests">
                    <h3>Friends List</h3>
                    {friends.length > 0 && <p>You have {friends.length} friends.</p>}
                    <div id="friend-requests-list">
                        {friends.length === 0 && <p>You have no friends yet.</p>}
                        {friends.map((friend) => (
                            <div key={friend.id} id="friend-request">
                                <div id="user">
                                <Link to={`/profile/${friend.id}`}>
                                    <div  id="friend-box">
                                        <div id='pfp' style={{ backgroundImage: `url(${friend.picture || placeholderpfp})`, height: 50, width: 50 }}></div>
                                        <p id="username">{friend.username}</p>
                                    </div>
                                </Link>
                                <div id="friend-request-buttons">

                                    <button className="button" onClick={()=>handleRemove(friend.id)} id="remove">Remove</button>
                                </div>
                                </div>
                            </div>
                    ))}

                    </div>
                </div>
                    <div id="friend-requests">
                        <h3>Friend Requests</h3>
                        <div id="friend-requests-list">
                        { friendRequests.length === 0 && <p>You have no friend requests.</p>}
                        { friendRequests.map((user) => (
                            <div key={user.id} id="friend-request">
                                <div id="user">
                                        <Link  to={`/profile/${user.id}`}>
                                    <div id="friend-box">
                                        <div id='pfp' style={{ backgroundImage: `url(${ user.picture||placeholderpfp})`, height: 50, width:50 }}></div>
                                        <p id="username">{user.username}</p>
                                    </div>
                                        </Link>
                                    <div id="friend-request-buttons">
                                        <button className="button" onClick={() => handleAccept(user.id)} id="accept">Accept</button>
                                        <button className="button" onClick={handleDecline} id="decline">Decline</button>
                                    </div>
                                </div>
                            </div>))}
                        </div>

            </div>
            </div>
        </div>
        
    )
}