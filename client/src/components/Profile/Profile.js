import { useParams } from 'react-router-dom';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import {FaHandsHelping, FaUserFriends} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AppContext } from '../../App';


function ListElement(p) {
    return (
        <li>
            <Link to={"../"+p.page+"/"+"321"} className='hovertext'>
                <div id='listitem'>
                    <img src={p.data.pic || placeholderpfp} height={33} id='profilepic' alt='profilepicture'></img>
                    <p>{p.data.name || 'undefined'}</p>
                </div>
            </Link>
        </li>
    )
}

export function Profile() {
    const C = useContext(AppContext);
    const { id } = useParams()
    const [ProfileData, SetProfileData] = useState([]);
    const groups = [{name:'group1', pic:null}, {name:'group2', pic:null}]
    const friends = [{name:'friend1', pic:null}, {name:'friend2', pic:null}, {name:'friend3', pic:null}]
    document.title = `Duolingo | username`

    // tu musi isc fetch do servera, server wysyla zapytanie do keycloaka o username (bo ma uprawnienia) ???????
    // useEffect(() => {
    //     fetch(`http://localhost:3001/getuserdata?username=${data.username}`, 
    //     {method: 'GET',  headers: {Authorization: `Bearer ${keycloak.token}`}})
    //         .then(response => response.json())
    //         .then(data => {SetUserData(data)})
    //     }).catch((err) => console.log(err))
          
 
    return (
        <div id="Profile">
            <div id='banner'>
                <div id='left'>
                    <img src={placeholderpfp} height={200} id='profilepic' alt='profilepicture'></img>
                    <div id='side'>
                        <h1 id='username'>uzytkownik o id: {id}</h1>
                        <p>Member since [DATE]</p>
                        <p>[DAYS] streak</p>
                        <p>[NUMBER] points</p>
                        <p>[BIO] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus sem urna, sed imperdiet arcu aliquet sit amet. Integer sed metus hendrerit, iaculis nunc eget, porttitor nisl. Donec lacinia elit sem, in venenatis lectus sollicitudin sed. Mauris vulputate scelerisque enim, nec scelerisque lectus elementum ac.</p>
                    </div>
                </div>
                {(id === C.UserData.userid) ? 
                    <div id='buttons'><Link to='./edit'><button className='button'>Edit Profile</button></Link></div> : 
                    <div id='buttons'>
                        <button className='button'>Add Friend</button>
                        <button className='button'>Invite to Group</button>
                        <button className='button'>Message</button>
                    </div>
                }
                
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