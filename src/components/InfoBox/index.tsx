import styles from './styles.module.scss';

interface Props {
  icon?: string;
  children: React.ReactNode;
}

const InfoBox = ({ icon, children }: Props): JSX.Element => (
  <div className={styles.info}>
    {icon === undefined
      ? <div className={styles.icon} />
      : <img className={styles.iconImg} src={icon} alt="icon" />}
    <div className={styles.body}>
      {children}
    </div>
  </div>
)

export default InfoBox;
