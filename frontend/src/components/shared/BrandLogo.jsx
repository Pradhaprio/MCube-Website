export function BrandLogo({
  profile,
  size = 'md',
  light = false,
  showTagline = true,
  showText = true,
  className = ''
}) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const imageClassName = sizeClasses[size] || sizeClasses.md;
  const nameClassName = light ? 'text-white' : 'text-brand-950 dark:text-brand-100';
  const tagClassName = light ? 'text-accent-200' : 'text-accent-700 dark:text-accent-300';

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <img
        src="/mcube-mark.svg"
        alt="M-Cube Mobile logo"
        className={`${imageClassName} shrink-0 rounded-full shadow-lift`}
      />
      {showText && (
        <div>
          <div className={`font-display text-base font-semibold tracking-[0.14em] ${nameClassName}`}>
            {profile?.shopName || 'M-Cube Mobile'}
          </div>
          {showTagline && (
            <div className={`text-[11px] font-semibold uppercase tracking-[0.42em] ${tagClassName}`}>
              Mobiles
            </div>
          )}
        </div>
      )}
    </div>
  );
}
