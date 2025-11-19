import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clemsonLogo from '../assets/Clemson_Tigers_logo.svg';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function SignInPage() { // Remove onSignIn prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    const url = `${process.env.REACT_APP_AUTH_API_URL}/api/auth/login`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If server returns an error, use its message
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user); // Update auth context
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src={clemsonLogo}
          alt="TigerTix"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-orange-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              
                <div className="text-sm">
                  <a href="#" className="font-semibold text-orange-500 hover:text-orange-600">
                    Forgot password?
                  </a>
                </div>
              
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-orange-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold leading-6 text-orange-500 hover:text-orange-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
