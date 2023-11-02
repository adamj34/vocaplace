import { Link } from 'react-router-dom';

export function LoginRequired() {
  document.title = `Duolingo | 403`
    return (
      <div id="LoginRequired">
        <h2>Error 403</h2> 
        <h1>You must be logged in to access this page.</h1>
        <Link to='..' className='hovertext'>Return to the Home Page</Link>
      </div>
    )
  }