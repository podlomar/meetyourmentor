import Link from "next/link";
import { Party } from "db/schema"; 1
import styles from "./styles.module.scss";
import Image from 'next/image';
import CopyButton from "./CopyButton";
import clockIcon from "./img/sand-clock.svg";
import tickIcon from "img/tick.svg";
import progressIcon from "./img/progress.svg";
import pairIcon from "img/pair.svg";

interface Props {
  party: Party;
}

const PartyItem = ({ party }: Props): JSX.Element => {
  const { status: { phase } } = party;
  const renderStatus = (): JSX.Element | null => {
    switch (party.status.phase) {
      case "preparation":
        return <Image className={styles.icon} src={clockIcon} alt="clock"></Image>;
      case "committed":
        return <Image className={styles.icon} src={tickIcon} alt="tick"></Image>;
      case "in-progress":
        return <Image className={styles.icon} src={progressIcon} alt="progress"></Image>;
      default:
        return null
    }
  }


  return (
    <div className={styles.partyItem}>
      <div className={styles.title}>
        {party.side === 'mentor' ? party.company : party.project}
        {phase === "in-progress" && <Image className={styles.icon} src={progressIcon} alt="progress"></Image>}
        {phase === "committed" && <Image className={styles.icon} src={tickIcon} alt="success"></Image>}
        {phase === "preparation" && <Image className={styles.icon} src={clockIcon} alt="clock"></Image>}
        {phase === "paired" && <Image className={styles.icon} src={pairIcon} alt="link"></Image>}
      </div>
      <div className={styles.names}>
        {party.names}
      </div>
      <div className={styles.link}>
        <Link href={`/parties/${party.uid}`} target="_blank">
          {`${process.env.SERVER_URL}/parties/${party.uid}`}
        </Link>
        <CopyButton href={`/parties/${party.uid}`} />
      </div>
    </div>
  );
};

export default PartyItem;
