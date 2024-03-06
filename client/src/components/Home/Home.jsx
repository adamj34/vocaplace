import { useContext } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import { Link } from 'react-router-dom';
import Icon from '../Icon';

const offering = {
    'tasks': { title: 'Learn English', icon: 'globe-americas', description: 'Complete tasks, earn points and review your mistakes.' },
    'friends': { title: 'Add Friends', icon: 'user-friends', description: 'Add other users to your friend list and compare your progress.' },
    'groups': { title: 'Join Groups', icon: 'people-group', description: 'Get in touch with other users and study together.' },
    'ranking': { title: 'Advance', icon: 'medal', description: 'Climb up the ranking to become the very best.' }
}

const links = {
    'units': { title: 'Units', icon: 'book', description: 'Continue learning new words and phrases.' },
    'revisions': { title: 'Revisions', icon: 'brain', description: 'Review your previous mistakes.' },
    'friends': offering.friends,
    'groups': offering.groups,
    'ranking': offering.ranking,
    'profile': { title: 'Profile', icon: 'pen', description: 'View and customize your profile.'}
}


export function Home() {
    document.title = `VocaPlace | Home`
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    const C = useContext(AppContext);
    const { keycloak } = useKeycloak();

    return (
        <main id="Home">
            <header id='welcome'>
                <h1 className="title">Welcome, {C.UserData.username || 'guest'}!</h1>
                <p className="subtitle">Let's learn some English together :)</p>
            </header>

            {!keycloak.authenticated && <section id="offering">
                {Object.entries(offering).map(([key, data]) => (
                    <section key={key} id={key}>
                        <header id='title'>
                            <Icon icon={data.icon}></Icon>
                            <p>{data.title}</p>
                        </header>
                        <p>{data.description}</p>
                    </section>
                ))}
            </section>}

            {keycloak.authenticated && <section id="links">
                {Object.entries(links).map(([key, data]) => (
                    <Link to={key==='profile' ? `profile/${C.UserData.id}` : key} key={key}>
                        <section id={key}>
                            <header id='title'>
                                <Icon icon={data.icon}></Icon>
                                <p>{data.title}</p>
                            </header>
                            <p>{data.description}</p>
                        </section>
                    </Link>
                ))}
            </section>}
        </main>
    )
}