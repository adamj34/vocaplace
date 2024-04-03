import { useState, useContext, useEffect } from 'react';
import DataService from "../../DataService";
import { AppContext } from '../../App';
import { Link } from 'react-router-dom';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import { usePopup } from '../Popup.tsx';



const meAndFriends = [
    { username: 'Joe', points: 150 },
    { username: 'Bill', points: 117 },
    { username: 'Anne', points: 88 },
];

// const initialTopUsersData = [
//     { username: "Addam", points: 308 },
//     { username: "George", points: 223 },
//     { username: "Bob", points: 208 },
//     { username: "Joe", points: 150 },
//     { username: "Bill", points: 117 },
// ];

const initialTopGroupsData = [
    { username: "Englovers", points: 1639 },
    { username: "WeAreFriends", points: 1084 },
    { username: "THEBEST", points: 881 },
];




export function Ranking() {
    document.title = `VocaPlace | Ranking`;
    const C = useContext(AppContext);
    const popup = usePopup()
    const [Friends, SetFriends] = useState([]);
    const [Users, SetUsers] = useState([]);
    const [Groups, SetGroups] = useState([]);
    const [Streak, SetStreak] = useState([]);

    useEffect(() => {
        if (C.AppReady) {
            SetFriends(meAndFriends);
            SetGroups(initialTopGroupsData)

            DataService.GetRankingTop().then((res) => {
                SetUsers(res.data.filter(x=>x.points>0));
            }).catch(e => {
                console.log(e);
                popup("Error", "Failed to load ranking due to an unknown error.")
            });

        // Geting top 10 groups
        // DataService.GetRankingTopGroups().then((res) => {
        //     setTopGroupData(res.data);
        // }).catch((err) => {
        //     console.log(err);
        // });

            DataService.GetRankingFriends().then((res) => {
                SetFriends(res.data);
            }).catch(e => {
                console.log(e);
                popup("Error", "Failed to load ranking due to an unknown error.")
            });    
        }
    }, [C.AppReady]);

    return (
        <div id="Ranking">
            <div id='header'>
                <h1>Ranking</h1>
                <p>The best of the best.</p>
            </div>

            <div id="columns">
                <div id="column">
                    <h2>Friends</h2>
                    {Friends.map((user, i) => (
                        <Link key={user.id} to={`/profile/${user.id}`}>

                        <div key={i} id="row">
                            <p id="placement">{i + 1}</p>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${user.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                                <p id="username">{user.username}</p>
                            </div>
                            <p id="points">{user.points} points</p> 
                        </div>
                        </Link>

                    ))}
                </div>

                <div id="column">
                    <h2>All Users</h2>
                    {Users.map((user, i) => (
                        <Link key={user.id} to={`/profile/${user.id}`}>
                        <div  id="row">
                            <p id="placement">{i + 1}</p>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${user.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                                <p id="username">{user.username}</p>
                            </div>
                            <p id="points">{user.points} points</p>
                        </div>
                        </Link>
                    ))}
                </div>

                <div id="column">
                    <h2>Streak</h2>
                    {Users.map((user, i) => (
                        <Link key={user.id} to={`/profile/${user.id}`}>
                        <div  id="row">
                            <p id="placement">{i + 1}</p>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${user.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                                <p id="username">{user.username}</p>
                            </div>
                            <p id="points">{user.points} days</p>
                        </div>
                        </Link>
                    ))}
                </div>

                <div id="column">
                    <h2>Groups</h2>
                    {Groups.map((user, i) => (
                        <div key={i} id="row">
                            <p id="placement">{i + 1}</p>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${user.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                                <p id="username">{user.username}</p>
                            </div>
                            <p id="points">{user.points} points</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

