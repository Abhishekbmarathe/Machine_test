import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const EditEmployee = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const employee = location.state?.employee;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [], 
        img: '', 
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email,
                mobile: employee.mobile,
                designation: employee.designation,
                gender: employee.gender,
                course: employee.course || [],
                img: employee.img,
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    img: reader.result.split(',')[1], 
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const course = checked
                ? [...prevData.course, value]
                : prevData.course.filter(course => course !== value);
            return {
                ...prevData,
                course,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = { ...formData, course: JSON.stringify(formData.course) };
            const response = await fetch(`http://localhost:3000/api/updateEmployee/${employee._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();
            if (result.status) {
                alert('Employee updated successfully!');
                navigate('/employee-list'); 
            } else {
                alert('Error updating employee: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <>
            <Navbar />
            <h1 className='p-5 px-20 bg-custDash sticky top-16'>Employee Edit</h1>
            <div className="w-2/4 mx-auto p-6">
                <form onSubmit={handleSubmit} className='mx-auto p-6 bg-slate-700 shadow-md rounded-md'>
                    <div className="mb-4">
                        <label className="block text-white" htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full bg-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full bg-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white" htmlFor="mobile">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            id="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full bg-transparent"
                        />
                    </div>
                    
                    {/* Designation Field as Dropdown */}
                    <div className="mb-4">
                        <label className="block text-white" htmlFor="designation">Designation</label>
                        <select
                            name="designation"
                            id="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full bg-transparent"
                        >
                            <option className='text-black' value="" disabled>Select Designation</option>
                            <option className='text-black' value="HR">HR</option>
                            <option className='text-black' value="Manager">Manager</option>
                            <option className='text-black' value="Sales">Sales</option>
                        </select>
                    </div>

                    {/* Gender Field */}
                    <div className="mb-4">
                        <label className="block text-white">Gender</label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleChange}
                                required
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleChange}
                                required
                            />
                            Female
                        </label>
                    </div>

                    {/* Course Field */}
                    <div className="mb-4">
                        <label className="block text-white">Course</label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="MCA"
                                checked={formData.course.includes('MCA')}
                                onChange={handleCourseChange}
                                className="mr-2"
                            />
                            MCA
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="BCA"
                                checked={formData.course.includes('BCA')}
                                onChange={handleCourseChange}
                                className="mr-2 bg-transparent"
                            />
                            BCA
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="BSc"
                                checked={formData.course.includes('BSc')}
                                onChange={handleCourseChange}
                                className="mr-2"
                            />
                            BSc
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-white" htmlFor="img">Upload Image</label>
                        <input
                            type="file"
                            name="img"
                            id="img"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 p-2 w-full bg-transparent"
                        />
                    </div>
                    <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditEmployee;
