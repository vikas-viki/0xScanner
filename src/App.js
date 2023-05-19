
import React from 'react';
import Details from "./Routes/Details.jsx"
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Hero from './Hero.jsx';
import Accounts from './Routes/Accounts.jsx';

function App() {

  return (
    <HashRouter >
      <Hero />
      <Routes>
        <Route path='/details' element={<Details />} />
        <Route path='/' element={<Accounts />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
