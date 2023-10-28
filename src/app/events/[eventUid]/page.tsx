import { eventIsCommitted, loadEvent, startEvent } from 'db/exchange';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { revalidatePath } from 'next/cache'
import PartyItem from 'components/PartyItem';
import styles from './styles.module.scss';
import Button from 'components/Button';
import mentorImg from 'img/mentor.svg';
import menteeImg from 'img/mentee.svg';
import Page from 'components/Page';

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
    <Page title={event.name}>
      <div className={styles.controls}>
        {event.status.phase === 'preparation' && (
          <form className={styles.form} action={start}>
            <Button primary>Spustit událost</Button>
          </form>
        )}
      
        {event.status.phase === 'in-progress' && (
          eventIsCommitted(event)
            ? <Button primary href={`/events/${eventUid}/pairing`}>Vytvořit párování</Button>
            : <p>Počkejte, až všichni účastníci odešlou své preference.</p>
        )}
      
        {event.status.phase === 'finished' && (
          <Button primary href={`/events/${eventUid}/pairing`}>Zobrazit párování</Button>
        )}
      </div>

      <div className={styles.cardsGrid}>
        <div>
          <div className={styles.heading}>
            <Image src={mentorImg} className={styles.icon} width={30} alt="Mentor"></Image>
            <h2>Mentoři</h2>
          </div>
          <div>
            {event.mentors.map(mentor => (
              <PartyItem key={mentor.uid} party={mentor} />
            ))}
          </div>
        </div>

        <div>
          <div className={styles.heading}>
            <Image src={menteeImg} className={styles.icon} width={30} alt="Mentor"></Image>
            <h2>Mentees</h2>
          </div>
          <div>
            {event.mentees.map(mentee => (
              <PartyItem key={mentee.uid} party={mentee} />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EventPage;
