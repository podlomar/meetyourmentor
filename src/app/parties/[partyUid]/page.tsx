import clientPromise from 'db/mongo';
import { Party } from 'db/schema';
import { notFound } from 'next/navigation'

const loadParty = async (partyUid: string): Promise<Party | null> => {
  const client = await clientPromise;
  const db = client.db("meetyourmentor");
  const result = await db.collection('parties').aggregate([
    {
      $match: { uid: partyUid },
    },
    {
      $lookup: {
        from: 'parties',
        localField: 'prefs',
        foreignField: '_id',
        as: 'prefs',
      },
    }
  ]).toArray();

  if (result.length === 0) {
    return null;
  }
  
  return result[0] as Party;
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
        {party.prefs.map(pref => (
          <li key={pref.uid}>{pref.names}</li>
        ))}
      </ul>
    </div>
  );
};

export default PartyPage;
