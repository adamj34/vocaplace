import { useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { useKeycloak } from '@react-keycloak/web';
import { LoginRequired } from '../LoginRequired';

export function Group() {
    const { id } = useParams()
    document.title = `VocaPlace | Group name`
    const C = useContext(AppContext);
    const [GroupData, SetGroupData] = useState({group:{}, members:[]});


    useEffect(() => {
        if (C.AppReady) {
            DataService.GetGroupData(id).then((data) => {
                SetGroupData(data)
                console.log(data)
            })
        }
    }, [C.AppReady])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Group">
            <div id='header'>
                <h1>{GroupData.group.group_name}</h1>
                <p>{GroupData.group.bio}</p>
            </div>
            <p>Group members:</p>
            {GroupData.members.map((u,i) => {
                return <div>
                    {u.username} {u.admin && '(admin)'}
                    </div>
            })}
        </div>
    )
}