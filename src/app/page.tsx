import { createEvent } from 'db/exchange';
import styles from './styles.module.scss';
import { redirect } from 'next/navigation';
import Page from 'components/Page';
import Button from 'components/Button';
import InfoBox from 'components/InfoBox';

const HomePage = async () => {
  const create = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    const mentorsText = formData.get('mentors') as string;
    const menteestext = formData.get('mentees') as string;

    const mentors = mentorsText.split(/\r?\n/).filter((line: string) => line.length > 0);
    const mentees = menteestext.split(/\r?\n/).filter((line: string) => line.length > 0);

    const eventUid = await createEvent(name, mentors, mentees);
    redirect(`/events/${eventUid}`);
  }

  return (
    <Page title="Meet Your Mentor">
      <p>Aplikace pro férové spárování mentorů a mentees podle jejich vzájemných preferencí.</p>
      <InfoBox>
        <p>Začněte vytvořením vaší párovací události.</p>
      </InfoBox>

      <form action={create}>
        <div className="formField">
          <label htmlFor="mentors">Název události</label>
          <input
            className={styles.textInput}
            type="text"
            name="name"
            autoComplete="off"
            required
          />
        </div>
        <div className="formField">
          <label htmlFor="mentors">Seznam mentorů</label>
          <textarea
            id="mentors"
            className={styles.textAreaInput}
            name="mentors"
            required
            placeholder={`Název organizace\nMentor 1 & Mentor 2\n\nNázev organizace\nMentor 1 & Mentor 2`}
          />
        </div>

        <div className="formField">
          <label htmlFor="mentees">Seznam mentees</label>
          <textarea
            id="mentees"
            className={styles.textAreaInput}
            name="mentees"
            required
            placeholder={`Název projektu\nMentee 1 & Mentee 2\n\nNázev projektu\nMentee 1 & Mentee 2`}
          />
        </div>
        <Button primary>Vytvořit událost</Button>
      </form>
    </Page>
  );
};

export default HomePage;
