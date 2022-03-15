import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Badge from '../badge';
import Icon from '../../icon/icon';

describe('Badge', () => {
  it('should render text', () => {
    const badge = mount(<Badge>Titel</Badge>);
    expect(badge.text()).to.eql('Titel');
  });

  // TODO: test should handle undefined children

  it('should support custom classNames', () => {
    const badge = mount(<Badge className="classy">Classy text</Badge>);
    expect(badge.hasClass('classy')).to.be.true();
  });

  describe('Icon support', () => {
    it('should render the given icon', () => {
      const badge = mount(<Badge icon="check">Oj</Badge>);
      expect(badge.find(Icon)).to.be.present();
    });

    it('should not render an icon when icon prop is not set', () => {
      const badge = mount(<Badge>No</Badge>);
      expect(badge.find(Icon)).to.not.be.present();
    });

    it('should render a small icon', () => {
      const icon = mount(<Badge icon="check">classy text</Badge>).find(Icon);
      expect(icon.props().small).to.be.true();
    });

    it('should support onClick', () => {
      const onIconClickSpy = sinon.spy();
      const badge = mount(<Badge icon="check" onIconClick={onIconClickSpy}>Classy text</Badge>);
      badge.find(Icon).simulate('click');
      expect(onIconClickSpy).to.have.been.calledOnce();
    });
  });

  describe('Icon Alignment', () => {
    it('should align the icon on the left by default', () => {
      const badge = mount(<Badge icon="check">Icon on the left</Badge>);
      expect(badge.find('.badge--left-aligned-icon')).to.be.present();
    });

    it('should align the icon to the right when the prop is set', () => {
      const badge = mount(<Badge icon="check" rightAlignedIcon>Icon on the right</Badge>);

      expect(badge.find('.badge--right-aligned-icon')).to.be.present();
    });
  });
});
