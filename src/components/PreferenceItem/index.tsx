import { Party } from "db/schema";1
import styles from "./styles.module.scss";

export interface Preference {
  id: string;
  names: string;
  index: number;
}

interface Props {
  pref: Preference;
}

const PreferenceItem = ({ pref }: Props): JSX.Element => {
  return (
    <div className={styles.prefItem}>
      {pref.names}
    </div>
  );
};

export default PreferenceItem;
