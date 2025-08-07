import { motion } from 'framer-motion';

const GlowButton = ({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const base = 'relative inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed isolate trace-snake';
  const variants = {
    primary: 'bg-cinema-dark text-white border border-cinema-gray',
    secondary: 'bg-cinema-gray text-white border border-cinema-light',
  };

  return (
    <motion.button
      whileHover={{}}
      whileTap={{}}
      disabled={disabled}
      type={type}
      className={`${base} snake-hover ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span className="trace-line trace-line--t" />
      <span className="trace-line trace-line--r" />
      <span className="trace-line trace-line--b" />
      <span className="trace-line trace-line--l" />
    </motion.button>
  );
};

export default GlowButton;


