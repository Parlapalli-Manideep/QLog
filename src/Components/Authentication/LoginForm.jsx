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
import { checkCredentials,checkUserExists, addUser,checkGoogleCredentials } from '../../Services/users';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const role = location.state?.role || "";
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      
      // Check if user exists in JSON server
      const userExists = await checkCredentials(data.email,data.password,role);
      if (!userExists) {
        toast.error('User not found. Please sign up first.');
        return;
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Successfully logged in!');
      navigate(`/${role}`);
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in JSON server
      const userExists = await checkUserExists(result.user.email);
      if (!userExists) {
        // Add user to JSON server if they don't exist
        const userData = {
          id: Date.now().toString(),
          name: result.user.displayName,
          email: result.user.email,
          role:role,
          method: 'google'
        };
        await addUser(userData);
      toast.success('Successfully logged in with Google!');
        navigate(`/${role}`);
      }
      else{
          const check = await checkGoogleCredentials(result.user.email,role)
          if(!check)
          {
            alert("wrong credentials")
            console.log("wrong credentials")
          }
          else
          {
              toast.success('Successfully logged in with Google!');
              navigate(`/${role}`);
          }
      }
    } catch (error) {
      toast.error('Failed to login with Google');
    }
  };

  return (
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
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-100 mb-3"
        >
          {isLoading ? 'Loading...' : 'Sign in'}
        </motion.button>
      </form>

      <div className="divider">
        <span>Or continue with</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleLogin}
        className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" />
        Sign in with Google
      </motion.button>

      <p className="text-center mt-4 mb-0">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary text-decoration-none">
          Sign up
        </Link>
      </p>
    </div>
  );
}