import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './components/auth/Register.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductList from './components/product/ProductList.jsx';
import BillingPage from './pages/BillingPage.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with shared layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="product" element={<ProductList />} />
          <Route path='/billing' element={<BillingPage/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;