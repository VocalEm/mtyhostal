import React from "react";
import { Routes, Route } from "react-router-dom";
import { SinglePageApplication } from "./Pages/SPA/SinglePageApplication";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Property from "./Pages/Property/Property";
import Reservation from "./Pages/Reservation/Reservation";

const App = () => {
  return (
    <Routes>
      {/* Ruta para la página de inicio */}
      <Route path="/" element={<SinglePageApplication />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Property" element={<Property />} />
      <Route path="/Reservation" element={<Reservation />} />

      {/* Ruta dinámica para las propiedades. :listingId es el parámetro dinámico 
      <Route path="/listing/:listingId" element={<ListingPage />} />*/}

      {/* Ruta para cualquier otra URL no encontrada 
      <Route path="*" element={<NotFoundPage />} />*/}
    </Routes>
  );
};
export default App;
