import { useParams } from 'react-router-dom';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import {FaHandsHelping, FaUserFriends} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { DateFormat } from '../../helpers/DateFormat';


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
    const [Loading, SetLoading] = useState(true);
    const C = useContext(AppContext);
    const { id } = useParams()
    const [ProfileData, SetProfileData] = useState({});
    const [isFriend, setIsFriend] = useState(false);
    
    document.title = `VocaPlace | username`
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetProfileData(id).then((data)=> {
                SetProfileData(data)
                console.log(data)
                SetLoading(false)
                isFriendCheck();
            })
        }
    }, [C.AppReady,id])

    const isFriendCheck = async () => {
       try{
        const friendStatus = await DataService.IsFriend(id);
        setIsFriend(friendStatus)
        console.log(friendStatus)
       }catch(err){
            console.error(err)
         }
    }

    const handleAddFriend = () => {
        DataService.SendFriendRequest(id).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        Loading ? <div>Loading</div> :
        <div id="Profile">
            <div id='banner'>
                <div id='left'>
                    <div id='profilepic'>
                        <div id='pfp' style={{ backgroundImage: `url(${ProfileData.user.picture || placeholderpfp})`, height: 200, width:200 }}></div>
                    </div>
                    <div id='side'>
                        <h1 id='username'>{ProfileData.user.username}</h1>
                        <p>Member since {DateFormat(ProfileData.user.created_at)}</p>
                        <p>{ProfileData.user.ongoing_streak} streak</p>
                        <p>{ProfileData.user.points} points</p>
                        <p>{ProfileData.user.bio}</p>
                    </div>
                </div>
                {(id === C.UserData.id) ? 
                    <div id='buttons'><Link to='./edit'><button className='button'>Edit Profile</button></Link></div> : 
                    <div id='buttons'>
                        {isFriendCheck && <button className='button' onClick={handleAddFriend}>Add Friend</button>}
                        <button className='button'>Invite to Group</button>
                        <button className='button' >Message</button>
                    </div>
                }
                
            </div>
            <div id='data'>
                <div id='friends'>
                    <div id='title'>
                        <FaHandsHelping id='icon'/>
                        <p>{ProfileData.friends.length} Friends</p>
                    </div>
                    <ul id='content'>
                        {/* {friends.map((x) => {return <ListElement data={x} page='profile' key={x.name}/>})} */}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon'/>
                        <p>{ProfileData.groups.length} Groups</p>
                    </div>
                    <ul id='content'>
                        {/* {groups.map((x) => {return <ListElement data={x} page='group' key={x.name}/>})} */}
                    </ul>
                </div>
            </div>
           

            
        </div>
    )
}