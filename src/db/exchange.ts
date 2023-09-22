import clientPromise from 'db/mongo';
import { Mentee, Mentor, MymEvent, Party } from 'db/schema';

const DB_NAME = 'meetyourmentor';
const EVENTS = 'events';
const PARTIES = 'parties';

const getDatabase = async () => {
  const client = await clientPromise;
  return client.db(DB_NAME);
};

export const loadEvent = async (eventUid: string): Promise<MymEvent | null> => {
  const db = await getDatabase();
  const event = await db.collection(EVENTS).findOne<MymEvent>({ uid: eventUid });
  if (event === null) {
    return null;
  }

  const mentors = await db
    .collection(PARTIES)
    .find<Mentor>({ eventId: event._id, side: "mentor" })
    .toArray();

  const mentees = await db
    .collection(PARTIES)
    .find<Mentee>({ eventId: event._id, side: "mentee" })
    .toArray();

  return {
    ...event,
    mentors,
    mentees,
  } as MymEvent;
};

export const loadParty = async (partyUid: string): Promise<Party | null> => {
  const db = await getDatabase();
  const party = await db.collection(PARTIES).findOne<Party>({ uid: partyUid }) as Party | null;
  if (party === null) {
    return null;
  }

  const prefsList = await db
    .collection(PARTIES)
    .find<Party>({ eventId: party.eventId, side: party.side === 'mentor' ? 'mentee' : 'mentor' })
    .toArray();

  return {
    ...party,
    prefsList: party.prefs.map((pref) => prefsList[pref]),
  } as Party;
};
