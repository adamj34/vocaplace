import { Link } from 'react-router-dom';

export function AccessDenied() {
  document.title = `VocaPlace | 403`
    return (
      <div id="AccessDenied">
        <h2>Error 403</h2> 
        <h1>You do not have access to this page.</h1>
        <Link to='..' className='hovertext'>Return to the Home Page</Link>
      </div>
    )
  }