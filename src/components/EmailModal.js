import Modal from 'react-bootstrap/Modal';

import Button from 'react-bootstrap/Button';

const EmailModal = ({ show, handleClose, selectedEmail, handleUpdateSubmit }) => {
    return (
        <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Update Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmail && (
                        <form onSubmit={handleUpdateSubmit} className="form-group" style={{ color: "black" }}>
                            Emails: <input type="text" className="form-control" name="emails" defaultValue={selectedEmail.emails} /><br />
                            Format:<input type="text" name="format" className="form-control" defaultValue={selectedEmail.format} /><br />
                            Subject<input type="text" name="subject" className="form-control" defaultValue={selectedEmail.subject} /><br />

                            Comapany Name: <input type="text" name="companyName" className="form-control" defaultValue={selectedEmail.companyName} /><br />
                            Comapny Post: <input type="text" name="companyPost" className="form-control" defaultValue={selectedEmail.companyPost} /><br />
                            Company Post URL: <input type="text" name="companyPostURL" className="form-control" defaultValue={selectedEmail.companyPostURL} /><br />
                            Scheduled Time: <input type="text" name="scheduleTime" className="form-control" defaultValue={selectedEmail.scheduleTime} /><br />
                            {/* <button type="submit">Update Email</button> */}
                        </form>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { handleClose(); handleUpdateSubmit() }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
    )
}

export default EmailModal;