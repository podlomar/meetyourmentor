import clientPromise from 'db/mongo';
import { MymEvent } from 'db/schema';
import { notFound } from 'next/navigation'

const loadEvent = async (eventUid: string): Promise<MymEvent | null> => {
  const client = await clientPromise;
  const db = client.db("meetyourmentor");
  const result = await db.collection("events").aggregate([
    { 
      $match: { uid: eventUid },
    },
    {
      $lookup: {
        from: 'parties',
        localField: 'mentors',
        foreignField: '_id',
        as: 'mentors',
      },
    },
    {
      $lookup: {
        from: 'parties',
        localField: 'mentees',
        foreignField: '_id',
        as: 'mentees',
      },
    },
  ]).toArray();
  
  if (result.length === 0) {
    return null;
  }

  return result[0] as MymEvent;
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
