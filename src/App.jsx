
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import DietPlanView from "./components/DietPlanView";
import Payment from "./components/Payment";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/plano" element={<DietPlanView />} />
        <Route path="/pagamento" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;