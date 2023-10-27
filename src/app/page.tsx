import { createEvent } from 'db/exchange';
import styles from './styles.module.scss';
import { redirect } from 'next/navigation';
import Button from 'components/Button';
import Header from 'components/Header';

const HomePage = async () => {
  const create = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    const mentorsText = formData.get('mentors') as string;
    const menteestext = formData.get('mentees') as string;

    const mentors = mentorsText.split(/\r?\n/).filter((line: string) => line.length > 0);
    const mentees = menteestext.split(/\r?\n/).filter((line: string) => line.length > 0);

    console.log(mentors);
    console.log(mentees);

    const eventUid = await createEvent(name, mentors, mentees);
    redirect(`/events/${eventUid}`);
  }

  return (
    <>
      <Header title="Meet Your Mentor" />
      <p>Aplikace pro férové spárování mentorů a mentees podle jejich vzájemných preferencí.</p>
      <p>Začněte vytvořením vaší párovací události.</p>
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
    </>
  );
};

export default HomePage;
