import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/api';

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await api(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (mode === 'login') {
      localStorage.setItem("authToken", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/");
    } else {
      alert("Registered successfully! You can now log in.");
      setMode("login");
    }
  } catch (err: any) {
    setError(err.message || `${mode} failed`);
  } finally {
    setLoading(false);
  }
};
  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {mode === 'register' && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required={mode === 'login' || mode === 'register'}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          {loading
            ? mode === 'login'
              ? 'Logging in...'
              : 'Registering...'
            : mode === 'login'
            ? 'Login'
            : 'Register'}
        </button>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button
          type="button"
          onClick={() => handleOAuth('google')}
          className="bg-red-500 text-white py-2 px-4 rounded w-full mb-2"
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('github')}
          className="bg-gray-800 text-white py-2 px-4 rounded w-full"
        >
          Continue with GitHub
        </button>

        <p className="text-center mt-6 text-sm">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 underline"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}
