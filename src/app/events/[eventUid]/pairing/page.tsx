import { loadFinalPairing } from 'db/exchange';
import { notFound } from 'next/navigation';
import styles from './styles.module.scss';
import PairingItem from 'components/PairingItem';
import Page from 'components/Page';

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
      <Page title={event.name}>
        <h2>Párováni</h2>
        <p>Párováni ještě není dokončeno</p>
      </Page>
    );
  }

  const pairing = event.status.pairing;

  return (
    <Page title={event.name}>
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
    </Page>
  );
};

export default PairingPage;
