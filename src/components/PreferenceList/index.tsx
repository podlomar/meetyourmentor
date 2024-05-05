'use client';
import { useState } from 'react';
import { ReactSortable } from "react-sortablejs";
import PreferenceItem, { Preference } from 'components/PreferenceItem';
import PartyControls, { ControlsPhase } from 'components/PartyControls';
import { PartyStatus } from 'db/schema';

interface Props {
  partyUid: string;
  partyStatus: PartyStatus
  prefs: Preference[];
}

const PreferenceList = ({ partyUid, partyStatus, prefs }: Props): JSX.Element => {
  const [list, setList] = useState(prefs);
  const [phase, setPhase] = useState<ControlsPhase>(partyStatus.phase);

  const isDisabled = phase !== 'in-progress' && phase !== 'checking';

  const handleSetList = (newList: Preference[]) => {
    if (isDisabled) {
      return;
    }
    
    const changed = list.some((pref, index) => pref.index !== newList[index].index);   
    if (!changed) {
      return;
    }

    setList(newList);
    setPhase('in-progress');
    
    fetch(`${partyUid}/prefs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newList.map((pref) => pref.index)),
    });
  };

  return (
    <>
      <PartyControls partyUid={partyUid} phase={phase} onPhaseChange={setPhase} />
      <ReactSortable
        list={list}
        setList={handleSetList}
        disabled={isDisabled}
        handle=".dragHandle"
      >
        {list.map((pref, index) => (
          <PreferenceItem
            key={pref.id}
            pref={pref}
            selected={partyStatus.phase === 'paired' && partyStatus.with === pref.index} 
            position={index + 1}
            bodyClassName="dragHandle"
          />
        ))}
      </ReactSortable>
    </>
  );
};

export default PreferenceList;
