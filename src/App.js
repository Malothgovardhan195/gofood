import './App.css';
import './darkTheme.css';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'  //npm i bootstrap-dark-5 boostrap
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import HomeFixed from './screens/HomeFixed';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './screens/Login';
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer';
import MyOrder from './screens/MyOrder';
import Cart from './screens/Cart';

// Import theme provider
import { ThemeProvider } from './components/ThemeContext';
import OrderAnalytics from './components/OrderAnalytics';
import UPIDebugger from './components/UPIDebugger';
import UPITester from './components/UPITester';

function App() {
  return (
    <CartProvider>
      <ThemeProvider>
        <Router basename={process.env.NODE_ENV === 'production' ? '/' : '/'}>
          <div>
            <Routes>
              <Route path="/" element={<HomeFixed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/myorder" element={<MyOrder />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/analytics" element={<OrderAnalytics />} />
              <Route path="/upi-test" element={<UPIDebugger />} />
              <Route path="/upi-tester" element={<UPITester />} />
              <Route path="*" element={<HomeFixed />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App;
