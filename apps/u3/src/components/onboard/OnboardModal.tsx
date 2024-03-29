import Modal from 'react-modal';
import OnBoard, { ItemData } from '.';

export default function OnboardModal({
  show,
  lists,
  finishAction,
}: {
  show: boolean;
  lists: ItemData[];
  finishAction: (data: {
    eventRewards: string[];
    eventTypes: string[];
    projectTypes: string[];
    contentTypes: string[];
    langs: string[];
  }) => void;
}) {
  return (
    <Modal
      isOpen={show}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          background: 'none',
          border: 'none',
          padding: '0',
        },
      }}
    >
      <OnBoard lists={lists} finishAction={finishAction} />
    </Modal>
  );
}
