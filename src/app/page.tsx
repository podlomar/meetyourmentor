import { createEvent } from 'db/exchange';
import styles from './styles.module.scss';
import { redirect } from 'next/navigation';
import Button from 'components/Button';

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
    <div className="container">
      <h1 className={styles.pageTitle}>Meet Your Mentor</h1>
      <p>A mentorship matching app for students and proffessionals</p>
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
          />
        </div>
        
        <div className="formField">
          <label htmlFor="mentees">Seznam mentees</label>
          <textarea
            id="mentees"
            className={styles.textAreaInput}
            name="mentees"
            required
          />
        </div>

        <Button primary>Create Event</Button>
      </form>
    </div>
  );
};

export default HomePage;
