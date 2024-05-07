import { Mentee, Mentor } from 'db/schema';
import styles from './styles.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import mentorImg from 'img/mentor.svg';
import menteeImg from 'img/mentee.svg';

interface Props {
  mentor: Mentor;
  mentorScore: number;
  mentee: Mentee;
  menteeScore: number;
}

const PairingItem = ({ mentor, mentorScore, mentee, menteeScore }: Props) => (
  <div className={styles.pairItem}>
    <div className={styles.party}>
      <div className={`${styles.pairIndex} ${styles.pairIndexMentor}`}>{mentorScore}</div>
      <Image src={mentorImg} alt="Mentor" className={`${styles.icon} ${styles.iconMentor}`} />
      <div className={styles.info}>
        <div className={styles.title}>{mentor.company}</div>
        <div className={styles.names}>{mentor.names}</div>
        <Link href={`/parties/${mentor.uid}`} target="_blank">
          open preferences
        </Link>
      </div>
    </div>
    <div className={styles.party}>
      <div className={`${styles.pairIndex} ${styles.pairIndexMentee}`}>{menteeScore}</div>
      <Image src={menteeImg} alt="Mentee" className={styles.icon} />
      <div className={styles.info}>
        <div className={styles.title}>{mentee.project}</div>
        <div className={styles.names}>{mentee.names}</div>
        <Link href={`/parties/${mentee.uid}`} target="_blank">
          open preferences
        </Link>
      </div>
    </div>
  </div>
)

export default PairingItem
