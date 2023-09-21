import { loadParty } from 'db/exchange';
import { notFound } from 'next/navigation'

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
