import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[a-z]/, text: 'One lowercase letter' },
  { regex: /[A-Z]/, text: 'One uppercase letter' },
  { regex: /[^A-Za-z0-9]/, text: 'One special character' },
];

export function PasswordStrength({ password }) {
  return (
    <div className="mt-2">
      {requirements.map((requirement, index) => {
        const isMet = requirement.regex.test(password);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="password-strength-item"
          >
            {isMet ? (
              <Check className="text-success" size={16} />
            ) : (
              <X className="text-danger" size={16} />
            )}
            <span className={`small ${isMet ? 'text-success' : 'text-danger'}`}>
              {requirement.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}