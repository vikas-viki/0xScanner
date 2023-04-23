
import React from 'react';
import Details from "./Routes/Details.jsx"
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Hero from './Hero.jsx';
import Accounts from './Routes/Accounts.jsx';



function App() {



  return (
    <BrowserRouter>
      <Hero />
      <Routes>
        <Route path='/*' element={<Details />} />
        <Route path='/' element={<Accounts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
