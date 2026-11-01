import { forwardRef, useState, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Person’s full name. Used as the accessible name and to derive the initials. */
  name: string;
  /** Image URL. Initials are shown if it is missing or fails to load. */
  src?: string;
  /** Use beside the same visible name to avoid duplicate announcements. */
  decorative?: boolean;
  /** Diameter of the avatar. */
  size?: 'sm' | 'md' | 'lg';
  /** Text shown instead of the initials derived from `name`. */
  fallback?: string;
}

function AvatarImage({ src, initials }: { src?: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img src={src} alt="" onError={() => setFailed(true)} />
  ) : (
    <span>{initials}</span>
  );
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, decorative = false, size = 'md', fallback, className, ...props },
  ref,
) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    fallback ??
    (words.length
      ? `${Array.from(words[0]!)[0]}${words.length > 1 ? Array.from(words[words.length - 1]!)[0] : ''}`.toUpperCase()
      : '?');
  return (
    <span
      {...props}
      ref={ref}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name.trim() || 'Unknown person'}
      aria-hidden={decorative || undefined}
      className={classes('fui-avatar', `fui-avatar-${size}`, className)}
    >
      <span aria-hidden="true">
        <AvatarImage key={src ?? ''} src={src} initials={initials} />
      </span>
    </span>
  );
});
