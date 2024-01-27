import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import DataService from "../../DataService";

// Mock JSON data for testing
const meAndFriends = [
    { username: 'me', points: 100 },
    { username: 'user2', points: 150 },
    { username: 'user3', points: 120 },
    // Add more mock data as needed
];

// Mock top users data for testing
const topUsersData = [
    { points: 1000 },
    { points: 1500 },
    { points: 1200 },
    // Add more mock data as needed
];

// Function to sort top users and give them usernames
const getTopUsers = (users) => {
    const sortedTopUsers = users.sort((a, b) => b.points - a.points).slice(0, 10);
    return sortedTopUsers.map((user, index) => ({
        username: `topuser${index + 1}`,
        points: user.points,
    }));
};

export function Ranking() {
    const { keycloak } = useKeycloak();
    const [meAndFriendsData, setMeAndFriendsData] = useState([]);
    const [topUsersData, setTopUsersData] = useState([]);

    useEffect(() => {
        // Mock data for "Me and Friends"
        setMeAndFriendsData(meAndFriends);

        // Mock data for "Top of All Time"
        setTopUsersData(getTopUsers(topUsersData));
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

            <div className="ranking-columns">
                {/* Column for "Me and Friends" */}
                <div className="ranking-column">
                    <h2>Me and Friends</h2>
                    {meAndFriendsData.map((user, index) => (
                        <div key={index} className="user-row">
                            <div className="username">{user.username}</div>
                            <div className="points">{user.points}</div>
                        </div>
                    ))}
                </div>

                {/* Column for "Top of All Time" */}
                <div className="ranking-column">
                    <h2>Top of All Time</h2>
                    {topUsersData.map((user, index) => (
                        <div key={index} className="user-row">
                            <div className="username">{user.username}</div>
                            <div className="points">{user.points}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
