import Search from './components/Search';
import { useState } from 'react';

function App() {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
  
          <img src="./hero.png" alt="Hero" />
          <h1>Enjoy Popular <span className='text-gradient'>Movies</span> without the Hassle</h1>
        </header>


        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      
      </div>
    

    </main>
  );
}

export default App;



