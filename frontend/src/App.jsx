// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Register from './components/auth/Register.jsx';
// import LoginPage from './pages/LoginPage.jsx';
// import DashboardLayout from './layouts/DashboardLayout.jsx';
// import DashboardPage from './pages/DashboardPage.jsx';
// import ProductList from './components/product/ProductList.jsx';
// import BillingPage from './pages/BillingPage.jsx';
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<LoginPage />} />

//         {/* Protected routes with shared layout */}
//         <Route path="/" element={<DashboardLayout />}>
//           <Route index element={<DashboardPage />} />
//           <Route path="product" element={<ProductList />} />
//           <Route path='/billing' element={<BillingPage/>}/>
//         </Route>
//       </Routes>
//     </Router>
//   )
// }

// export default App;


import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from './components/auth/Register.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductList from './components/product/ProductList.jsx';
import BillingPage from './pages/BillingPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import MyShop from './services/shop.jsx';
import Footer from './components/ui/Footer.jsx';
function App() {
  return (
    <Router>
      <Routes>
        {/* ============= PUBLIC ROUTES ============= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ============= PROTECTED ROUTES ============= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
              <Footer/>
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route index element={<DashboardPage />} />

          {/* Products */}
          <Route path="product" element={<ProductList />} />

          {/* Billing */}
          <Route path="billing" element={<BillingPage />} />
          <Route path='shop' element={<MyShop/>}/>
        </Route>

        {/* ============= CATCH ALL ============= */}
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App;