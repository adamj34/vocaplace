import { useState, useContext, useEffect } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import DataService from "../../DataService";
import { AppContext } from '../../App';

const meAndFriends = [
    { username: 'Joe', points: 150 },
    { username: 'Bill', points: 117 },
    { username: 'Anne', points: 88 },
];

const initialTopUsersData = [
    { username: "Addam", points: 308 },
    { username: "George", points: 223 },
    { username: "Bob", points: 208 },
    { username: "Joe", points: 150 },
    { username: "Bill", points: 117 },
];

const initialTopGroupsData = [
    { username: "Englovers", points: 1639 },
    { username: "WeAreFriends", points: 1084 },
    { username: "THEBEST", points: 881 },
];

export function Ranking() {
    const C = useContext(AppContext);
    const { keycloak } = useKeycloak();
    const [meAndFriendsData, setMeAndFriendsData] = useState([]);
    const [topUsersData, setTopUsersData] = useState([]);
    const [topGroupsData, setTopGroupData] = useState([]);

    useEffect(() => {
        setMeAndFriendsData(meAndFriends);
        setTopUsersData(initialTopUsersData);
        setTopGroupData(initialTopGroupsData)
    }, [C.AppReady]);

    if (!keycloak.authenticated) {
        return <LoginRequired />;
    }

    document.title = `VocaPlace | Revisions`;

    return (
        <div id="Ranking">
            <div id='header'>
                <h1>Ranking</h1>
                <p>The best of the best.</p>
            </div>

            <div id="columns">
                <div id="column">
                    <h2>Friends</h2>
                    {meAndFriendsData.map((user, i) => (
                        <div key={i} id="row">
                            <p id="placement">{i + 1}</p>
                            <p id="username">{user.username}</p>
                            <p id="points">{user.points}p</p> 
                        </div>
                    ))}
                </div>

                <div id="column">
                    <h2>Users</h2>
                    {topUsersData.map((user, i) => (
                        <div key={i} id="row">
                            <p id="placement">{i + 1}</p>
                            <p id="username">{user.username}</p>
                            <p id="points">{user.points}p</p>
                        </div>
                    ))}
                </div>
                <div id="column">
                    <h2>Groups</h2>
                    {topGroupsData.map((user, i) => (
                        <div key={i} id="row">
                            <p id="placement">{i + 1}</p>
                            <p id="username">{user.username}</p>
                            <p id="points">{user.points}p</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

