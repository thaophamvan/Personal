import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  html: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

const defaultProps = {
  html: '',
  className: '',
  placeholder: '',
  onChange: () => { },
  id: 'txtContentEditable',
};

class ContentEditable extends React.Component {
  constructor(props) {
    super(props);
    this.emitChange = this.emitChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.command = {
      format: 'formatBlock',
      insert: 'insertText',
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.editableRef.innerHTML;
  }

  componentDidUpdate() {
    if (this.props.html !== this.editableRef.innerHTML) {
      this.editableRef.innerHTML = this.props.html;
    }
  }

  onKeyDown(event) {
    if (event.keyCode === 13) { // onEnter
      window.document.execCommand(this.command.format, false, 'p');
    }
  }

  onBlur(event) {
    if (this.editableRef.innerText.trim() === '') {
      this.editableRef.classList.add('placeholder');
    }
    this.emitChange();
  }

  onFocus(event) {
    this.editableRef.classList.remove('placeholder');
  }

  onPaste(event) {
    event.preventDefault();
    let pastedText = '';
    if (window.clipboardData && window.clipboardData.getData) { // IE
      pastedText = window.clipboardData.getData('Text');
      if (window.getSelection) {
        const textNode = document.createTextNode(pastedText);
        window.getSelection().getRangeAt(0).insertNode(textNode);
      }
    } else if (event.clipboardData && event.clipboardData.getData) { // other browsers
      pastedText = event.clipboardData.getData('text/plain');
      window.document.execCommand(this.command.insert, false, pastedText);
    }
  }

  emitChange() {
    const html = this.editableRef.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange(html);
    }
    this.lastHtml = html;
  }

  render() {
    const { html, className, placeholder, id } = this.props;
    return (<div
      role="textbox"
      tabIndex="0"
      id={id}
      ref={(r) => { this.editableRef = r; }}
      className={`placeholder ${className}`}
      placeholder={placeholder}
      onInput={this.emitChange}
      onKeyDown={this.onKeyDown}
      onBlur={this.onBlur}
      onPaste={this.onPaste}
      onFocus={this.onFocus}
      contentEditable
      dangerouslySetInnerHTML={{ __html: html }}
    />);
  }
}

ContentEditable.propTypes = propTypes;
ContentEditable.defaultProps = defaultProps;

export default ContentEditable;
