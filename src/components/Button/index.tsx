import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Link from 'next/link';


interface Props {
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  children: ReactNode;
};

const Button = ({ onClick, href, primary = false, children }: Props): JSX.Element => {
  if (href !== undefined) {
    return (
      <Link
        className={clsx(styles.btn, primary && styles.primary)}
        href={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={clsx(styles.btn, primary && styles.primary)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
