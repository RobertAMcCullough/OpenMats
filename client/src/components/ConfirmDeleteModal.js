import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

import { openModal } from '../actions';

axios.defaults.withCredentials = true;

class ConfirmDeleteModal extends React.Component {
  onTriggerClick = () => {
    if (!this.props.user.is) {
      this.props.openModal('login', true);
    } else {
      //user alredy has to be logged in to reach edit page. check if user who created the mat is the same one who's trying to delete it
      if (
        this.props.user.id !== this.props.createdBy &&
        this.props.user.id !== 1
      )
        alert(
          'You must be the person who created this post in order to delete it. If you would still like it to be removed, please contact us via the contact page. Thanks!'
        );
      else this.props.openModal('delete', true); //if correct user (or admin) then open the delete modal so they can choose to delete or not
    }
  };

  onDeleteClick = async () => {
    this.props.openModal('delete', false);

    //if mat, delete mat
    if (this.props.mat) {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/openmats/${this.props.mat.id}`
      );
      if (response.status === 200) {
        alert('Open Mat Deleted Successfully');
      } else {
        alert('Problem Deleting Open Mat');
      }
      this.props.history.push(`/gyms/${this.props.mat.gym_id}`);
    } else {
      //else delete gym
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/gyms/${this.props.gym.gym_id}`
      );
      if (response.status === 200) {
        alert('Gym Deleted Successfully');
      } else {
        alert('Problem Deleting Gym');
      }
      this.props.history.push(`/`);
    }
  };

  onCancelClick = () => {
    this.props.openModal('delete', false);
  };

  render() {
    return (
      <>
        <Button
          className="btn btn-danger btn-sm"
          variant="primary"
          onClick={this.onTriggerClick}
        >
          <span className="fa fa-trash-o mr-2"></span>Delete
        </Button>

        <Modal
          show={this.props.isOpen}
          onHide={() => this.props.openModal('delete', false)}
          size="md"
        >
          <Modal.Body>
            <div
              className="text-center"
              style={{ width: '60%', margin: '0 auto' }}
            >
              <p className="mb-4">
                Are you sure you want to delete{' '}
                {this.props.mat
                  ? 'this open mat?'
                  : this.props.gym.name +
                    '? All open mats associated with it will also be deleted.'}
              </p>

              <div className="d-flex justify-content-around">
                <Button
                  className="btn btn-danger px-4"
                  onClick={this.onDeleteClick}
                >
                  Yes
                </Button>
                <Button
                  className="btn btn-secondary px-4"
                  onClick={this.onCancelClick}
                >
                  No
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.openModal.delete,
    user: state.user,
  };
};

export default connect(mapStateToProps, { openModal })(
  withRouter(ConfirmDeleteModal)
);
