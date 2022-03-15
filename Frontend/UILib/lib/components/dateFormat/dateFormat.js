import React from 'react';
import PropTypes from 'prop-types';

const timeConstants = require('./time');
const language = require('./language');

const assembleString = parts => parts.filter(x => x).reduce((str, part) => `${str}${str.length ? ' ' : ''}${part}`, '');

const getHours = date => `0${date.getHours()}`.slice(-2);

const getMinutes = date => `0${date.getMinutes()}`.slice(-2);

const getWeekday = (date, { longFormat }) => {
  const dayString = language.weekdays[date.getDay()];
  return longFormat ? dayString : dayString.substr(0, 3);
};

const getMonth = (date, { longFormat }) => {
  const monthString = language.months[date.getMonth()];
  return longFormat ? monthString : monthString.substr(0, 3);
};

const format = (now, input, { withTime, withWeekday, longFormat } = {}) => {
  const nowDate = new Date(now);
  const inputDate = new Date(input);
  const diffAbs = Math.abs(nowDate.getTime() - input);

  const weekday = withWeekday ? getWeekday(inputDate, { longFormat }) : null;
  const day = inputDate.getDate();
  const month = getMonth(inputDate, { longFormat });
  const year = nowDate.getYear() !== inputDate.getYear() ? inputDate.getUTCFullYear() : null;
  const time = withTime ? `${getHours(inputDate)}.${getMinutes(inputDate)}` : null;

  // Should we render with igår, idag or imorgon?
  if (diffAbs < timeConstants.day && nowDate.getDate() === inputDate.getDate()) {
    return assembleString([language.words.today, time, year]);
  } else if (diffAbs < 2 * timeConstants.day) {
    if (nowDate.getDate() === inputDate.getDate() + 1) {
      return assembleString([language.words.yesterday, time, year]);
    } else if (nowDate.getDate() === inputDate.getDate() - 1) {
      return assembleString([language.words.tomorrow, time, year]);
    }
  }

  return assembleString([weekday, day, month, time, year]);
};

const formatRelative = (now, input, options) => {
  const nowDate = new Date(now);
  const inputDate = new Date(input);
  const diff = now - input;
  const diffAbs = Math.abs(diff);

  const isSameDay = diff < 24 * timeConstants.hour && nowDate.getDay() === inputDate.getDay();

  if (diffAbs < 10 * timeConstants.second) return 'alldeles nyss';

  // Second precision
  if (diffAbs < timeConstants.minute) {
    const seconds = Math.floor(diffAbs / timeConstants.second);
    return diff > 0 ? `${seconds} sekunder sedan` : `om ${seconds} sekunder`;
  }

  // Minute precision
  if (diffAbs < timeConstants.hour) {
    const minutes = Math.floor(diffAbs / timeConstants.minute);
    return diff > 0 ? `${minutes} minuter sedan` : `om ${minutes} minuter`;
  }

  // Hour precision
  if (isSameDay) {
    const hours = Math.floor(diffAbs / timeConstants.hour);
    return diff > 0 ? `${hours} timmar sedan` : `om ${hours} timmar`;
  }

  return format(now, input, options);
};

class DateFormat extends React.Component {
  static format(now, input, options = {}) {
    return options.relative ? formatRelative(now, input, options) : format(now, input, options);
  }

  state = {
    now: Date.now(),
  };

  componentDidMount() {
    if (this.props.autoUpdate) {
      this.pollTimeout = setTimeout(this.tick, this.props.tickInterval);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.pollTimeout);
  }

  tick = () => {
    this.setState({ now: Date.now() });
    this.pollTimeout = setTimeout(this.tick, this.props.tickInterval);
  };

  render() {
    const { now } = this.state;
    const {
      input, render, ...options
    } = this.props;

    return render(DateFormat.format(now, input, options));
  }
}

DateFormat.propTypes = {
  autoUpdate: PropTypes.bool,
  input: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  longFormat: PropTypes.bool,
  relative: PropTypes.bool,
  render: PropTypes.func,
  tickInterval: PropTypes.number,
  withTime: PropTypes.bool,
  withWeekday: PropTypes.bool,
};

DateFormat.defaultProps = {
  autoUpdate: false,
  longFormat: false,
  relative: false,
  render: val => <span>{val}</span>,
  tickInterval: 1000,
  withTime: false,
  withWeekday: false,
};

DateFormat.propDescriptions = {
  input: 'The timestamp as number of milliseconds since 1970-01-01 00:00.00',
  render: 'A function to render the actual date. Receives the output string as a parameter.',
  withTime: 'Show the time along with the date.',
};

export default DateFormat;
