import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./components/Form/LoginForm";
import Register from "./components/Form/RegisterForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './assets/styles/FormStyle.scss';
import './assets/styles/base.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
