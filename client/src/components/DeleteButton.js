//This component is not currently used - using ConfirmDeleteModal component instead

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { openModal } from '../actions';

class DeleteButton extends React.Component {
  onButtonClick = (e) => {
    e.preventDefault();

    if (this.props.user) {
      //user alredy has to be logged in to reach edit page. check if user who created the mat is the same one who's trying to delete it
      if (this.props.user.id !== this.props.createdBy)
        alert(
          'You must be the person who created this post in order to delete it. If you would still like it to be removed, please contact us via the contact page. Thanks!'
        );
      else alert('Are you sure you want to delete?');
    }
    //if a user is not logged in, send them to login screen
    else this.props.openModal('login', true);
  };

  render() {
    return (
      <button
        className="btn btn-danger btn-sm mx-4"
        onClick={this.onButtonClick}
      >
        <span className="fa fa-trash-o mr-2"></span>Delete
      </button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { openModal })(
  withRouter(DeleteButton)
);
