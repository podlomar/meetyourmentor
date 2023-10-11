import Button from 'components/Button';
import styles from './styles.module.scss';
import { PartyStatus } from 'db/schema';
import Image from 'next/image';
import tickIcon from 'img/tick.svg';

export type ControlsPhase = PartyStatus['phase'] | 'checking';

interface Props {
  partyUid: string;
  phase: ControlsPhase;
  onPhaseChange: (status: ControlsPhase) => void;
};

const PartyControls = ({ partyUid, phase, onPhaseChange }: Props): JSX.Element => {
  const handleSend = () => {
    onPhaseChange('checking');
  };

  const handleCommit = async () => {
    const response = await fetch(`/parties/${partyUid}/commit`, {
      method: 'POST',
    });

    if (response.ok) {
      onPhaseChange('committed');
    }
  }

  const handleCancel = async () => {
    onPhaseChange('in-progress');
  }

  return (
    <div className={styles.partyControls}>
      <p className={styles.message}>
        {phase === 'preparation' && 'Zkontrolujte, že tato stránka skutečně přísluší vám, a vyčkejte na spuštění události.'}
        {phase === 'in-progress' && 'Seřaďte mentory dle svých preferencí.'}
        {phase === 'checking' && 'Po potvrzení již nebude možné preference změnit.'}
        {phase === 'committed' && 'Vaše preference byly odeslány. Vyčkejte na přiřazení protějšku.'}
        {phase === 'paired' && 'Párování dokončeno.'}
      </p>
      <div className={styles.controls}>
        {phase === 'in-progress' && (
          <Button primary onClick={handleSend}>Odeslat</Button>
        )}
        {phase === 'checking' && (
          <>
            <Button primary onClick={handleCommit}>Závazně potvrdit</Button>
            <Button onClick={handleCancel}>Ještě ne</Button>
          </>
        )}
        {phase === "committed" && <Image height={30} src={tickIcon} alt="success" ></Image>}
      </div>
    </div>
  );
};

export default PartyControls;
