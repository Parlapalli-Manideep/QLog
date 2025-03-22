import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Services/firebase';
import { PasswordStrength } from './PasswordStrength';
import { addUser, checkUserExists,checkGoogleCredentials } from '../../Services/Users';
import { AuthLayout } from './AuthenticationLayout';
import { toast } from 'react-toastify';
import google from '../../assets/google.ico'

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
  const [userMessage , setUserMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const role = location.state?.role || "";
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  const handleSignup = async (data) => {
    try {
      setIsLoading(true);
      const userMessage = await checkUserExists(data.email);
      if (userMessage){
        toast.error('User with this email already exists');
        setUserMessage("User already exists")
        return;
      }
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      const userData = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
        role:  role,
        method: 'email'
      };
      role == "manager" ?( userData.staff = [], userData.location = {} ): ""

      await addUser(userData);
      toast.success('Account created successfully!');
      navigate('/login',{state :{ role:userData.role}});

    } catch (error) {
      toast.error('Failed to create account');
      setUserMessage('Failed to create account');
    } finally {
      setIsLoading(false);
    }
};

const handleGoogleSignup = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const userMessage = await checkUserExists(result.user.email);
    if (!userMessage) {
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
      navigate(`/${role}`,{state :{email : result.user.email, role:role}});
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
            const userid = await getUserByEmail(result.user.email,userData.role);
            navigate(`/${role}`,{state :{id:userid.id}});
        }
    }
  } catch (error) {
    toast.error('Failed to login with Google');
    setUserMessage("Failed to login with Google")
  }
};
  return (
    <AuthLayout 
              title={`Create an ${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'} account`}
              subtitle="Sign up to get started"
    > 
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
          {isLoading ? 'Creating account...' : 'Sign up'}
        </motion.button>
      </form>

      <div className="divider text-center">
        <span>or continue with</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignup}
        className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
      >
        <img src= {google} alt="Google" width="20" height="20" />
        Google
      </motion.button>

      <p className="text-center mt-4 mb-0">
        Already have an account?{' '}
        <Link to="/login" state={{ role: role }} className="text-primary text-decoration-none">
          Login
        </Link>
      </p>
    </div>
    </AuthLayout>
  );
}