import { motion } from 'framer-motion';
import loginImg from "../../assets/LoginPagePicture.jpg";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">

      <div className="d-flex flex-column flex-lg-row w-100" style={{ maxWidth: '64rem' }}>
        
        {/* Image Side */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="d-none d-lg-flex w-100 w-lg-50 d-flex align-items-stretch p-0"
        >
          <div className="w-100 h-100 rounded overflow-hidden">
            <img
              src={loginImg}
              alt="Login background"
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-100 w-lg-50 d-flex align-items-stretch p-0"
        >
          <div 
            className="w-100 shadow-lg rounded p-4 p-md-5 bg-light"
          >
            <div className="mb-4 text-center">
              <h4 className="display-5 fw-bold text-primary mb-2">{title}</h4>
              {/* <p className="text-muted">{subtitle}</p> */}
            </div>
            {children}
          </div>
        </motion.div>

      </div>
    </div>
  );
}