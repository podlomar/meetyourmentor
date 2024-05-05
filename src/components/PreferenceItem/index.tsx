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
  position: number;
  bodyClassName?: string;
}

const PreferenceItem = (
  { pref, selected = false, position, bodyClassName }: Props
): JSX.Element => {
  return (
    <div className={clsx(styles.prefItem, selected && styles.selected)}>
      <div className={styles.position}>
        {position}
      </div>
      <div className={clsx(styles.body, bodyClassName)}>
        <div className={styles.title}>
          {pref.title}
        </div>
        <div className={styles.names}>
          {pref.names}
        </div>
      </div>
    </div>
  );
};

export default PreferenceItem;
