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
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    
    const C = useContext(AppContext);
    useEffect(() => {
        if(C.AppReady){
            // Getingfriends
            DataService.GetFriends().then((res) => {
                setFriends(res.data);
            }).catch((err) => {
                console.log(err);
            });
            // setFriends(initialFreiendsData);
        }
    }, [C.AppReady]);
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Friends`
    const handleAccept = () => {
        DataService.AcceptFriendRequest().then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleDecline = () => {
        console.log("Decline")
    }


    return (
        <div id="Friends">
            <div id='header'>
                <h1>Friends</h1>
                <p>Manage your friends.</p>
            </div>
            <div id="friends-container">

                <div id="friends-list-container">
                    <h3>Friends List</h3>
                    {friends.length > 0 && <p>You have {friends.length} friends.</p>}
                    <div id="friends-list">
                        {friends.length === 0 && <p>You have no friends yet.</p>}
                        {friends.map((friend) => (
                            <Link key={friend.id} to={`/profile/${friend.id}`}>
                                <div id="friend">
                                    <div id='pfp' style={{ backgroundImage: `url(${friend.picture || placeholderpfp})`, height: 50, width:50 }}></div>
                                    <p id="username">{friend.username}</p>
                                </div>
                            </Link>
                        ))}

                    </div>
                </div>
                    <div id="friend-requests">
                        <h3>Friend Requests</h3>
                        <div id="friend-requests-list">
                            <div id="friend-request">
                                <div id="user">
                                    <div id="friend-box">
                                        <div id='pfp' style={{ backgroundImage: `url(${ placeholderpfp})`, height: 50, width:50 }}></div>
                                        <p id="username">Bob</p>
                                    </div>
                                    <div id="friend-request-buttons">
                                        <button className="button" onClick={handleAccept} id="accept">Accept</button>
                                        <button className="button" onClick={handleDecline} id="decline">Decline</button>
                                    </div>
                                </div>
                            </div>
                        </div>

            </div>
            </div>
        </div>
        
    )
}