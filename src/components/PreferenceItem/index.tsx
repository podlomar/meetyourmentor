import { Party } from "db/schema";1
import styles from "./styles.module.scss";

export interface Preference {
  id: string;
  names: string;
  index: number;
  title: string;
}

interface Props {
  pref: Preference;
}

const PreferenceItem = ({ pref }: Props): JSX.Element => {
  return (
    <div className={styles.prefItem}>
      <div className={styles.title}>
        {pref.title}
      </div>
      <div className={styles.names}>
        {pref.names}
      </div>
    </div>
  );
};

export default PreferenceItem;
