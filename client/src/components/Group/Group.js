import { useParams } from 'react-router-dom';

export function Group() {
    const { id } = useParams()
 
    return (
        <div id="Group">
            <p>profil grupy o id {id} </p>
        </div>
    )
}