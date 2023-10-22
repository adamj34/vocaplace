import { useParams } from 'react-router-dom';

export function Profile() {
    const { id } = useParams()
 
    return (
        <div id="Profile">
            <p>profil uzytkownika o id {id} </p>
        </div>
    )
}