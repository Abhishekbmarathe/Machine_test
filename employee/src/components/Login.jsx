import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate(); // Hook for navigation
    
    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Handle successful response
                const result = await response.json();
                alert(result.message)
                navigate('/Home');
                console.log('Success:', result);
            } else {
                // Handle errors
                const result = await response.json();
                alert(result.message)
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-14 p-6 bg-slate-700 shadow-md rounded-md">
            <h1 className='text-4xl font-bold mb-14 m-auto w-fit'>Login</h1>
            <div className="mb-4">
                <label htmlFor="username" className="block text-white font-semibold mb-2">Username</label>
                <input
                    id="username"
                    {...register('username', { required: 'Username is required' })}
                    className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    type="text"
                    placeholder="Enter your username"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold mb-2">Password</label>
                <input
                    id="password"
                    {...register('password', { required: 'Password is required' })}
                    className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                    type="password"
                    placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600">
                Login
            </button>
        </form>
    );
};

export default LoginForm;
