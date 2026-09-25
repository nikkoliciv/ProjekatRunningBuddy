import { Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashbord"
import ProtectedRoute from "./route/ProtectedRoute";
import PlanDetails from "./components/PlanDetails";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      

      <Navbar />
        <Routes>
          {/* home */}
          <Route path='/' element= {<Home />} />
          {/* register */}
          <Route path='/register' element= {<Register />} />
          {/* login */}
          <Route path='/login' element= {<Login />} />
          {/* dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* adminDashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* detaljiplanova */}
          <Route path="/plan/:id" element={<ProtectedRoute><PlanDetails /></ProtectedRoute>} />
          {/* profil */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>
        
    </div>
  );
}

export default App;
