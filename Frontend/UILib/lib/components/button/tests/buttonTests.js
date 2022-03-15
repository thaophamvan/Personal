import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Button from './../button';
import shapes from '../../../utils/standardShapes';

describe('Button', () => {
  it('should render a button', () => {
    const button = mount(<Button />);
    expect(button).to.have.className('button--standard');
  });

  it('should render text', () => {
    const button = mount(<Button>panda</Button>);
    expect(button).to.have.text('panda');
  });

  it('should not add hasChild modifier when a single child is of type input', () => {
    const button = mount(<Button><input type="text" value="invisible panda" readOnly /></Button>);
    expect(button).to.not.have.className('button--hasChild');
  });

  it('should add hasChild modifier when any child isn\'t of type input ', () => {
    const button = mount((
      <Button>
        <input type="text" value="invisible panda" readOnly />
      This node is not an input
      </Button>));
    expect(button).to.not.have.className('button--hasChild');
  });

  it('should render large button', () => {
    const button = mount(<Button text="panda" size="large" />);
    expect(button).to.have.className('button--large');
  });

  it('should render a disabled button', () => {
    const button = mount(<Button disabled />);
    expect(button).to.have.attr('disabled');
  });

  it('should render a custom className', () => {
    const button = mount(<Button className="my-custom-class-name" />);
    expect(button).to.have.className('my-custom-class-name');
  });

  describe('Button icons', () => {
    it('should render a regular size icon button for all standard shapes', () => {
      Object.keys(shapes).forEach((iconName) => {
        const button = mount(<Button icon={iconName} />);
        expect(button).to.have.className('button--icon');
        expect(button.find('svg')).to.be.present();
        expect(button.find('svg')).to.have.attr('viewBox', '0 0 24 24');
      });
    });

    it('should render a large size icon button for all standard shapes', () => {
      Object.keys(shapes).forEach((iconName) => {
        const button = mount(<Button icon={iconName} size="large" />);
        expect(button).to.have.className('button--icon');
        expect(button.find('svg')).to.be.present();
        expect(button.find('svg')).to.have.attr('viewBox', '0 0 24 24');
      });
    });
  });

  describe('Primary Buttons', () => {
    it('should render a standard button', () => {
      const button = mount(<Button />);
      expect(button).to.have.className('button--standard');
    });

    it('should render a primary button', () => {
      const button = mount(<Button primary />);
      expect(button).to.have.className('button--primary');
    });
  });

  describe('Active Buttons', () => {
    it('should render an active button', () => {
      const button = mount(<Button active />);
      expect(button).to.have.className('button--active');
    });
  });

  describe('Button types', () => {
    it('should render a button with default type', () => {
      const button = mount(<Button />);
      expect(button).to.have.className('button--default');
    });

    it('should render a button with explicit default type', () => {
      const button = mount(<Button type="default" />);
      expect(button).to.have.className('button--default');
    });

    it('should render a button with success type', () => {
      const button = mount(<Button type="success" />);
      expect(button).to.have.className('button--success');
    });

    it('should render a button with warning type', () => {
      const button = mount(<Button type="warning" />);
      expect(button).to.have.className('button--warning');
    });

    it('should render a button with danger type', () => {
      const button = mount(<Button type="danger" />);
      expect(button).to.have.className('button--danger');
    });

    it('should render a button with inverted type', () => {
      const button = mount(<Button type="inverted" />);
      expect(button).to.have.className('button--inverted');
    });
  });

  describe('Button onClick', () => {
    let onClick;

    before(() => {
      onClick = sinon.stub();
    });

    it('should invoke onClick if button is clicked', () => {
      const button = mount(<Button onClick={onClick} />);
      button.simulate('click');
      expect(onClick).to.have.been.called();
    });
  });

  describe('Loading button', () => {
    it('should render a loading button', () => {
      const button = mount(<Button loading />);
      expect(button).to.have.className('button--loading');
      expect(button.find('svg')).to.be.present();
    });
  });

  describe('Rounded corners', () => {
    it('Remove left rounded corners', () => {
      const button = mount(<Button roundLeft={false} />);
      expect(button).to.have.className('button--no-round-left');
    });

    it('Remove right rounded corners', () => {
      const button = mount(<Button roundRight={false} />);
      expect(button).to.have.className('button--no-round-right');
    });
  });

  describe('Href prop', () => {
    it('should render an anchor tag as the container when given an href prop', () => {
      const button = mount(<Button href="http://www.example.com" />);
      expect(button.find('a.button')).to.exist();
    });

    it('should render a button tag when an href is not provided', () => {
      const button = mount(<Button />);
      expect(button.find('button')).to.exist();
      expect(button.find('a')).to.not.exist();
    });
  });

  describe('Button tooltips', () => {
    it('should show when tooltip prop is passed, button is hovered and show the correct text', () => {
      const button = mount(<Button tooltip="Klara 4EVAH" />);
      button.simulate('mouseEnter');
      expect(button.find('.klara-ui-tooltip')).to.exist();
      expect(button.text()).to.equal('Klara 4EVAH');
    });

    it('should NOT show when tooltip prop is absent', () => {
      const button = mount(<Button icon="add" />);
      expect(button.find('.klara-ui-tooltip')).to.not.exist();
    });
  });

  describe('Button target', () => {
    it('should pass the target prop through to the underlying node', () => {
      const button = mount(<Button href="http://expressen.se" target="_blank" />);
      expect(button.find('a').prop('target')).to.eql('_blank');
    });

    it('should not set target by default', () => {
      const button = mount(<Button />);
      expect(button.find('button').prop('target')).to.eql(null);
    });
  });
});
