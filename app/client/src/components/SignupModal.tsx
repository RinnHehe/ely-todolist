import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.id) {
        // Auto login after registration
        const loginResponse = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (loginData.token) {
          login(loginData.token);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-slideIn" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-900 leading-none"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-900">Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary focus:ring-opacity-10 transition-all"
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button onClick={onClose} className="text-primary font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
