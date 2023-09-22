import { Preference } from 'components/PreferenceItem';
import PreferenceList from 'components/PreferenceList';
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

  const preferences = party.prefsList.map((party): Preference => ({
    id: party.uid,
    names: party.names,
    index: party.index,
  }));

  return (
    <div className="container">
      <h1>{party.names}</h1>
      {party.side === 'mentor'
        ? <p>Firma: {party.company}</p>
        : <p>Projekt: {party.project}</p>}
      <PreferenceList prefs={preferences} />
    </div>
  );
};

export default PartyPage;
