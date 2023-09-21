import React from 'react';
import { connect } from 'react-redux';

import EditButton from '../EditButton';

import { showOpenmat, updateOpenmat, resetMatId } from '../../actions';
import breakPoints from '../../config/breakPoints';
import days from '../../config/days';
import sqlDate from '../../utilities/sqlDate';

class UpdateMat extends React.Component {
  //state holds all the form data
  state = {
    openMat: {
      day: '',
      time: '',
      cost: '',
      call_first: '',
      size: '',
      gi_nogi: '',
      notes: '',
    },
  };

  // this will be set to true once the matDetails are set to state in component did update
  matDetailsSetToState = false;

  componentDidMount() {
    document.title = 'OpenMats.org | Edit';
    this.props.showOpenmat(this.props.match.params.id);
  }

  componentDidUpdate() {
    //update title after fetching data if it hasn't already been updated
    if (
      document.title === 'OpenMats.org | Edit' &&
      this.props.matDetails &&
      this.props.matDetails.name
    )
      document.title = `OpenMats.org | Edit ${this.props.matDetails.name}`;
    //sets the contents of matDetails to state once matDetails is loaded and it's not the id of any previously loaded data

    if (
      !this.matDetailsSetToState &&
      this.props.matDetails &&
      this.props.matDetails.id === this.props.match.params.id
    ) {
      //set the values from the open mat to state
      let obj = {};
      for (const val in this.state.openMat) {
        if (this.props.matDetails[val] !== null) {
          //prevents null values from being set to state
          obj[val] = this.props.matDetails[val];
        } else obj[val] = '';
      }
      this.setState({ openMat: obj });
      this.matDetailsSetToState = true;
    }
  }

  onFormSubmit = (e) => {
    e.preventDefault();

    this.props.updateOpenmat({
      ...this.state.openMat,
      id: this.props.matDetails.id,
      updatedAt_by: this.props.user.id,
      updatedAt: sqlDate(),
    });

    // this.props.history.push(`/openmats/${this.props.matDetails.id}`);

    // wait till newly created/updated mat has been returned from database, then redirect there
    let interval = setInterval(() => {
      if (this.props.newMatId) {
        this.props.history.push(`/openmats/${this.props.newMatId}`);
        //now set newMatId back to null for next time this is run
        this.props.resetMatId();
        //now end setInterval
        clearInterval(interval);
      }
    }, 20);
  };

  renderLargeForm() {
    return (
      <div>
        <form onSubmit={(e) => this.onFormSubmit(e)} autoComplete="off">
          <div className="d-flex justify-content-between">
            <div style={{ flexBasis: '30%' }} className="form-group">
              <label htmlFor="day">Day of the week:</label>
              <select
                required
                className="form-control"
                id="day"
                value={this.state.openMat.day}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.day = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (required)
                </option>
                {days.map((el) => (
                  <option key={el}>{el}</option>
                ))}
              </select>
            </div>
            <div style={{ flexBasis: '30%' }} className="form-group">
              <label htmlFor="time">Time:</label>
              <input
                required
                className="form-control"
                placeholder="Required"
                type="time"
                id="time"
                value={this.state.openMat.time}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.time = e.target.value;
                  this.setState({ openMat: obj });
                }}
              ></input>
            </div>
            <div style={{ flexBasis: '30%' }} className="form-group">
              <label htmlFor="cost">Cost:</label>
              <input
                className="form-control"
                type="number"
                placeholder="(optional)"
                id="cost"
                min="0"
                inputMode="decimal"
                value={this.state.openMat.cost}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.cost = e.target.value;
                  this.setState({ openMat: obj });
                }}
              ></input>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div style={{ flexBasis: '30%' }} className="form-group">
              <label htmlFor="call_first">Should people call first?</label>
              <select
                className="form-control"
                id="call_first"
                value={this.state.openMat.call_first}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.call_first = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (optional)
                </option>
                <option value={0}>No need, just show up!</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div style={{ flexBasis: '30%' }} className="form-group">
              <label htmlFor="size">How many people are usually there?</label>
              <select
                className="form-control"
                id="size"
                value={this.state.openMat.size}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.size = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (optional)
                </option>
                <option value="S">Small (Less than 10 people)</option>
                <option value="M">Medium (10-20 people)</option>
                <option value="L">Large (20-30 people)</option>
                <option value="XL">Huge (30+ people)</option>
              </select>
            </div>
            <div style={{ flexBasis: '30%' }} className="form-group">
              <label htmlFor="gi_nogi">Gi or Nogi:</label>
              <select
                className="form-control"
                id="gi_nogi"
                value={this.state.openMat.gi_nogi}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.gi_nogi = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (optional)
                </option>
                <option value={1}>Gi</option>
                <option value={2}>Nogi</option>
                <option value={3}>Both</option>
                <option value={4}>Alternates</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Anything we should know first?"
              id="notes"
              value={this.state.openMat.notes}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.notes = e.target.value;
                this.setState({ openMat: obj });
              }}
            ></input>
          </div>
          <div className="d-flex justify-content-end">
            <EditButton
              gymId={this.props.matDetails.gym_id}
              buttonText="Edit This Gym"
            />
            <button type="submit" className="btn btn-primary ml-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }

  renderMediumForm() {
    return (
      <div>
        <form onSubmit={(e) => this.onFormSubmit(e)} autoComplete="off">
          <div className="d-flex justify-content-between">
            <div style={{ flexBasis: '45%' }} className="form-group">
              <label htmlFor="day">Day of the week:</label>
              <select
                required
                className="form-control"
                id="day"
                value={this.state.openMat.day}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.day = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (required)
                </option>
                {days.map((el) => (
                  <option key={el}>{el}</option>
                ))}
              </select>
            </div>
            <div style={{ flexBasis: '45%' }} className="form-group">
              <label htmlFor="time">Time:</label>
              <input
                required
                className="form-control"
                placeholder="Required"
                type="time"
                id="time"
                value={this.state.openMat.time}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.time = e.target.value;
                  this.setState({ openMat: obj });
                }}
              ></input>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div style={{ flexBasis: '45%' }} className="form-group">
              <label htmlFor="cost">Cost:</label>
              <input
                className="form-control"
                type="number"
                placeholder="(optional)"
                id="cost"
                min="0"
                inputMode="decimal"
                value={this.state.openMat.cost}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.cost = e.target.value;
                  this.setState({ openMat: obj });
                }}
              ></input>
            </div>
            <div style={{ flexBasis: '45%' }} className="form-group">
              <label htmlFor="call_first">Should people call first?</label>
              <select
                className="form-control"
                id="call_first"
                value={this.state.openMat.call_first}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.call_first = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (optional)
                </option>
                <option value={0}>No need, just show up!</option>
                <option value={1}>Yes</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div style={{ flexBasis: '45%' }} className="form-group">
              <label htmlFor="size">How many people are usually there?</label>
              <select
                className="form-control"
                id="size"
                value={this.state.openMat.size}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.size = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (optional)
                </option>
                <option value="S">Small (Less than 10 people)</option>
                <option value="M">Medium (10-20 people)</option>
                <option value="L">Large (20-30 people)</option>
                <option value="XL">Huge (30+ people)</option>
              </select>
            </div>
            <div style={{ flexBasis: '45%' }} className="form-group">
              <label htmlFor="gi_nogi">Gi or Nogi:</label>
              <select
                className="form-control"
                id="gi_nogi"
                value={this.state.openMat.gi_nogi}
                onChange={(e) => {
                  let obj = this.state.openMat;
                  obj.gi_nogi = e.target.value;
                  this.setState({ openMat: obj });
                }}
              >
                <option value="" disabled defaultValue>
                  (optional)
                </option>
                <option value={1}>Gi</option>
                <option value={2}>Nogi</option>
                <option value={3}>Both</option>
                <option value={4}>Alternates</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Anything we should know first?"
              id="notes"
              value={this.state.openMat.notes}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.notes = e.target.value;
                this.setState({ openMat: obj });
              }}
            ></input>
          </div>
          <div className="d-flex justify-content-end">
            <EditButton
              gymId={this.props.matDetails.gym_id}
              buttonText="Edit This Gym"
            />
            <button type="submit" className="btn btn-primary ml-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }

  renderSmallForm() {
    return (
      <div>
        <form onSubmit={(e) => this.onFormSubmit(e)} autoComplete="off">
          <div className="form-group">
            <label htmlFor="day">Day of the week:</label>
            <select
              required
              className="form-control"
              id="day"
              value={this.state.openMat.day}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.day = e.target.value;
                this.setState({ openMat: obj });
              }}
            >
              <option value="" disabled defaultValue>
                Choose day of the week
              </option>
              {days.map((el) => (
                <option key={el}>{el}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              required
              className="form-control"
              type="time"
              id="time"
              value={this.state.openMat.time}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.time = e.target.value;
                this.setState({ openMat: obj });
              }}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="cost">Cost:</label>
            <input
              className="form-control"
              type="number"
              placeholder="Enter Cost"
              id="cost"
              min="0"
              inputMode="decimal"
              value={this.state.openMat.cost}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.cost = e.target.value;
                this.setState({ openMat: obj });
              }}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="call_first">Should people call first?</label>
            <select
              className="form-control"
              id="call_first"
              value={this.state.openMat.call_first}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.call_first = e.target.value;
                this.setState({ openMat: obj });
              }}
            >
              <option value="" disabled defaultValue>
                Call first?
              </option>
              <option value={0}>No need, just show up!</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="size">How many people are usually there?</label>
            <select
              className="form-control"
              id="size"
              value={this.state.openMat.size}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.size = e.target.value;
                this.setState({ openMat: obj });
              }}
            >
              <option value="" disabled defaultValue>
                Size
              </option>
              <option value="S">Small (0-10 people)</option>
              <option value="M">Medium (10-20 people)</option>
              <option value="L">Large (20-30 people)</option>
              <option value="XL">Huge (30+ people)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gi_nogi">Gi or Nogi:</label>
            <select
              className="form-control"
              id="gi_nogi"
              value={this.state.openMat.gi_nogi}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.gi_nogi = e.target.value;
                this.setState({ openMat: obj });
              }}
            >
              <option value="" disabled defaultValue>
                Gi or Nogi
              </option>
              <option value={1}>Gi</option>
              <option value={2}>Nogi</option>
              <option value={3}>Both</option>
              <option value={4}>Alternates</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Anything we should know first?"
              id="notes"
              value={this.state.openMat.notes}
              onChange={(e) => {
                let obj = this.state.openMat;
                obj.notes = e.target.value;
                this.setState({ openMat: obj });
              }}
            ></input>
          </div>
          <div className="d-flex justify-content-end">
            <EditButton
              gymId={this.props.matDetails.gym_id}
              buttonText="Edit This Gym"
            />
            <button type="submit" className="btn btn-primary ml-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }

  renderForm() {
    if (!this.state.openMat || !this.state.openMat.day) return null;
    if (this.props.screenSize > breakPoints.medium)
      return this.renderLargeForm();
    if (this.props.screenSize > breakPoints.small)
      return this.renderMediumForm();
    else return this.renderSmallForm();
  }

  render() {
    return (
      <div>
        <h2
          className={
            this.props.screenSize > breakPoints.medium
              ? 'my-5 text-center display-4'
              : 'my-5 text-center'
          }
        >
          Edit Open Mat
        </h2>
        {this.renderForm()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    screenSize: state.screenSize,
    newMatId: state.newMatId,
    matDetails: state.matDetails,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  showOpenmat,
  updateOpenmat,
  resetMatId,
})(UpdateMat);
