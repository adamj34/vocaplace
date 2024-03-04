import { useKeycloak } from "@react-keycloak/web";
import { LoginRequired } from "../LoginRequired";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../App";
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import DataService from "../../DataService";


const groups = [
    {
        "id": 1,
        "group_name": "Englovers",
        "bio": "English is the best!",
        "picture": null
    },
    {
        "id": 2,
        "group_name": "BestFriends",
        "bio": "Hello! Join the group and let's study together!",
        "picture": null
    }
]

export function Groups() {
    document.title = `VocaPlace | Groups`
    const C = useContext(AppContext);
    const navigate = useNavigate();
    const [Groups, SetGroups] = useState([]);

    const [NewGroupData, SetNewGroupData] = useState([]);
    const [Submitting, SetSubmitting] = useState(false);
    const [ErrorMessage, SetErrorMessage] = useState('');

    
    useEffect(() => {
        if (C.AppReady) {
            DataService.GetUserGroups().then((data) => {
                SetGroups(data.data)
            })
        }
    }, [C.AppReady])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) {return <LoginRequired/>}

    return (
        <div id="Groups">
            <div id='header'>
                <h1>Groups</h1>
                <p>Get in touch with others.</p>
            </div>

            <div id="content">
                <div id="grouplist">
                    {Groups.map((g, i) => {
                        return (
                            <Link key={i} to={`/groups/${g.id}`}>
                                <div id="group">
                                    <div id='pfp' style={{ backgroundImage: `url(${g.picture || placeholderpfp})`, height: 60, minWidth: 60 }}></div>
                                    <div id="groupdata">
                                        <h3>{g.group_name} {g.admin && (<i className="fas fa-crown" />)}</h3>
                                        <p>{g.bio}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div id="groupcreator">
                    <h3>Create New Group:</h3>
                    <form>
                        <div id='field'>
                            <label>Group Name:</label>
                            <input className='input' placeholder='Students' onChange={(e) => { SetNewGroupData({ ...NewGroupData, group_name: e.target.value }) }} />
                        </div>
                        <div id='field'>
                            <label>Group Description:</label>
                            <TextareaAutosize id='bio' className='input' minRows={4} maxLength={300} placeholder='We love learning English!' onChange={(e) => { SetNewGroupData({ ...NewGroupData, bio: e.target.value }) }} ></TextareaAutosize>
                        </div>
                        <div id='field'>
                            <label>Group Picture:</label>
                            <div id="pic">
                                <label for="picinput">
                                    <p id="inputbutton" className="button" onclick="document.getElementById('picinput').click()">Upload</p>
                                    <input type='file' id='picinput' onChange={(e) => {if (e.target.files && e.target.files.length > 0) {SetNewGroupData({ ...C.UserData, 'picture': URL.createObjectURL(e.target.files[0]) })} }} ></input>
                                </label>
                                
                                
                                <div id='pfp' style={{ backgroundImage: `url(${NewGroupData.picture || placeholderpfp})`, height: 60, width: 60 }}></div>
                            </div>
                            
                        </div>

                        <p id="error">{ErrorMessage}</p>

                        <button type='button' className='button' disabled={Submitting} onClick={() => {
                            SetSubmitting(true)
                            if (!NewGroupData.group_name) {
                                SetErrorMessage("You must enter group name!")
                            } else if (NewGroupData.group_name.length < 5) {
                                SetErrorMessage("Group name must contain at least five characters!")
                            } else {
                                SetErrorMessage("")
                                DataService.CreateGroup(NewGroupData).then((d) => { // d.data.id
                                    navigate(`/groups/${d.data.id}`)
                                }).catch(() => {
                                    SetErrorMessage("Failed to submit!")
                                })
                            }
                            SetSubmitting(false)
                        }}>Create Group</button>
                    </form>
                </div>
            </div>
           
        </div>
        
    )
}