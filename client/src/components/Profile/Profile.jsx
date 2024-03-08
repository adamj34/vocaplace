// import './style.scss';
import { useParams } from 'react-router-dom';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import {FaHandsHelping, FaUserFriends} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { DateFormat } from '../../helpers/DateFormat';

function SetRelationship(rel, me) {
    if (!rel) {
        return null
    } else if ((rel.relationship === 'pending_user1_user2' && rel.user1_id === me) || (rel.relationship === 'pending_user2_user1' && rel.user2_id === me)) {
        return 'i_invited_them'
    } else if ((rel.relationship === 'pending_user1_user2' && rel.user2_id === me) || (rel.relationship === 'pending_user2_user1' && rel.user1_id === me)) {
        return 'they_invited_me'
    } else if (rel.relationship === 'friends') {
        return 'friends'
    }
}


function ListElement(p) {
    return (
        <li>
            <Link to={`../${p.page}/${p.data.id}`} className='hovertext'>
                <div id='listitem'>
                    <img src={p.data.picture || placeholderpfp} height={33} id='pfp' alt='profilepicture'></img>
                    <p>{p.data.username || p.data.group_name}</p>
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
                SetProfileData({...data, relationship:SetRelationship(data.relationship, C.UserData.id)})
                console.log(data)
                SetLoading(false)
            })
        }
    }, [C.AppReady, id])


    function SendInvite() {
        DataService.SendFriendRequest(id).then((relationship) => {
            SetProfileData({...ProfileData, relationship:SetRelationship(relationship, C.UserData.id)})
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
                    <div id='pfp' style={{ backgroundImage: `url(${ProfileData.user.picture || placeholderpfp})`, height: 200, width:200 }}></div>
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
                        {!ProfileData.relationship && <button className='button' onClick={SendInvite}>Add Friend</button>}
                        {ProfileData.relationship === 'i_invited_them' && <button className='button light' onClick={CancelInvite}>Cancel Invite</button>}
                        {ProfileData.relationship === 'they_invited_me' && (<>
                            <p>This user has sent you a friend request.</p>
                            <button className='button' onClick={AcceptInvite}>Accept</button>
                            <p id='or'>or</p>
                            <button className='button light' onClick={DeleteInvite}>Delete</button>
                        </>)}
                        {ProfileData.relationship === 'friends' && <button className='button' onClick={DeleteFriend}>Remove Friend</button>}
                    </div>
                }
                
            </div>
            <div id='data'>
                <div id='friends'>
                    <div id='title'>
                        <FaHandsHelping id='icon'/>
                        <p>{ProfileData.friends.length} Friend{ProfileData.friends.length !== 1 && 's'}</p>
                    </div>
                    <ul id='content'>
                        {ProfileData.friends.map((x) => {return <ListElement data={x} page='profile' key={x.id}/>})}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon'/>
                        <p>{ProfileData.groups.length} Group{ProfileData.groups.length !== 1 && 's'}</p>
                    </div>
                    <ul id='content'>
                        {ProfileData.groups.map((x) => {return <ListElement data={x} page='groups' key={x.id}/>})}
                    </ul>
                </div>
            </div>
           

            
        </div>
    )
}