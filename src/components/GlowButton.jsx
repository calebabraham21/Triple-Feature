const GlowButton = ({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center rounded px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-ink text-paper border border-ink hover:bg-reel hover:border-reel',
    secondary: 'bg-frame text-ink border border-ash hover:border-fog',
  };

  return (
    <button
      disabled={disabled}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
};

export default GlowButton;
