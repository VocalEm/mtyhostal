import React from "react";
import { Routes, Route } from "react-router-dom";
import { SinglePageApplication } from "./Pages/SinglePageApplication";

const App = () => {
  return (
    <Routes>
      {/* Ruta para la página de inicio */}
      <Route path="/" element={<SinglePageApplication />} />

      {/* Ruta dinámica para las propiedades. :listingId es el parámetro dinámico 
      <Route path="/listing/:listingId" element={<ListingPage />} />*/}

      {/* Ruta para cualquier otra URL no encontrada 
      <Route path="*" element={<NotFoundPage />} />*/}
    </Routes>
  );
};
export default App;
