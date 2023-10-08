"use client"
import { useState } from 'react';
import styles from './styles.module.scss';

interface Props {
  href: string,
}

const CopyButton = ({ href }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    const location = "meetyourmentor.vercel.app";
    navigator.clipboard.writeText(location + href);
    setIsCopied(true);
  };

  return (
    <button className={styles.copyButton} onClick={handleClick}>
      {isCopied ? 'Zkopírováno ✔' : 'Zkopírovat url'}
    </button>
  );
};

export default CopyButton;
