import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import SubmitRecipe from './pages/SubmitRecipe';
import Favorites from './pages/Favorites';

// PUBLIC_INTERFACE
function App() {
  /** App root with routing and shared layout */
  return (
    <BrowserRouter>
      <div className="navbar">
        <Navbar />
      </div>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/submit" element={<SubmitRecipe />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
