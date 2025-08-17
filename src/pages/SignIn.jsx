import { useState } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signInEmailPassword, isLoading, isError, error } = useSignInEmailPassword();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { isSuccess } = await signInEmailPassword(email, password);
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <div style={{backgroundColor:'lightgray', padding: '20px', borderRadius: '5px', marginLeft:'400px'}}>
      <h2>Sign In</h2>
      <form onSubmit={handleOnSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={isLoading}>Sign In</button>
        {isError && <p>{error?.message}</p>}
      </form>
      <p>No account? <Link to="/sign-up">Sign up</Link></p>
    </div>
  );
};

export default SignIn;