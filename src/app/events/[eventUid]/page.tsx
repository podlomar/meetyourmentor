import { loadEvent } from 'db/exchange';
import { notFound } from 'next/navigation'
import PartyItem from 'components/PartyItem';
import styles from './styles.module.scss';

interface Props {
  params: {
    eventUid: string;
  }
}

const EventPage = async ({ params }: Props): Promise<JSX.Element> => {
  const event = await loadEvent(params.eventUid);
  if (event === null) {
    notFound();
  }

  return (
    <div className="container">
      <header className={styles.header}>
        <h1>{event.name}</h1>
      </header>
      
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
