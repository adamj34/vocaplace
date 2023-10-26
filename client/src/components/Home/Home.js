import { useState, useContext } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import { FaGlobeAmericas, FaHandsHelping, FaUserFriends, FaMedal } from 'react-icons/fa';


function Welcome() {
    const C = useContext(AppContext);
    return (
        <div id='welcome'>
            <h1 className="title">Welcome, {C.UserData.username || 'guest'}!</h1>
            <p className="subtitle">Let's learn some English together :)</p>
        </div>
    )
}

function Footer() {
    return (
        <div id='footer'>
            bajojajo
        </div>
    )
}

export function Home() {
    const C = useContext(AppContext);
    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) {
        return (
            <div id="Home">
            <Welcome/>
                <div id="offering">
                    <div id='tasks'>
                        <div id='title'>
                            <FaGlobeAmericas id='icon'/>
                            <p>Learn English</p>
                        </div>
                        <p>Complete tasks, earn points and review your mistakes.</p>
                    </div>

                    <div id='friends'>
                        <div id='title'>
                            <FaHandsHelping id='icon'/>
                            <p>Add Friends</p>
                        </div>
                        <p>Add other users to your friend list and share your progress.</p>
                    </div>

                    <div id='groups'>
                        <div id='title'>
                            <FaUserFriends id='icon'/>
                            <p>Join Groups</p>
                        </div>
                        <p>Get together with other users and study together.</p>
                    </div>

                    <div id='ranking'>
                        <div id='title'>
                            <FaMedal id='icon'/>
                            <p>Advance</p>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    } else {
        return (
            <div id="Home">
                <Welcome/>
                <Footer/>
            </div>
        )
    }
}