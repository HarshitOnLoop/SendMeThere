import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Redirect from './components/Redirect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/open" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
