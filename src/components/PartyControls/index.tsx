import Button from 'components/Button';
import styles from './styles.module.scss';
import { PartyStatus } from 'db/schema';
import tickIcon from 'img/tick.svg';
import InfoBox from 'components/InfoBox';

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

  const icon = phase === 'committed' ? tickIcon.src : undefined;
  return (
    <div className={styles.partyControls}>
      <InfoBox icon={icon}>
        <p>
          {phase === 'preparation' && 'Zkontrolujte, že tato stránka skutečně přísluší vám, a vyčkejte na spuštění události.'}
          {phase === 'in-progress' && 'Seřaďte mentory dle svých preferencí.'}
          {phase === 'checking' && 'Po potvrzení již nebude možné preference změnit.'}
          {phase === 'committed' && 'Vaše preference byly odeslány. Vyčkejte na přiřazení protějšku.'}
          {phase === 'computed' && 'Párování dokončeno. Vyčkejte na zveřejnění výsledků.'}
          {phase === 'paired' && 'Párování dokončeno.'}
        </p>
      </InfoBox>
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
      </div>
    </div>
  );
};

export default PartyControls;
