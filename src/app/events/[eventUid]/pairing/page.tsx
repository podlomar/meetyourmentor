import { loadFinalPairing } from 'db/exchange';
import { notFound } from 'next/navigation';
import styles from './styles.module.scss';
import PairingItem from 'components/PairingItem';
import Page from 'components/Page';
import { computePairingSummary } from 'lib/summary';
import Button from 'components/Button';

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
  const summary = computePairingSummary(event, pairing);
  
  return (
    <Page title={event.name}>
      <h2>Výsledek párování</h2>
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryItemTitle}>Celkové zklamání:</div>
          <div className={styles.summaryItemValue}>{summary.regret}</div>
        </div>
        
        <div className={styles.summaryItem}>
          <div className={styles.summaryItemTitle}>Skóre mentorů:</div>
          <div className={styles.summaryItemValue}>{summary.mentorsOverallScore}</div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.summaryItemTitle}>Skóre mentees:</div>
          <div className={styles.summaryItemValue}>{summary.menteesOverallScore}</div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.summaryItemTitle}>Fairness:</div>
          <div className={styles.summaryItemValue}>{summary.fairness}</div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.summaryItemTitle}>Celkové skóre:</div>
          <div className={styles.summaryItemValue}>{summary.overallScore}</div>
        </div>
      </div>

      <Button primary href={`pairing/export`}>Stáhnout výsledek (CSV)</Button>

      <p>Číslo u každého účastníka udává jeho osobní skóre, tedy na jakém místě ve svém seznamu preferencí měl svůj výsledně spárovaný protějšek.</p>

      {
        pairing.mentees.map((menteeIndex, mentorIndex) => {
          const mentee = event.mentees[menteeIndex];
          const mentor = event.mentors[mentorIndex];

          const mentorScore = summary.mentorScores[mentorIndex];
          const menteeScore = summary.menteeScores[menteeIndex];

          return (
            <div className={styles.pairing}>
              <PairingItem 
                mentor={mentor}
                mentorScore={mentorScore}
                mentee={mentee}
                menteeScore={menteeScore}
              />
            </div>
          );
        })
      }
    </Page>
  );
};

export default PairingPage;
