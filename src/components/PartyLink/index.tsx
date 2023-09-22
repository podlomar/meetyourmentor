import Link from "next/link";
import { Party } from "db/schema";1
import styles from "./styles.module.scss";

interface Props {
  party: Party;
}

const PartyLink = ({ party }: Props): JSX.Element => {
  return (
    <Link className={styles.partyItem} href={`/parties/${party.uid}`}>
      {party.names}
    </Link>
  );
};

export default PartyLink;
