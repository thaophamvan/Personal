import React from 'react';
import PropTypes from 'prop-types';
import scrollTo from 'scroll-to';

import jQuery from 'jquery/src/core';
import 'jquery/src/core/parseHTML';
import 'jquery/src/selector';
import 'jquery/src/core/ready';
import 'jquery/src/data';
import 'jquery/src/queue';
import 'jquery/src/queue/delay';
import 'jquery/src/attributes';
import 'jquery/src/event';
import 'jquery/src/event/alias';
import 'jquery/src/manipulation';
import 'jquery/src/wrap';
import 'jquery/src/css/showHide';
import 'jquery/src/css/hiddenVisibleSelectors';
import 'jquery/src/serialize';
import 'jquery/src/offset';
import 'jquery/src/dimensions';
import 'jquery/src/deprecated';
import Trumbowyg from './Trumbowyg';
import { getScrollPosition } from '../../../utilities';

window.$ = jQuery;

const propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
  buttons: PropTypes.array,
};

const defaultProps = {
  id: '',
  content: '',
  onChange: () => { },
  autoFocus: true,
  buttons: [
    ['viewHTML'],
    'btnGrp-semantic',
    ['link'],
    'btnGrp-justify',
    'btnGrp-lists',
  ],
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      const editor = document.getElementById(this.props.id);
      editor.focus();
      scrollTo(0, getScrollPosition(editor) - 80, { duration: 200 });
    }
  }

  handleOnChange(e) {
    setTimeout(() => {
      const { onChange } = this.props;
      onChange(jQuery(e.target).trumbowyg('html'));
    }, 100);
  }

  render() {
    const { id, content, buttons } = this.props;
    return (
      <Trumbowyg
        id={id}
        buttons={buttons}
        data={content}
        onChange={this.handleOnChange}
        removeformatPasted
      />
    );
  }
}

TextEditor.propTypes = propTypes;
TextEditor.defaultProps = defaultProps;

export default TextEditor;
