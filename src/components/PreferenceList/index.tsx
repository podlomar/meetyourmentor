'use client';
import { useState } from 'react';
import { ReactSortable } from "react-sortablejs";
import PreferenceItem, { Preference } from 'components/PreferenceItem';

interface Props {
  prefs: Preference[];
}

const PreferenceList = ({ prefs }: Props): JSX.Element => {
  const [list, setList] = useState(prefs);

  return (
    <div>
      <h2>Preference List</h2>
      <ReactSortable list={list} setList={setList}>
        {list.map((pref) => (
          <PreferenceItem key={pref.id} pref={pref} />
        ))}
      </ReactSortable>
    </div>
  );
};

export default PreferenceList;
