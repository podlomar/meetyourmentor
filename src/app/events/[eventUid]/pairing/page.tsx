import { loadFinalPairing } from 'db/exchange';
import { notFound } from 'next/navigation';
import { FinalPairing, MymEvent } from 'db/schema';
import styles from './styles.module.scss';
import PairingItem from 'components/PairingItem';
import Page from 'components/Page';


interface PairingSummary {
  menteeScores: number[];
  mentorScores: number[];
  menteesOverallScore: number;
  mentorsOverallScore: number;
  overallScore: number;
  regret: number;
  fairness: number;
}

export const computePairingSummary = (event: MymEvent, pairing: FinalPairing): PairingSummary => {
  const mentorScores = pairing.mentees.map((menteeIndex, mentorIndex) => {
    const mentor = event.mentors[mentorIndex];
    return mentor.prefs.findIndex((p) => p === menteeIndex) + 1;
  });

  const menteeScores = pairing.mentees.map((menteeIndex, mentorIndex) => {
    const mentee = event.mentees[menteeIndex];
    return mentee.prefs.findIndex((p) => p === mentorIndex) + 1;
  });

  const menteesOverallScore = menteeScores.reduce((a, b) => a + b, 0);
  const mentorsOverallScore = mentorScores.reduce((a, b) => a + b, 0);
  const overallScore = menteesOverallScore + mentorsOverallScore;

  const regret = Math.max(...menteeScores, ...mentorScores);
  const fairness = Math.abs(menteesOverallScore - mentorsOverallScore);

  return {
    menteeScores,
    mentorScores,
    menteesOverallScore,
    mentorsOverallScore,
    overallScore,
    regret,
    fairness,
  };
}

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
