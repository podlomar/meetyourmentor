'use client';
import { useState } from 'react';
import { ReactSortable } from "react-sortablejs";
import PreferenceItem, { Preference } from 'components/PreferenceItem';

interface Props {
  partyUid: string;
  prefs: Preference[];
}

const PreferenceList = ({ partyUid, prefs }: Props): JSX.Element => {
  const [list, setList] = useState(prefs);

  const handleSetList = (newList: Preference[]) => {
    setList(newList);
    fetch(`${partyUid}/prefs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newList.map((pref) => pref.index)),
    });
  };

  return (
    <div>
      <h2>Preference List</h2>
      <ReactSortable list={list} setList={handleSetList}>
        {list.map((pref) => (
          <PreferenceItem key={pref.id} pref={pref} />
        ))}
      </ReactSortable>
    </div>
  );
};

export default PreferenceList;
