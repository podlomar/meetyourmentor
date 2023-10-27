import { loadFinalPairing } from 'db/exchange';
import { notFound } from 'next/navigation';
import styles from './styles.module.scss';
import pairingItemStyles from 'components/PairingItem/styles.module.scss';
import PairingItem from 'components/PairingItem';
import Header from 'components/Header';

interface Props {
  params: {
    eventUid: string;
  }
}

const PairingPage = async ({ params }: Props): Promise<JSX.Element> => {
  const { eventUid } = params;

  const event = await loadFinalPairing(eventUid);
  if (event === null) {
    notFound();
  }

  if (event.status.phase !== 'finished') {
    return (
      <>
        <header className={styles.header}>
          <h1>{event.name}</h1>
        </header>

        <p>Parovani</p>
        <p>Parovani jeste neni dokoncene</p>
      </>
    );
  }

  const pairing = event.status.pairing;

  return (
    <>
      <Header title={event.name} />
      <h2>Výsledek párování</h2>
      {
        pairing.mentees.map((menteeIndex, mentorIndex) => {
          const mentee = event.mentees[menteeIndex];
          const mentor = event.mentors[mentorIndex];

          const mentorScore = mentor.prefs.findIndex((p) => p === menteeIndex);
          const menteeScore = mentee.prefs.findIndex((p) => p === mentorIndex);

          return (
            <div className={styles.pairing}>
              <PairingItem 
                mentor={mentor}
                menteeScore={menteeScore}
                mentee={mentee}
                mentorScore={mentorScore}
              />
            </div>
          );
        })
      }
    </>
  );
};

export default PairingPage;
