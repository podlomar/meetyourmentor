import { computePairing, eventIsCommitted, loadEvent, publishEvent, startEvent } from 'db/exchange';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { revalidatePath } from 'next/cache'
import PartyItem from 'components/PartyItem';
import styles from './styles.module.scss';
import Button from 'components/Button';
import mentorImg from 'img/mentor.svg';
import menteeImg from 'img/mentee.svg';
import Page from 'components/Page';
import InfoBox from 'components/InfoBox';
import { computePopularities, getCommittedCount } from 'lib/summary';

interface Props {
  params: {
    eventUid: string;
  }
}

const EventPage = async ({ params }: Props): Promise<JSX.Element> => {
  const { eventUid } = params;

  const event = await loadEvent(eventUid);
  if (event === null) {
    notFound();
  }

  const start = async () => {
    'use server';

    await startEvent(eventUid);
    revalidatePath(`/events/${eventUid}`)
  }

  const compute = async () => {
    'use server';

    await computePairing(eventUid);
    revalidatePath(`/events/${eventUid}`)
  }

  const publish = async () => {
    'use server';

    await publishEvent(eventUid);
    revalidatePath(`/events/${eventUid}`)
  }

  const pupularities = computePopularities(event);

  return (
    <Page title={event.name}>
      {event.status.phase === 'preparation' && (
        <>
          <InfoBox>
            <p>Událost čeká na spuštění. Zatím žádný účastník nemůže měnit své preference.</p>
          </InfoBox>
          <form className={styles.form} action={start}>
            <div className={styles.controls}>
              <Button primary>Spustit událost</Button>
            </div>
          </form>
        </>
      )}
    
      {event.status.phase === 'in-progress' && (
        eventIsCommitted(event)
          ? (
            <>
              <InfoBox>
                <p>Všichni účastníci potvrdili své preference.</p>
              </InfoBox>
              <form className={styles.form} action={compute}>
                <div className={styles.controls}>
                  <Button primary>Vytvořit párování</Button>
                </div>
              </form>
            </>
          )
          : (
            <>
              <InfoBox>
                <p>Událost je spuštěna. Počkejte, až všichni účastníci odešlou své preference.</p>
              </InfoBox>
              <p>Uzavřeno {getCommittedCount(event)} z {event.mentors.length + event.mentees.length}</p>
            </>
          )
      )}
    
      {event.status.phase === 'computed' && (
        <>
          <InfoBox>
            <p>Událost je připravena k publikaci výsledků.</p>
          </InfoBox>
          <div className={styles.controls}>
            <form className={styles.form} action={publish}>
              <Button primary>Publikovat výsledky</Button>
            </form>
            <Button href={`/events/${eventUid}/pairing`}>Zobrazit párování</Button>
          </div>
        </>
      )}

      {event.status.phase === 'published' && (
        <>
          <InfoBox>
            <p>Událost je uzavřena. Výsledky párování byly publikovány.</p>
          </InfoBox>
          <div className={styles.controls}>
            <Button primary href={`/events/${eventUid}/pairing`}>Zobrazit párování</Button>
          </div>
        </>
      )}

      <div className={styles.cardsGrid}>
        <div>
          <div className={styles.heading}>
            <Image src={mentorImg} className={styles.icon} width={30} alt="Mentor"></Image>
            <h2>Mentoři</h2>
          </div>
          <div>
            {event.mentors.map((mentor, mentorIndex) => (
              <PartyItem
                key={mentor.uid}
                party={mentor} 
                popularity={pupularities.mentors[mentorIndex]}
              />
            ))}
          </div>
        </div>

        <div>
          <div className={styles.heading}>
            <Image src={menteeImg} className={styles.icon} width={30} alt="Mentor"></Image>
            <h2>Mentees</h2>
          </div>
          <div>
            {event.mentees.map(mentee => (
              <PartyItem
                key={mentee.uid}
                party={mentee}
                popularity={pupularities.mentees[mentee.index]}
              />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EventPage;
