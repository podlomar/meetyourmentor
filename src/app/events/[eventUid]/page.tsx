import clientPromise from 'db/mongo';
import { Mentee, Mentor, MymEvent } from 'db/schema';
import { notFound } from 'next/navigation'

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
      <h1>{event.name}</h1>
      <h2>Mentoři</h2>
      <ul>
        {event.mentors.map(mentor => (
          <li key={mentor.uid}>
            <a href={`/parties/${mentor.uid}`}>{mentor.names}</a>
          </li>
        ))}
      </ul>
      <h2>Mentees</h2>
      <ul>
        {event.mentees.map(mentee => (
          <li key={mentee.uid}>
            <a href={`/parties/${mentee.uid}`}>{mentee.names}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventPage;
