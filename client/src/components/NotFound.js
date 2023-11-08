import { Link } from 'react-router-dom';

export function NotFound() {
  document.title = `Duolingo | 404`
    return (
      <div id="NotFound"> 
        <h2>Error 404</h2>
        <h1>Page not found.</h1>
        <Link to='..' className='hovertext'>Return to the Home Page</Link>
      </div>
    )
  }