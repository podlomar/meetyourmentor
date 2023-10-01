import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Link from 'next/link';

interface Props {
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

const Button = (
  { onClick, href, primary = false, disabled = false, children
}: Props): JSX.Element => {
  const className = clsx(styles.btn, primary && styles.primary);  
  
  if (href !== undefined) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
