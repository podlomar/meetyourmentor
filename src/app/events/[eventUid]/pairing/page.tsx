import { loadFinalPairing } from 'db/exchange';
import { notFound } from 'next/navigation'
import styles from './styles.module.scss';

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
      <div className="container">
        <header className={styles.header}>
          <h1>{event.name}</h1>
        </header>
        
        <p>Parovani</p>
        <p>Parovani jeste neni dokoncene</p>
      </div>
    );
  }

  const pairing = event.status.pairing;

  return (
    <div className="container">
      <header className={styles.header}>
        <h1>{event.name}</h1>
      </header>
      
      <p>Parovani</p>
      <p>{pairing.mentees}</p>
      {
        pairing.mentees.map((menteeIndex, mentorIndex) => {
          const mentee = event.mentees[menteeIndex];
          const mentor = event.mentors[mentorIndex];
          
          return (
            <div key={mentor.uid}>
              {mentor.names} {mentor.index} : {mentee.names} {mentee.index}
            </div>  
          );
        })
      }
    </div>
  );
};

export default PairingPage;
