import { motion } from 'framer-motion';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row">

      {/* Image Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="d-none d-lg-flex w-100 w-lg-50 d-flex align-items-center justify-content-center position-relative p-4 p-md-5"
      >
        <img
          src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Login background"
          className="w-100 h-100 object-fit-contain rounded shadow-lg"
        />
      </motion.div>

      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-100 w-lg-50 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white"
      >
        <div className="w-100" style={{ maxWidth: '32rem' }}>
          <div className="mb-4 text-center">
            <h2 className="display-5 fw-bold text-primary mb-2">{title}</h2>
            <p className="text-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}