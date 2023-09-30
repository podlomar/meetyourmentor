import Link from "next/link";
import { Party } from "db/schema";1
import styles from "./styles.module.scss";

interface Props {
  party: Party;
}

const PartyLink = ({ party }: Props): JSX.Element => {
  return (
    <div className={styles.partyItem}>
      <div className={styles.title}>
        { party.side === 'mentor' ? party.company : party.project }
        { ` (${party.status.phase})` }
      </div>
      <div className={styles.names}>
        { party.names }
      </div>
      <Link href={`/parties/${party.uid}`}>
        { `${process.env.SERVER_URL}/parties/${party.uid}` }
      </Link>
    </div>
  );
};

export default PartyLink;
