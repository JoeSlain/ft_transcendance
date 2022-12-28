const Dialog = ({
  header,
  body,
  acceptButton,
  declineButton,
  handleAccept,
  handleDecline,
}) => {
  return (
    <Modal show={true}>
      <div className="notif">
        <div className="header">
          <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
        </div>
        <div className="body">{body}</div>
        <div className="buttons">
          <Button variant="primary" onClick={handleAccept}>
            {acceptButton}
          </Button>
          <Button variant="secondary" onClick={handleDecline}>
            {declineButton}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
