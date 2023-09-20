import clientPromise from 'db/mongo';
import { Party } from 'db/schema';
import { notFound } from 'next/navigation'

const loadParty = async (partyUid: string): Promise<Party | null> => {
  const client = await clientPromise;
  const db = client.db("meetyourmentor");
  const party = await db.collection('parties').findOne({ uid: partyUid }) as Party | null;
  if (party === null) {
    return null;
  }

  const prefsList = await db
    .collection('parties')
    .find({ eventId: party.eventId, side: party.side === 'mentor' ? 'mentee' : 'mentor' })
    .toArray() as Party[];

  return {
    ...party,
    prefsList: party.prefs.map((pref) => prefsList[pref]),
  } as Party;
}

interface Props {
  params: {
    partyUid: string;
  }
};

const PartyPage = async ({ params }: Props): Promise<JSX.Element> => {
  const party = await loadParty(params.partyUid);
  if (party === null) {
    notFound();
  }

  return (
    <div className="container">
      <h1>{party.names}</h1>
      {party.side === 'mentor'
        ? <p>Firma: {party.company}</p>
        : <p>Projekt: {party.project}</p>}
      <h2>Preference</h2>
      <ul>
        {party.prefsList.map(pref => (
          <li key={pref.uid}>{pref.names}</li>
        ))}
      </ul>
    </div>
  );
};

export default PartyPage;
