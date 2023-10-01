import { eventIsCommitted, loadEvent, startEvent } from 'db/exchange';
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import PartyItem from 'components/PartyItem';
import styles from './styles.module.scss';
import Button from 'components/Button';

interface Props {
  params: {
    eventUid: string;
  }
}

const EventPage = async ({ params }: Props): Promise<JSX.Element> => {
  const { eventUid } = params;
  
  const event = await loadEvent(eventUid);
  if (event === null) {
    notFound();
  }

  const start = async () => {
    'use server';
 
    await startEvent(eventUid);
    revalidatePath(`/events/${eventUid}`)
  }

  return (
    <div className="container">
      <header className={styles.header}>
        <h1>{event.name}</h1>
      </header>
      
      { event.status.phase === 'preparation' && (
        <form action={start}>
          <Button primary>Spustit událost</Button>
        </form>
      )}
      { event.status.phase === 'in-progress' && (
          eventIsCommitted(event)
            ? <Button primary href={`/events/${eventUid}/pairing`}>Vytvořit párování</Button> 
            : <p>Počkejte, až všichni účastníci odešlou své preference.</p>
        )
      }
      { event.status.phase === 'finished' && <Button primary href={`/events/${eventUid}/pairing`}>Zobrazit párování</Button> }

      <h2>Mentoři</h2>
      <div>
        {event.mentors.map(mentor => (
          <PartyItem key={mentor.uid} party={mentor} />
        ))}
      </div>

      <h2>Mentees</h2>
      <div>
        {event.mentees.map(mentee => (
          <PartyItem key={mentee.uid} party={mentee} />
        ))}
      </div>
    </div>
  );
};

export default EventPage;
