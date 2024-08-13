import React from 'react';
import { useForm } from 'react-hook-form';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate(); // Hook for navigation

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Append all form data to FormData object
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('mobile', data.mobile);
            formData.append('designation', data.designation);
            formData.append('gender', data.gender);
            formData.append('course', JSON.stringify(data.course)); // Send course as a JSON string

            // Append the image file
            formData.append('img', data.img[0]);

            const response = await fetch('http://localhost:3000/api/createEmployee', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Employee created successfully:', result);
                alert(result.message);
                navigate(-1);
                // window.location.reload()
            } else {
                console.error('Error creating employee:', result.message);
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Navbar />
            <h1 className='p-5 px-20 bg-custDash sticky top-16'>Create Employee</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="w-2/4 mx-auto mt-2 p-5 bg-slate-700 shadow-md rounded-md">
                {/* Name Field */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-semibold mb-2">Name</label>
                    <input
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                        type="text"
                        placeholder="Enter your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-white font-semibold mb-2">Email</label>
                    <input
                        id="email"
                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
                        className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                        type="email"
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Mobile Number Field */}
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-white font-semibold mb-2">Mobile No</label>
                    <input
                        id="mobile"
                        {...register('mobile', { required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' } })}
                        className={`w-full px-3 py-2 border rounded-md ${errors.mobile ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                        type="text"
                        placeholder="Enter your mobile number"
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
                </div>

                {/* Designation Field */}
                <div className="mb-4">
                    <label htmlFor="designation" className="block text-white font-semibold mb-2">Designation</label>
                    <select
                        id="designation"
                        {...register('designation', { required: 'Designation is required' })}
                        className={`w-full px-3 py-2 border rounded-md ${errors.designation ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    >
                        <option className='text-black' value="">Select Designation</option>
                        <option className='text-black' value="HR">HR</option>
                        <option className='text-black' value="Manager">Manager</option>
                        <option className='text-black' value="Sales">Sales</option>
                    </select>
                    {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
                </div>

                {/* Gender Field */}
                <div className="mb-4">
                    <label className="block text-white font-semibold mb-2">Gender</label>
                    <div className="flex items-center">
                        <label className="mr-4">
                            <input
                                type="radio"
                                {...register('gender', { required: 'Gender is required' })}
                                value="Male"
                                className="mr-1"
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                {...register('gender', { required: 'Gender is required' })}
                                value="Female"
                                className="mr-1"
                            />
                            Female
                        </label>
                    </div>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>

                {/* Course Field */}
                <div className="mb-4">
                    <label className="block text-white font-semibold mb-2">Course</label>
                    <div className="flex flex-col">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="MCA"
                                {...register('course')}
                                className="mr-2"
                            />
                            MCA
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="BCA"
                                {...register('course')}
                                className="mr-2"
                            />
                            BCA
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="BSc"
                                {...register('course')}
                                className="mr-2"
                            />
                            BSc
                        </label>
                    </div>
                </div>

                {/* Image Upload Field */}
                <div className="mb-4">
                    <label htmlFor="img" className="block text-white font-semibold mb-2">Upload Image</label>
                    <input
                        id="img"
                        type="file"
                        {...register('img', {
                            required: 'Image is required',
                            validate: {
                                acceptedFormats: file => {
                                    const isJpgOrPng = file[0]?.type === 'image/jpeg' || file[0]?.type === 'image/png';
                                    return isJpgOrPng || 'Only JPG or PNG files are accepted';
                                }
                            }
                        })}
                        className={`w-full px-3 py-2 border rounded-md ${errors.img ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    />
                    {errors.img && <p className="text-red-500 text-sm mt-1">{errors.img.message}</p>}
                </div>

                <button type="submit" className="w-full bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600">
                    Create Employee
                </button>
            </form>
        </>
    );
};

export default CreateEmployee;
