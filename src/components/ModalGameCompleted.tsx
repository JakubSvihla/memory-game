import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';

interface ModalGameCompletedProps {
  isOpen: boolean;
  close: () => void;
}

const ModalGameCompleted: React.FC<ModalGameCompletedProps> = ({
  isOpen,
  close,
}) => {
  return (
    <Modal hideCloseButton isOpen={isOpen}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Great Success !!
          </ModalHeader>
          <ModalBody>
            <p>Close this and start the next level.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={close}>
              Close
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalGameCompleted;
