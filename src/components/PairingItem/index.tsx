import { Mentee, Mentor } from 'db/schema';
import styles from './styles.module.scss';
import Image from 'next/image';
import mentorImg from '../PartyBanner/img/mentor.svg';
import menteeImg from '../PartyBanner/img/mentee.svg';
import pairIcon from './img/pair.svg';

interface Props {
  mentor: Mentor;
  mentee: Mentee;
}

const PairingItem = ({ mentor, mentee }: Props) => (
  <div className={styles.pairItem}>
    <div className={styles.party}>
      <Image src={mentorImg} alt="Mentor" className={`${styles.icon} ${styles.iconMentor}`} />
      <div className={styles.info}>
        <div className={styles.bold}>{mentor.company}</div>
        <div>{mentor.names}</div>
      </div>
    </div>
    <div className={styles.match}>
      <div className={`${styles.pairIndex} ${styles.pairIndexMentor}`}>{mentor.index}</div>
      <Image src={pairIcon} alt="Pair" />
      <div className={`${styles.pairIndex} ${styles.pairIndexMentee}`}>{mentee.index}</div>
    </div>
    <div className={styles.party}>
      <Image src={menteeImg} alt="Mentee" className={styles.icon} />
      <div className={styles.info}>
        <div className={styles.bold}>{mentee.project}</div>
        <div>{mentee.names}</div>
      </div>
    </div>
  </div>
)

export default PairingItem
