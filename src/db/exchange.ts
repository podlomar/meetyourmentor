import clientPromise from 'db/mongo';
import { FinalPairing, Mentee, Mentor, MymEvent, Party } from 'db/schema';
import { findBest, scorePairing, scorePairings } from 'lib/score';
import { Instance, StablePairings } from 'stable-marriages';

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
    .sort({ index: 'asc' })
    .toArray();

  const mentees = await db
    .collection(PARTIES)
    .find<Mentee>({ eventId: event._id, side: "mentee" })
    .sort({ index: 'asc' })
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

const checkPermutation = (prefs: number[], size: number) => {
  if (prefs.length !== size) {
    return false;
  }
  
  const seen = new Array(prefs.length).fill(false);
  for(const pref of prefs) {
    if (pref < 0 || pref >= prefs.length) {
      return false;
    }

    if (seen[pref]) {
      return false;
    }

    seen[pref] = true;
  }

  return true;
}

export const storePartyPrefs = async (
  partyUid: string, prefs: number[]
): Promise<'ok' | 'not-found' | 'invalid-prefs' | 'db-fail'> => {
  const db = await getDatabase();
  const party = await db.collection(PARTIES).findOne<Party>({ uid: partyUid }) as Party | null;
  if (party === null) {
    return 'not-found';
  }
  
  if (!checkPermutation(prefs, party.prefs.length)) {
    return 'invalid-prefs';
  }

  const result = await db.collection(PARTIES).updateOne({ uid: partyUid }, { $set: { prefs } });
  if (result.modifiedCount !== 1 && result.matchedCount !== 1) {
    return 'db-fail';
  }

  return 'ok';
}

export const commitPartyPrefs = async (
  partyUid: string
): Promise<'ok' | 'not-found' | 'db-fail' | 'not-pending'> => {
  const db = await getDatabase();
  const party = await db.collection(PARTIES).findOne<Party>({ uid: partyUid }) as Party | null;
  if (party === null) {
    return 'not-found';
  }

  if (party.status.phase !== 'in-progress') {
    return 'not-pending';
  }

  const result = await db.collection(PARTIES).updateOne(
    { uid: partyUid }, { $set: { status: { phase: 'committed' } } }
  );
  
  if (result.modifiedCount !== 1 && result.matchedCount !== 1) {
    return 'db-fail';
  }

  return 'ok';
}

export const eventIsCommitted = (event: MymEvent): boolean => {
  return (
    event.mentors.every((mentor) => mentor.status.phase === 'committed') &&
    event.mentees.every((mentee) => mentee.status.phase === 'committed')
  );
}

const buildInstanceFromEvent = (event: MymEvent): Instance => {
  const mentorsMatrix = event.mentors.map((mentor) => mentor.prefs);
  const menteesMatrix = event.mentees.map((mentee) => mentee.prefs);
  return Instance.create(event.size, mentorsMatrix, menteesMatrix);
};

export const computeFinalPairing = (event: MymEvent): FinalPairing => {
  const instance = buildInstanceFromEvent(event);
  const algorithm = new StablePairings(instance);
  const pairings = algorithm.compute();
  const scored = scorePairings(pairings);
  const best = findBest(scored);

  return {
    mentees: best.pairing.pairs,
  }
};

export const loadFinalPairing = async (eventUid: string): Promise<MymEvent | null> => {
  const db = await getDatabase();
  const event = await loadEvent(eventUid);
  if (event === null) {
    return null;
  }

  if (event.status.phase === 'preparation') {
    return null;
  }

  if (event.status.phase === 'finished') {
    return event;
  }

  if (!eventIsCommitted(event)) {
    return null;
  }
  
  const pairing = computeFinalPairing(event);

  const result = await db.collection(EVENTS).updateOne(
    { uid: eventUid }, 
    { $set: { status: { phase: 'finished', pairing } } },
  );
  
  if (result.modifiedCount !== 1 && result.matchedCount !== 1) {
    return null;
  }

  for (const mentor of event.mentors) {
    const menteeIndex = pairing.mentees[mentor.index];
    const result = await db.collection(PARTIES).updateOne(
      { uid: mentor.uid }, { $set: { status: { phase: 'paired', with: menteeIndex } } }
    );
    
    if (result.modifiedCount !== 1 && result.matchedCount !== 1) {
      return null;
    }
  }

  for (const mentee of event.mentees) {
    const mentorIndex = pairing.mentees.indexOf(mentee.index);
    const result = await db.collection(PARTIES).updateOne(
      { uid: mentee.uid }, { $set: { status: { phase: 'paired', with: mentorIndex } } }
    );
    
    if (result.modifiedCount !== 1 && result.matchedCount !== 1) {
      return null;
    }
  }

  return loadEvent(eventUid);
}
