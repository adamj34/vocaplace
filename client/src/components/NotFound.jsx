import { Link } from 'react-router-dom';

export function NotFound() {
  document.title = `VocaPlace | 404`
    return (
      <div id="NotFound"> 
        <h2>Error 404</h2>
        <h1>Page not found.</h1>
        <Link to='..' className='hovertext'>Click here to return to the Home Page</Link>
      </div>
    )
  }