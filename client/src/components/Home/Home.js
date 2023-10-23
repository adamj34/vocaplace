import { FaGlobeAmericas, FaHandsHelping, FaUserFriends, FaMedal } from 'react-icons/fa';

export function Home() {
    return (
        <div id="Home">
            <div id='welcome'>
                <h1 className="title">Welcome, guest!</h1>
                <p className="subtitle">Let's learn some English together :)</p>
            </div>

            <div id="offering">
                <div id='tasks'>
                    <div id='title'>
                        <FaGlobeAmericas id='icon'/>
                        <h2>Learn English</h2>
                    </div>
                    <p>Complete tasks, gather points and review your mistakes.</p>
                </div>

                <div id='friends'>
                    <div id='title'>
                        <FaHandsHelping id='icon'/>
                        <h2>Add Friends</h2>
                    </div>
                    <p>Add other users to your friend list and share your progress.</p>
                </div>

                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon'/>
                        <h2>Join Groups</h2>
                    </div>
                    <p>Get together with other users and study together.</p>
                </div>

                <div id='ranking'>
                    <div id='title'>
                        <FaMedal id='icon'/>
                        <h2>Advance</h2>
                    </div>
                </div>
            </div>

        </div>
    )
}