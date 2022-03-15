import React, { Component, PropTypes } from 'react';
import 'trumbowyg';
import $ from 'jquery/src/core';
import svgIcons from 'trumbowyg/dist/ui/icons.svg';

import IfComponent from '../IfComponent';

const propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  buttons: PropTypes.array,
  removeformatPasted: PropTypes.bool,
  onChange: PropTypes.func,
};

const defaultProps = {
  buttons: [
    ['viewHTML'],
    ['formatting'],
    'btnGrp-semantic',
    ['superscript', 'subscript'],
    ['link'],
    ['insertImage'],
    'btnGrp-justify',
    'btnGrp-lists',
    ['horizontalRule'],
    ['removeformat'],
    ['fullscreen'],
  ],
  placeholder: '',
  removeformatPasted: false,
  onChange: () => { },
};

const trumbowygIconsId = 'trumbowyg-icons';

class Trumbowyg extends Component {
  constructor(props) {
    super(props);
    const needSetupSvg = document.getElementById(trumbowygIconsId) === null ||
      document.getElementById(trumbowygIconsId).length === 0;
    this.state = {
      needSetupSvg,
    };
  }
  componentDidMount() {
    const {
      id,
      buttons,
      removeformatPasted,
      data,
      onChange,
    } = this.props;

    this.trumbowygInstance = $(`#${id}`).trumbowyg({
      btns: buttons,
      removeformatPasted,
      svgPath: '',
    });

    this.trumbowygInstance.on('tbwchange', onChange);

    this.trumbowygInstance.trumbowyg('html', data);
  }

  componentWillUnmount() {
    this.trumbowygInstance.trumbowyg('destroy');
  }

  render() {
    const { needSetupSvg } = this.state;
    const { buttons } = this.props;
    return (
      <div className={buttons.length === 0 ? 'trumbowyg-no-toolbar' : ''}>
        <IfComponent
          condition={needSetupSvg}
          whenTrue={(
            <div id={trumbowygIconsId} dangerouslySetInnerHTML={{ __html: svgIcons }} />
          )}
          whenFalse={null}
        />
        <div id={`${this.props.id}`} placeholder={this.props.placeholder} />
      </div>
    );
  }
}

Trumbowyg.defaultProps = defaultProps;
Trumbowyg.propTypes = propTypes;

export default Trumbowyg;
