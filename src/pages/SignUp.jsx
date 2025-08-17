import { useState } from 'react';
import { useSignUpEmailPassword } from '@nhost/react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signUpEmailPassword, isLoading, isError, error } = useSignUpEmailPassword();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { isSuccess } = await signUpEmailPassword(email, password);
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <div style={{backgroundColor:'lightgreen', padding: '20px', borderRadius: '5px', marginLeft:'400px'}}>
      <h2>Sign Up</h2>
      <form onSubmit={handleOnSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={isLoading}>Sign Up</button>
        {isError && <p>{error?.message}</p>}
      </form>
      <p>Already have an account? <Link to="/sign-in">Sign in</Link></p>
    </div>
  );
};

export default SignUp;