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
import { Toaster } from "sonner";
import ForgotPassword from './components/auth/Forgot-Password.jsx';
import VerifyOtp from './components/auth/Verify-OTP.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';
import ChangePassword from './components/auth/Change-Password.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* ============= PUBLIC ROUTES ============= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* <Toaster position="top-right" richColors /> */}
        {/* ============= PROTECTED ROUTES ============= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
              <Footer />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route index element={<DashboardPage />} />

          {/* Products */}
          <Route path="product" element={<ProductList />} />

          {/* Billing */}
          <Route path="billing" element={<BillingPage />} />
          <Route path='shop' element={<MyShop />} />
          <Route path='change-password' element={<ChangePassword />} />
        </Route>

        {/* ============= CATCH ALL ============= */}
        {/* Redirect any unknown route to home */}
        {/* <Toaster position="top-right" richColors /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  )
}

export default App;