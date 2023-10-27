import styles from './styles.module.scss';

interface Props {
  title: string;
}

const Header = ({ title }: Props) => (
  <header className={styles.header}>
    <div className={styles.logo} />
    <div className={styles.title}>{title}</div>
  </header>
)

export default Header;
