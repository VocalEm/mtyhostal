import { Routes, Route } from "react-router-dom";
import { SinglePageApplication } from "./Pages/SPA/SinglePageApplication";
import Login from "./Pages/Login/Login";
import Registro from "./Pages/Registro/Registro";
import Home from "./Pages/Home/Home";
import Perfil from "./Pages/Perfil/Perfil";
import Propiedad from "./Pages/Propiedad/Propiedad";
import Reservacion from "./Pages/Reservacion/Reservaciones";
import ReservacionesHuesped from "./Pages/ReservacionesHuesped/ReservacionesHuespued";
import ListadoPropiedades from "./Pages/ListadoPropiedades/ListadoPropiedades";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SinglePageApplication />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Registro" element={<Registro />} />
      <Route path="/Home" element={<Home />} />
      <Route
        path="/Perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />
      <Route path="/Propiedad" element={<Propiedad />} />
      <Route
        path="/Reservacion"
        element={
          <ProtectedRoute>
            <Reservacion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Reservaciones/usuario"
        element={
          <ProtectedRoute>
            <ReservacionesHuesped />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-propiedades"
        element={
          <ProtectedRoute requireAnfitrion>
            <ListadoPropiedades />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
export default App;
