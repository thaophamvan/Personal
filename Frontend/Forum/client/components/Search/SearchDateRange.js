import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { DateRangePicker } from 'react-dates';
import isMobile from 'ismobilejs';

import 'react-dates/lib/css/_datepicker.css';
import './SearchDateRange.scss';

const propTypes = {
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,
  onDatesChange: PropTypes.func,
};

const defaultProps = {
  initialStartDate: null,
  initialEndDate: null,
  onDatesChange: () => { },
};

class SearchDateRange extends React.Component {
  constructor(props) {
    super(props);

    const focusedInput = null;

    this.state = {
      focusedInput,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.props.onDatesChange({ startDate, endDate });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { initialStartDate, initialEndDate } = this.props;
    const { focusedInput } = this.state;
    return (
      <DateRangePicker
        onDatesChange={this.onDatesChange}
        onFocusChange={this.onFocusChange}
        startDate={initialStartDate}
        endDate={initialEndDate}
        focusedInput={focusedInput}
        enableOutsideDays
        isOutsideRange={day => false}
        daySize={26}
        numberOfMonths={isMobile.phone ? 1 : 2}
      />
    );
  }
}

SearchDateRange.propTypes = propTypes;
SearchDateRange.defaultProps = defaultProps;

export default SearchDateRange;
