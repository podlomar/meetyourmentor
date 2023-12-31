import Page from 'components/Page';
import PartyBanner from 'components/PartyBanner';
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
    title: party.side === 'mentor' ? party.company : party.project,
  }));

  return (
    <Page title={party.side === 'mentor' ? 'Mentor' : 'Mentee'}>
      <PartyBanner party={party} />
      <PreferenceList
        partyUid={params.partyUid}
        prefs={preferences}
        partyStatus={party.status}
      />
    </Page>
  );
};

export default PartyPage;
