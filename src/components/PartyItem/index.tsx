import { Party } from "db/schema";
import styles from "./styles.module.scss";

interface Props {
  party: Party;
}

const PartyItem = ({ party }: Props): JSX.Element => {
  return (
    <a className={styles.partyItem} href={`/parties/${party.uid}`}>
      {party.names}
    </a>
  );
};

export default PartyItem;
