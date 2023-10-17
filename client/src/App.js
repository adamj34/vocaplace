import './style.scss';
import { Routes, Route } from 'react-router-dom';

import { NotFound } from './components/NotFound';
import { Home } from './components/Home/Home';

function App() {
  return (
    <div id="App">
     <Routes>
          <Route path='' element={<Home/>}/>
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
    </div>
    
  );
}

export default App;
