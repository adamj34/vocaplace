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
                        <p>Learn English</p>
                    </div>
                    <p>Complete tasks, gather points and review your mistakes.</p>
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

        </div>
    )
}