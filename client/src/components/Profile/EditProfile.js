import { useParams } from 'react-router-dom';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import {FaPen} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import TextareaAutosize from 'react-textarea-autosize';
import { AccessDenied } from '../AccessDenied'

export function EditProfile() {
    const C = useContext(AppContext);
    const { id } = useParams()
    document.title = `Duolingo | Edit Profile`

    if (C.UserData.userid != id) {
        return <AccessDenied/>
    }
    

    // placeholders
    const bio='[BIO] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce luctus sem urna, sed imperdiet arcu aliquet sit amet. Integer sed metus hendrerit, iaculis nunc eget, porttitor nisl. Donec lacinia elit sem, in venenatis lectus sollicitudin sed. Mauris vulputate scelerisque enim, nec scelerisque lectus elementum ac.'
    const privateprofile = false
    
    return (
        <div id="EditProfile">
            <div id='banner'>
                <div id='left'>
                    <div id='editprofilepic'>
                        <label htmlFor="picinput" id='label'>
                        <div id='pfp' style={{ backgroundImage: `url(${C.UserData.pfp || placeholderpfp})`, height: 200, width:200 }}></div>
                            <i><FaPen id='icon'/></i>
                        </label>
                        <input type='file' id='picinput' onChange={(e)=>{C.SetUserData({...C.UserData, 'pfp':URL.createObjectURL(e.target.files[0])}); console.log(e.target.files[0].name)}}></input>
                    </div>
                    <div id='side'>
                        <h1 id='username'>uzytkownik o id: {id}</h1>
                        <p>Member since [DATE]</p>
                        <p>[DAYS] streak</p>
                        <p>[NUMBER] points</p>
                        <TextareaAutosize id='bio' className='input' minRows={5} maxLength={400} defaultValue={bio}></TextareaAutosize>
                    </div>
                </div>
                <div id='buttons'>
                    <button className='button'>Save Changes</button>
                    <button className='button'>Set profile to {privateprofile == false ? 'private' : "public"}</button>
                    <Link to="./../"><button className='button'>Back</button></Link>
                </div>
            </div>
           

            
        </div>
    )
}