/**
 * ShinyText Component (ReactBits.dev style)
 * Creates an animated metallic/glass light reflection sweeping across text.
 */
const ShinyText = ({ children, className = "", speed = 4 }) => {
  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent bg-[linear-gradient(110deg,#1e1b4b,40%,#818cf8,50%,#1e1b4b,60%)] bg-[length:200%_100%] animate-shimmer ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  );
};

export default ShinyText;
