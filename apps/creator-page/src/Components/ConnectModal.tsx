import Modal from 'react-modal';

Modal.setAppElement('#connect-wallet-modal');
export default function ConnectModal({
  show,
  closeModal,
}: {
  show: boolean;
  closeModal: () => void;
}) {
  return (
    <Modal isOpen={show} className="connect-modal" overlayClassName="overlay">
      <h2>ConnectWallet</h2>
      <button onClick={closeModal}>close</button>
      <div>I am a modal</div>
      <form>
        <button>tab navigation</button>
        <button>stays</button>
        <button>inside</button>
        <button>the modal</button>
      </form>
    </Modal>
  );
}
