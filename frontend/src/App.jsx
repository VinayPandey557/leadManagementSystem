import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeadsList from "./pages/LeadsList";
import LeadForm from "./pages/LeadForm";
import { getCurrentUser, logout } from "./api/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="p-4">
        {user ? (
          <>
            <h1>Welcome, {user.email}</h1>
            <p>ID: {user.id}</p>

            <Link
              to="/leads/new"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Create New Lead
            </Link>

            <Link
              to="/leads"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              View Leads
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : null}
      </div>

      <Routes>
        
        {!user && (
          <>
            <Route
              path="/login"
              element={
                <Login onLogin={() => getCurrentUser().then((res) => setUser(res.data))} />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

       
        {user && (
          <>
            <Route path="/leads" element={<LeadsList />} />
            <Route path="/leads/new" element={<LeadForm />} />
            <Route path="/leads/:id/edit" element={<LeadForm />} />
            <Route path="*" element={<Navigate to="/leads" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
