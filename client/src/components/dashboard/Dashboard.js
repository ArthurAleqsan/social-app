import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';

class Dashboard extends Component {
  componentWillMount() {
      this.props.getCurrentProfile();
  }
  render() {
    const { profile, loading } = this.props.profile;
    const { user } = this.props.auth;

    let dashboardContent;

    if(profile === null || loading) {
        dashboardContent = < Spinner/ >
    } else {
             // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
            <div>
                <p className="lead text-muted">
                Welcome {user.name}
                </p>
            </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div>
        { dashboardContent }
      </div>
    )
  }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    profile : state.profile,
    auth: state.auth
});
  
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
