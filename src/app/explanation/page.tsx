import Content from './content.mdx';
import styles from './styles.module.scss';

const Page = (): JSX.Element => {
  return (
    <div className={styles.page}>
      <Content />
    </div>
  )
};

export default Page;
