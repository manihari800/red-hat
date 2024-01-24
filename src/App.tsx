import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PotionList from './components/PotionList';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{textAlign:'center',color:"goldenrod"}}>Potion Catalog</h1>
      </header>
      <main>
        <PotionList />
      </main>
    </div>
  );
};

export default App;
