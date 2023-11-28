import { useSearchParams, Link, Navigate } from 'react-router-dom';
import {useEffect, useState} from 'react';

export function Search() {
    const [ Params ] = useSearchParams();
    const [SearchData, SetSearchData] = useState({})
    document.title = `VocaPlace | ${Params.get('q')}`

    if (!Params.get('q') || Params.get('q').length == 0) {return (<Navigate replace to="/"/>) }

    return (
        <div id="Search">
            <p>Results for</p>
                <p id="bold">{Params.get('q')}</p>
        </div>
    )
}