import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import DataService from "../../DataService";

const meAndFriends = [
    { username: 'user2', points: 150 },
    { username: 'user3', points: 120 },
    { username: 'me', points: 100 },
];

const initialTopUsersData = [
    { username: "topUser2", points: 1500 },
    { username: "topUser3", points: 1200 },
    { username: "topUser1", points: 1000 },
];

const initialTopGroupsData = [
    { name: "topGroup2", points: 15000 },
    { name: "topGroup3", points: 12000 },
    { name: "topGroup1", points: 10000 },
];

export function Ranking() {
    const { keycloak } = useKeycloak();
    const [meAndFriendsData, setMeAndFriendsData] = useState([]);
    const [topUsersData, setTopUsersData] = useState([]);
    const [topGroupsData, setTopGroupData] = useState([]);

    useEffect(() => {
        setMeAndFriendsData(meAndFriends);
        setTopUsersData(initialTopUsersData);
        setTopGroupData(initialTopGroupsData)
    }, []);

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

            <div id="ranking-columns">
                <div id="ranking-column">
                    <h2>Friendly Ranking</h2>
                    {meAndFriendsData.map((user, index) => (
                        <div key={index} id="user-row">
                            <div id="placement">{index + 1}</div>
                            <div id="username">{user.username}</div>
                            <div id="points-container">
                                <div id="points">{user.points}</div>
                                <div id="points-label">pts</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div id="ranking-column">
                    <h2>Top Users of All Time</h2>
                    {topUsersData.map((user, index) => (
                        <div key={index} id="user-row">
                            <div id="placement">{index + 1}</div>
                            <div id="username">{user.username}</div>
                            <div id="points-container">
                                <div id="points">{user.points}</div>
                                <div id="points-label">pts</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div id="ranking-column">
                    <h2>Top Group of All Time</h2>
                    {topGroupsData.map((user, index) => (
                        <div key={index} id="user-row">
                            <div id="placement">{index + 1}</div>
                            <div id="username">{user.name}</div>
                            <div id="points-container">
                                <div id="points">{user.points}</div>
                                <div id="points-label">pts</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

