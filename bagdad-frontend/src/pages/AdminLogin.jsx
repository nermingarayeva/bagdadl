import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔄 Login cəhdi...');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/auth/login', {
        email,
        password
      });

      console.log('✅ Response:', response.data);

      // Token-i localStorage-ə yadda saxla
      localStorage.setItem('adminToken', response.data.token);
      
      console.log('✅ Token yadda saxlandı');
      
      // Admin dashboard-a yönləndir
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('❌ Login xətası:', err);
      console.error('❌ Response:', err.response?.data);
      setError(err.response?.data?.message || 'Login xətası baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        
        <input
          type="password"
          placeholder="Şifrə"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Yüklənir...' : 'Daxil ol'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;