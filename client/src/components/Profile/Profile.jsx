// import './style.scss';
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

    document.title = `VocaPlace | username`
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetProfileData(id).then((data)=> {
                SetProfileData(data)
                console.log(data)
                SetLoading(false)
            })
        }
    }, [C.AppReady,id])


    function SendInvite() {
        DataService.SendFriendRequest(id).then((relationship) => {
            SetProfileData({...ProfileData, relationship})
            console.log(relationship)
        })
    }

    function AcceptInvite() {
        DataService.AcceptFriendRequest(id).then((res) => {
            SetProfileData({ ...ProfileData, relationship: 'friends' })
        })
    }

    function DeleteFriend() {
        DataService.DeleteFriend(id).then((res) => {
            SetProfileData({...ProfileData, relationship:null})
        })
    }

    function CancelInvite() {
        DataService.CancelFriendRequest(id).then((res) => {
            SetProfileData({ ...ProfileData, relationship: null })
        })
    }

    function DeleteInvite() {
        DataService.DeleteFriendRequest(id).then((res) => {
            SetProfileData({ ...ProfileData, relationship: null })
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
                        {ProfileData.relationship == null && <button className='button' onClick={SendInvite}>Add Friend</button>}
                        {(ProfileData.relationship && ProfileData.relationship.relationship == 'pending_user2_user1' && ProfileData.relationship.user1_id == id) && <button className='button' onClick={CancelInvite}>Cancel Invite</button>}
                        {(ProfileData.relationship && ProfileData.relationship.relationship == 'pending_user2_user1' && ProfileData.relationship.user2_id == id) && (<>
                            <p>This user has sent you a friend request.</p>
                            <button className='button' onClick={AcceptInvite}>Accept</button>
                            <p>or</p>
                            <button className='button' onClick={DeleteInvite}>Delete</button>
                        </>)}
                        {ProfileData.relationship == 'friends' && <button className='button' onClick={DeleteFriend}>Remove Friend</button>}
                    </div>
                }
                
            </div>
            <div id='data'>
                <div id='friends'>
                    <div id='title'>
                        <FaHandsHelping id='icon'/>
                        <p>{ProfileData.friends.length} Friend{ProfileData.friends.length != 1 && 's'}</p>
                    </div>
                    <ul id='content'>
                        {/* {friends.map((x) => {return <ListElement data={x} page='profile' key={x.name}/>})} */}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon'/>
                        <p>{ProfileData.groups.length} Group{ProfileData.groups.length != 1 && 's'}</p>
                    </div>
                    <ul id='content'>
                        {/* {groups.map((x) => {return <ListElement data={x} page='group' key={x.name}/>})} */}
                    </ul>
                </div>
            </div>
           

            
        </div>
    )
}