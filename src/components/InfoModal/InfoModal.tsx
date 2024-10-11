import { Modal } from "antd";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  fullText: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  fullText,
}) => {
  return (
    <Modal title="Bilješka" open={visible} onCancel={onClose} footer={null}>
      <p>{fullText}</p>
    </Modal>
  );
};

export default InfoModal;
