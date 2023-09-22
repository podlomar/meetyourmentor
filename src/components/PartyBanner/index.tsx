import clsx from 'clsx';
import { Party } from 'db/schema';
import styles from './styles.module.scss';

interface Props {
  party: Party;
};

const PartyBanner = async ({ party }: Props): Promise<JSX.Element> => {
  return (
    <div className={styles.partyBanner}>
      <div className={clsx(styles.avatar, styles[party.side])} />
      <div className={styles.bannerBody}>
        <h1>
          {party.side === 'mentor' ? party.company : party.project}
        </h1>
        <div>{party.names}</div>
      </div>
    </div>
  );
};

export default PartyBanner;
