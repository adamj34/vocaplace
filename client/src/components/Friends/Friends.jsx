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
            // DataService.GetFriends().then((res) => {
            //     setFriends(res.data);
            // }).catch((err) => {
            //     console.log(err);
            // });
            setFriends(initialFreiendsData);
        }
    }, [C.AppReady]);
    if (!keycloak.authenticated) {return <LoginRequired/>}

    document.title = `VocaPlace | Friends`


    return (
        <div id="Friends">
            <div id='header'>
                <h1>Friends</h1>
                <p>Manage your friends.</p>
            </div>
            <div id="friends-container">

                <div id="friends-list-container">
                    <h2>Friends List</h2>
                    <div id="friends-list">
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
                        <h2>Friend Requests</h2>
                        <div id="friend-requests-list">
                            <div id="friend-request">
                                <div id="request-manage">
                                <div id="friend">
                                    <div id='pfp' style={{ backgroundImage: `url(${ placeholderpfp})`, height: 50, width:50 }}></div>
                                    <p id="username">Bob</p>
                                </div>
                                    <div id="friend-request-buttons">
                                        <button className="button" id="accept">Accept</button>
                                        <button className="button" id="decline">Decline</button>
                                    </div>

                                </div>
                            </div>
                        </div>

            </div>
            </div>
        </div>
        
    )
}