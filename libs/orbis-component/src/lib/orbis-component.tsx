import styles from './orbis-component.module.css';

/* eslint-disable-next-line */
export interface OrbisComponentProps {}

export function OrbisComponent(props: OrbisComponentProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to OrbisComponent!</h1>
    </div>
  );
}

export default OrbisComponent;
