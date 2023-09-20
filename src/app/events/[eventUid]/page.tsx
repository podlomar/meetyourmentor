import clientPromise from 'db/mongo';
import { MymEvent } from 'db/schema';
import { notFound } from 'next/navigation'

const loadEvent = async (eventUid: string): Promise<MymEvent | null> => {
  const client = await clientPromise;
  const db = client.db("meetyourmentor");
  const event = await db.collection("events").findOne({ uid: eventUid });
  return event as MymEvent | null
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
    </div>
  );
};

export default EventPage;
