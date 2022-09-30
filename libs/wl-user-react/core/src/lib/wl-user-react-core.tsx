import styles from './wl-user-react-core.module.css';

/* eslint-disable-next-line */
export interface WlUserReactCoreProps {}

export function WlUserReactCore(props: WlUserReactCoreProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to WlUserReactCore!</h1>
    </div>
  );
}

export default WlUserReactCore;
