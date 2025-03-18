import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Services/firebase';
import {checkUserExists, addUser,checkGoogleCredentials, checkCredentials } from '../../Services/Users'
import { AuthLayout } from './AuthenticationLayout';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(0, 'Password must be at least 8 characters long'),
  
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");
  const location = useLocation(); 
  const role = location.state?.role || "";
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      
      const userExists = await checkUserExists(data.email);
      if (!userExists) {
        setUserMessage('User not found. Please sign up first')
        toast.error('User not found. Please sign up first.');
        return;
      }

      const checkCredential = await checkCredentials(data.email,data.password,role);
      if (!checkCredential) {
        setUserMessage("Please Check your credentials")
        toast.error("Please Check your credentials");
        return;
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Successfully logged in!');
      navigate(`/${role}`,{state :{email : data.email,role:role}});
    } catch (error) {
      setUserMessage("Invalid Credentials")
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userExists = await checkUserExists(result.user.email);
      if (!userExists) {
        const userData = {
          id: Date.now().toString(),
          name: result.user.displayName,
          email: result.user.email,
          role:role,
          method: 'google'
        };
      role == "manager" ? (userData.staff = [], userData.location = {} ): ""
      await addUser(userData);
      toast.success('Successfully logged in with Google!');
      navigate(`/${role}`,{state :{email : result.user.email,role:userData.role}});
      }
      else{
        const check = await checkGoogleCredentials(result.user.email,role)
        if(!check)
        {
          setUserMessage("wrong credentials")
        }
        else
        {
            toast.success('Successfully logged in with Google!');
            navigate(`/${role}`,{state :{email : result.user.email,role:role}});
        }
    }
  } catch (error) {
    toast.error('Failed to login with Google');
    setUserMessage("Failed to login with Google")
  }
};

  return (
    <AuthLayout 
      title={`Welcome Back, ${role}`} 
      subtitle="Login into your account to continue" >
    <div>  
      <form onSubmit={handleSubmit(handleLogin)} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text">
              <Mail size={20} className="text-muted" />
            </span>
            <input
              {...register('email')}
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}` }
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <Lock size={20} className="text-muted" />
            </span>
            <input
              {...register('password')}
              type="password"
              className={`form-control`}
              placeholder="Enter your password"
            />
          </div>
          {userMessage && (
            <div className="alert alert-danger mt-2" role="alert">
              {userMessage}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-100"
        >
          {isLoading ? 'Loading...' : 'Login'}
        </motion.button>
      </form>

      <div className="divider text-center">
        <span>or continue with</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleLogin}
        className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" />
        Google
      </motion.button>

      <p className="text-center mt-4 mb-0">
        Don't have an account?{' '}
        <Link to="/signup" state={{ role: role }} className="text-primary text-decoration-none">
          Sign up
        </Link>
      </p>
    </div>
    </AuthLayout>
  );
}