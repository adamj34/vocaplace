import { useContext } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaHandsHelping, FaUserFriends, FaMedal, FaBook, FaPen, FaBrain } from 'react-icons/fa';


function Welcome() {
    const C = useContext(AppContext);
    return (
        <div id='welcome'>
            <h1 className="title">Welcome, {C.UserData.username || 'guest'}!</h1>
            <p className="subtitle">Let's learn some English together :)</p>
        </div>
    )
}

export function Home() {
    document.title = `Duolingo | Home`
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
                        <p>Get in touch with other users and study together.</p>
                    </div>

                    <div id='ranking'>
                        <div id='title'>
                            <FaMedal id='icon'/>
                            <p>Advance</p>
                        </div>
                        <p>Climb up the ranking to become the very best.</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div id="Home">
                <Welcome/>
                <div id="links">
                    <Link to='units'>
                        <div id='units'>
                            <div id='title'>
                                <FaBook id='icon'/>
                                <p>Units</p>
                            </div>
                            <p>Continue learning new words and phrases.</p>
                        </div>
                    </Link>

                    <Link to='revisions'>
                        <div id='revisions'>
                            <div id='title'>
                                <FaBrain id='icon'/>
                                <p>Revisions</p>
                            </div>
                            <p>Review your previous mistakes or practice already known words.</p>
                        </div>
                    </Link>

                    <Link to='friends'>
                        <div id='friends'>
                            <div id='title'>
                                <FaHandsHelping id='icon'/>
                                <p>Friends</p>
                            </div>
                            <p>Add other users to your friend list and share your progress.</p>
                        </div>
                    </Link>

                    <Link to='groups'>
                        <div id='groups'>
                            <div id='title'>
                                <FaUserFriends id='icon'/>
                                <p>Groups</p>
                            </div>
                            <p>Get in touch with other users and study together.</p>
                        </div>
                    </Link>

                    <Link to='ranking'>
                        <div id='ranking'>
                            <div id='title'>
                                <FaMedal id='icon'/>
                                <p>Ranking</p>
                            </div>
                            <p>Climb up the ranking to become the very best.</p>
                        </div>
                    </Link>

                    <Link to={'profile/'+C.UserData.userid}>
                        <div id='profile'>
                            <div id='title'>
                                <FaPen id='icon'/>
                                <p>Profile</p>
                            </div>
                            <p>View and customize your profile.</p>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}