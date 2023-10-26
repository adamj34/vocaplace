import { useParams } from 'react-router-dom';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import {FaHandsHelping, FaUserFriends} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';


function ListElement(p) {
    return (
        <li>
            <Link to={"../"+p.page+"/"+"321"} className='hovertext'>
                <div id='listitem'>
                    <img src={p.data.pic || placeholderpfp} height={33} id='profilepic'></img>
                    <p>{p.data.name || 'undefined'}</p>
                </div>
            </Link>
        </li>
    )
}

export function Profile() {
    const { id } = useParams()
    const groups = [{name:'group1', pic:null}, {name:'group2', pic:null}]
    const friends = [{name:'friend1', pic:null}, {name:'friend2', pic:null}, {name:'friend3', pic:null}]
 
    return (
        <div id="Profile">
            <div id='banner'>
                <div id='left'>
                    <img src={placeholderpfp} height={120} id='profilepic'></img>
                    <div id='side'>
                        <h1 id='username'>uzytkownik o id: {id}</h1>
                        <p>Member since [DATE]</p>
                        <p>[NUMBER] points</p>
                    </div>
                </div>
                <div id='buttons'>
                    <button className='button'>Add Friend</button>
                </div>
                
            </div>
            <div id='data'>
                <div id='friends'>
                    <div id='title'>
                        <FaHandsHelping id='icon'/>
                        <p>{friends.length} Friends</p>
                    </div>
                    <ul id='content'>
                        {friends.map((x) => {return <ListElement data={x} page='profile'/>})}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon'/>
                        <p>{groups.length} Groups</p>
                    </div>
                    <ul id='content'>
                        {groups.map((x) => {return <ListElement data={x} page='group'/>})}
                    </ul>
                </div>
            </div>
           

            
        </div>
    )
}