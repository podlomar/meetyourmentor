import clsx from 'clsx';
import styles from './styles.module.scss';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const Page = ({ title, children }: Props) => (
  <div className={styles.page}>
    <header className={clsx(styles.header, styles.container)}>
      <div className={styles.logo} />
      <div className={styles.title}>{title}</div>
    </header>
    <main className={styles.container}>
      {children}
    </main>
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>Meet Your Mentor</p>
        <p>
          © 2023 by
          {' '}
          <a href="https://www.linkedin.com/in/martin-podlouck%C3%BD-5b415268">Martin Podloucký</a>,
          {' '}
          <a href="https://www.linkedin.com/in/eva-machova-frontend-developer">Eva Machová</a>
        </p>
      </div>
    </footer>
  </div>
);

export default Page;
