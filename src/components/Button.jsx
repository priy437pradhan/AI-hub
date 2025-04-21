
export default function Button({ children, variant = "primary", className = "", ...props }) {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500",
      outline: "border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/30",
      ghost: "text-primary-500 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/30",
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }