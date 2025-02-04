import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { auth } from './Firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { getRole } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userRole = await getRole(user.uid);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/dashboard">
          {role === 'customer' ? <CustomerDashboard /> : role === 'agent' ? <AgentDashboard /> : <Login />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
