'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import LoadingSpinner from 'components/LoadingSpinner';

interface Props {
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

const Button = ({
  onClick, href, primary = false, disabled = false, children}: Props
): JSX.Element => {
  const className = clsx(styles.btn, primary && styles.primary);
  const { pending } = useFormStatus();

  if (href !== undefined) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled || pending} className={className} onClick={onClick}>
      {pending && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button;
