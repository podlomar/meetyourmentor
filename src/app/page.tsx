import styles from './styles.module.scss';

const HomePage = async () => {
  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Meet Your Mentor</h1>
      <p>A mentorship matching app for students and proffessionals</p>
    </div>
  );
};

export default HomePage;
