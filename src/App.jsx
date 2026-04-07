import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Redirect from './components/Redirect';
import SlugRedirect from './components/SlugRedirect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Home />} />
        <Route path="/open"   element={<Redirect />} />
        {/* Short link / custom URL handler — must be last */}
        <Route path="/:slug"  element={<SlugRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
