import { useState, useContext, useEffect } from 'react';
import DataService from "../../DataService";
import { AppContext } from '../../App';
import { Link } from 'react-router-dom';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import { usePopup } from '../Popup.tsx';


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

            DataService.GetRankingTop().then((res) => {
                SetUsers(res.data.filter(x=>x.points>0));
            }).catch(e => {
                console.error(e);
                popup("Error", "Failed to load ranking due to an unknown error.")
            });

            DataService.GetRankingGroups().then((res) => {
                SetGroups(res.data);
            }).catch((e) => {
                console.error(e);
                popup("Error", "Failed to load ranking due to an unknown error.")
            });

            DataService.GetRankingFriends().then((res) => {
                SetFriends(res.data);
            }).catch(e => {
                console.error(e);
                popup("Error", "Failed to load ranking due to an unknown error.")
            }); 

            DataService.GetRankingStreak().then((res) => {
                SetStreak(res.data);
            }).catch(e => {
                console.error(e);
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
                        <Link key={i} to={`/profile/${user.id}`}>

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
                        <Link key={i} to={`/profile/${user.id}`}>
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
                    {Streak.map((user, i) => (
                        <Link key={i} to={`/profile/${user.id}`}>
                        <div  id="row">
                            <p id="placement">{i + 1}</p>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${user.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                                <p id="username">{user.username}</p>
                            </div>
                            <p id="points">{user.ongoing_streak} day{user.ongoing_streak !== 1 ? 's' : ''}</p>
                        </div>
                        </Link>
                    ))}
                </div>

                <div id="column">
                    <h2>Groups</h2>
                    {Groups.map((group, i) => (
                        <Link key={i} to={`/groups/${group.id}`}>
                            <div id="row">
                                <p id="placement">{i + 1}</p>
                                <div id="user">
                                    <div id='pfp' style={{ backgroundImage: `url(${group.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                    <p id="username">{group.group_name}</p>
                                </div>
                                <p id="points">{Math.round(group.points_avg)} points</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* <div id="column">
                    <h2>Groups</h2>
                    {Groups.map((group, i) => (
                        <div key={i} id="row">
                            <p id="placement">{i + 1}</p>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${group.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                                <p id="username">{group.group_name}</p>
                            </div>
                            <p id="points">{Math.round(group.points_avg)} points</p>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
}

