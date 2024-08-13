import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/fetchEmployees');
                const result = await response.json();

                if (Array.isArray(result.data)) {
                    localStorage.setItem('employees', JSON.stringify(result.data));
                } else {
                    console.error('Expected an array but got:', result);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const storedEmployees = localStorage.getItem('employees');

        if (storedEmployees) {
            const parsedEmployees = JSON.parse(storedEmployees);
            if (Array.isArray(parsedEmployees)) {
                setEmployees(parsedEmployees);
            } else {
                console.error('Expected an array but got:', parsedEmployees);
            }
        }
    }, []);

    const handleEdit = (employee) => {
        navigate('/edit-employee', { state: { employee } });
    };

    const handleDelete = (employeeId) => {
        const conf = confirm("Are you sure you want to delete this employee?");
        if (conf) {
            fetch(`http://localhost:3000/api/deleteEmployee/${employeeId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(() => {
                    const updatedEmployees = employees.filter(emp => emp._id !== employeeId);
                    setEmployees(updatedEmployees);
                    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
                })
                .catch(error => console.error('Error deleting employee:', error));
        }
    };

    // Filter employees based on the search term
    const filteredEmployees = employees.filter(employee => {
        const { name, email, _id, createdAt } = employee;
        const searchLower = searchTerm.toLowerCase();
        return (
            name.toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower) ||
            _id.toLowerCase().includes(searchLower) ||
            new Date(createdAt).toLocaleDateString().includes(searchLower) // Format to compare dates
        );
    });

    return (
        <>
            <Navbar />
            <h1 className='p-5 px-20 bg-custDash'>Employee List</h1>
            <div className="mx-auto p-6">
                <Link to="/create-employee" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-600 right-6 top-6">
                    Create Employee
                </Link>
                <input
                    type="text"
                    className='bg-transparent px-3 py-2 outline-none border-2 border-white float-right rounded-xl w-[450px]'
                    placeholder='Enter search keyword'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table className="min-w-full bg-black border border-gray-300 mt-10">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Unique ID</th>
                            <th className="py-2 border-b text-left">Image</th>
                            <th className="py-2 border-b text-left">Name</th>
                            <th className="py-2 border-b text-left">Email</th>
                            <th className="py-2 border-b text-left">Mobile</th>
                            <th className="py-2 border-b text-left">Designation</th>
                            <th className="py-2 border-b text-left">Gender</th>
                            <th className="py-2 border-b text-left">Course</th>
                            <th className="py-2 border-b text-left">Create Date</th>
                            <th className="py-2 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee._id}>
                                <td className="py-2 px-4 border-b">{employee._id}</td>
                                <td className="py-2 border-b">
                                    <img
                                        src={`data:image/png;base64,${employee.img}`}
                                        alt="Employee"
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="py-2 border-b">{employee.name}</td>
                                <td className="py-2 border-b">{employee.email}</td>
                                <td className="py-2 border-b">{employee.mobile}</td>
                                <td className="py-2 border-b">{employee.designation}</td>
                                <td className="py-2 border-b">{employee.gender}</td>
                                <td className="py-2 border-b">{employee.course}</td>
                                <td className="py-2 border-b">
                                    {new Date(employee.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </td>

                                <td className="py-2 border-b">
                                    <button
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                        onClick={() => handleEdit(employee)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
                                        onClick={() => handleDelete(employee._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default EmployeeList;
