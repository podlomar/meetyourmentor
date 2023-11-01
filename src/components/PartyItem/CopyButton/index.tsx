"use client"
import { useState } from 'react';
import styles from './styles.module.scss';
import copyIcon from './img/copy.svg';
import tickIcon from './img/tick.svg';
import Image from 'next/image';

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
      {isCopied
        ?
        <Image className={styles.icon} src={tickIcon} alt="copied icon"></Image>
        :
        <Image className={styles.icon} src={copyIcon} alt="copy icon"></Image>}
    </button>
  );
};

export default CopyButton;
