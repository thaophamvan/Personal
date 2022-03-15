import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Notification from '../notification';
import Button from '../../button/button';

describe('Notification', () => {
  let clock;

  before(() => {
    clock = sinon.useFakeTimers();
    global.requestAnimationFrame = (cb) => {
      cb();
    };
  });

  after(() => {
    clock.restore();
  });

  it('should mount', () => {
    const wrapper = mount(<Notification title="Notification" />);
    expect(wrapper).to.be.present();
  });

  it('should render with the given title and description', () => {
    const wrapper = mount(<Notification title="This is the title" description="This is the description" />);

    expect(wrapper.text()).to.contain('This is the title');
    expect(wrapper.text()).to.contain('This is the description');
  });

  it('should render with a set of custom buttons', () => {
    const firstStub = sinon.stub();
    const secondStub = sinon.stub();
    const wrapper = mount((
      <Notification
        title="This is the title"
        buttons={[
          { label: 'First Button', action: firstStub },
          { label: 'Second Button', action: secondStub },
        ]}
      />
    ));

    wrapper.find(Button).filterWhere(btn => btn.text() === 'First Button').simulate('click');
    expect(firstStub).to.have.been.calledOnce();

    wrapper.find(Button).filterWhere(btn => btn.text() === 'Second Button').simulate('click');
    expect(firstStub).to.have.been.calledOnce();
  });

  it('call the given onDismiss when automatically dismissing', () => {
    const onDismissStub = sinon.stub();
    mount((
      <Notification
        title="This is the title"
        dismissTimeout={1}
        onDismiss={onDismissStub}
      />
    ));

    // 50ms for initial mount timeout, 1000ms to the first tick, 500ms for the CSS transition delay.
    clock.tick(1551);

    expect(onDismissStub).to.have.been.calledOnce();
  });
});
