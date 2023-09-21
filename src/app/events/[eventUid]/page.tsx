import clientPromise from 'db/mongo';
import { notFound } from 'next/navigation'
import { Mentee, Mentor, MymEvent } from 'db/schema';
import PartyItem from 'components/PartyItem';
import styles from './styles.module.scss';

const loadEvent = async (eventUid: string): Promise<MymEvent | null> => {
  const client = await clientPromise;
  const db = client.db("meetyourmentor");
  const event = await db.collection("events").findOne({ uid: eventUid });
  if (event === null) {
    return null;
  }

  const mentors = await db
    .collection("parties")
    .find({ eventId: event._id, side: "mentor" })
    .toArray() as Mentor[];

  const mentees = await db
    .collection("parties")
    .find({ eventId: event._id, side: "mentee" })
    .toArray() as Mentee[];

  return {
    ...event,
    mentors,
    mentees,
  } as MymEvent;
}

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
