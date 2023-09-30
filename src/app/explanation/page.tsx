import clsx from 'clsx';
import Content from './content.mdx';
import styles from './styles.module.scss';

const Page = (): JSX.Element => {
  return (
    <div className={clsx('container', styles.page)}>
      <Content />
    </div>
  )
};

export default Page;
