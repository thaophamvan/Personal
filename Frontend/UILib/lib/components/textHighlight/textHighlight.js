import React from 'react';
import PropTypes from 'prop-types';

function splitOnMatches(string, subString) {
  const regex = RegExp(subString.toLowerCase(), 'g');
  const matches = [];
  let match;
  while ((match = regex.exec(string.toLowerCase())) !== null) { // eslint-disable-line no-cond-assign
    matches.push(match);
  }
  if (!matches.length) {
    return [string];
  }

  const parts = [];
  matches.reduce((startIndex, currMatch) => {
    parts.push(string.substring(startIndex, currMatch.index));
    parts.push(string.substr(currMatch.index, subString.length));
    return currMatch.index + subString.length;
  }, 0);

  const lastMatch = matches[matches.length - 1];
  if ((lastMatch.index + subString.length) < string.length) {
    return parts.concat(string.substr(lastMatch.index + subString.length));
  }
  return parts;
}


const TextHighlight = ({ children, highlight, renderHighlight }) => {
  if (!highlight.length) {
    return <div className="text-highlight">{ children }</div>;
  }
  const parts = splitOnMatches(children, highlight);
  return (
    <div className="text-highlight">
      {parts.map((part, key) =>
        (part.toLowerCase() === highlight.toLowerCase() ? renderHighlight(part, { key }) : part))}
    </div>
  );
};

TextHighlight.propTypes = {
  children: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired,
  renderHighlight: PropTypes.func,
};

TextHighlight.defaultProps = {
  renderHighlight: (fragment, highlightProps) => <span className="text-highlight__fragment" {...highlightProps}>{fragment}</span>,
};

TextHighlight.propDescriptions = {
  children: 'String to be highlighted',
  highlight: 'Substring to highlight',
  renderHighlight: 'Optional render prop to control decoration of highlighted fragments. Called with the string to highlight and highligtProps to be spread on the element',
};

export default TextHighlight;
