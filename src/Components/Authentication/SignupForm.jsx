import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Services/firebase';
import { PasswordStrength } from './PasswordStrength';
import { addUser, checkUserExists } from '../../Services/users';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const role = location.state?.role || "";
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  const handleSignup = async (data) => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const userExists = await checkUserExists(data.email);
      if (userExists) {
        toast.error('User with this email already exists');
        return;
      }

      // Create user in Firebase
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Create user object with role
      const userData = {
        id: Date.now().toString(), // Generate unique ID
        name: data.name,
        email: data.email,
        password: data.password,
        role:  role, // Default role if not provided
        method: 'email'
      };

      // Save user to JSON Server
      await addUser(userData);
      toast.success('Account created successfully!');
      navigate('/login');

    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
};

const handleGoogleSignup = async () => {
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
      <form onSubmit={handleSubmit(handleSignup)} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <div className="input-group">
            <span className="input-group-text"><User size={20} className="text-muted" /></span>
            <input {...register('name')} type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Enter your name" />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text"><Mail size={20} className="text-muted" /></span>
            <input {...register('email')} type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Enter your email" />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text"><Lock size={20} className="text-muted" /></span>
            <input
              {...register('password')}
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
          {isTyping && <PasswordStrength password={password} />}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-100 mb-3"
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </motion.button>
      </form>

      <div className="divider">
        <span>Or continue with</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignup}
        className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" />
        Sign up with Google
      </motion.button>

      <p className="text-center mt-4 mb-0">
        Already have an account?{' '}
        <Link to="/login" className="text-primary text-decoration-none">
          Sign in
        </Link>
      </p>
    </div>
  );
}