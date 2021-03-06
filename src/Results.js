import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ResultsList from './ResultsList';

function Results({ error, results, location }) {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (results.length) {
    return <ResultsList results={results} />;
  }
  if (!location.search) {
    return <Redirect to="/" />;
  }

  return <div>Loading...</div>;
}
Results.propTypes = {
  error: PropTypes.shape(),
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  location: PropTypes.shape().isRequired,
};
Results.defaultProps = {
  error: null,
};

export default Results;
