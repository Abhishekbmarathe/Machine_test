import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import EmployeeList from './components/Emplist'
import CreateEmployee from './components/Createemp';
import EditEmployee from './components/EditEmployee';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/employee-list" element={<EmployeeList />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/edit-employee" element={<EditEmployee />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
