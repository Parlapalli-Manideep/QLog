import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Services/firebase';
import { PasswordStrength } from './PasswordStrength';
import { addUser, checkUserExists, getUserById, checkEmployeeExists, checkManagerExists, getId, registerUser } from '../../Services/Users';
import { AuthLayout } from './AuthenticationLayout';
import { toast } from 'react-toastify';
import google from '../../assets/google.ico';
import ManagerIdModal from '../Modals/ManagerIdModal';

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
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [manager, setManager] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "";
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
  });

  const password = watch('password', '');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (data) => {
    try {
      setIsLoading(true);
      const userMessage = await checkUserExists(data.email);
      if (userMessage) {
        toast.error('User with this email already exists');
        setUserMessage("User already exists");
        return;
      }
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      const userData = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
        method: 'email'
      };

      await registerUser(userData);
      toast.success('Account created successfully!');
      navigate('/login', { state: { role: userData.role } });

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
          role: role,
          method: 'google'
        };

        if (role === "manager") {
          userData.staff = [];
          userData.location = {};
        }

        await addUser(userData);
        toast.success('Successfully signed up with Google!');

        if (role === "employee") {
          setEmployee(userData);
          setShowManagerModal(true);
          return;
        }

        navigate(`/${role}`, { state: { id: userData.id } });
      } else {
        const check = role == 'employee' ? await checkEmployeeExists(result.user.email) : await checkManagerExists(result.user.email)
        if (!check) {
          setUserMessage("Wrong credentials");
        } else {
          toast.success('Successfully logged in with Google!');
        const employee = await getId(result.user.email,role)  

          if (role === "employee" && !employee.managerId) {
            setEmployee(employee);
            setShowManagerModal(true);
            return;
          }

          navigate(`/${role}`, { state: { id: employee.id } });
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error('Failed to login with Google');
      setUserMessage("Failed to login with Google");
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
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
              />
              <span 
                className="input-group-text cursor-pointer" 
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={20} className="text-muted" /> : <Eye size={20} className="text-muted" />}
              </span>
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
          <img src={google} alt="Google" width="20" height="20" />
          Google
        </motion.button>

        <p className="text-center mt-4 mb-0">
          Already have an account?{' '}
          <Link to="/login" state={{ role: role }} className="text-primary text-decoration-none">
            Login
          </Link>
        </p>
      </div>

      {showManagerModal && employee && (
        <ManagerIdModal
          employee={employee}
          show={showManagerModal}
          onClose={() => setShowManagerModal(false)}
          onUpdate={async (updatedEmployee) => {
            setEmployee(updatedEmployee);

            if (updatedEmployee.managerId) {
              try {
                const managerUser = await getUserById(updatedEmployee.managerId, "manager");
                setManager(managerUser);
              } catch (error) {
                console.error("Error fetching manager:", error);
              }
            }
          }}
        />
      )}
    </AuthLayout>
  );
}