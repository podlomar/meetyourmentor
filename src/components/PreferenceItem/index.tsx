import clsx from "clsx";
import styles from "./styles.module.scss";

export interface Preference {
  id: string;
  names: string;
  index: number;
  title: string;
}

interface Props {
  pref: Preference;
  selected?: boolean;
}

const PreferenceItem = (
  { pref, selected = false }: Props
): JSX.Element => {
  return (
    <div className={clsx(styles.prefItem, selected && styles.selected)}>
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
