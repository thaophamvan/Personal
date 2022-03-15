import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'
import Tabs from '../tabs'
import Icon from '../../icon/icon'
import OverflowIndicator from '../overflowIndicator'

const propEquals = (prop, value) => element => element.props()[prop] === value

const someTabs = [
  {
    id: 'aa-11',
    title: 'Lorem Ipsum',
  },
  {
    id: 'bb-22',
    title: 'Ipsum Ipsum',
  },
  {
    id: 'cc-33',
    title: 'Dolor Sit Amet',
  },
  {
    id: 'dd-44',
    title: 'Dolor Lorem Amet',
  },
]

describe('Tabs', () => {
  it('should render the tabs list with a "div" tag', () => {
    const wrapper = mount(<Tabs tabs={someTabs} />)

    expect(wrapper.find('div')).to.exist()
  })

  it('should call the click handler with the correct tab object when a tab is clicked', () => {
    const onClickSpy = sinon.spy()
    const wrapper = mount(<Tabs onTabClick={onClickSpy} tabs={someTabs} />)

    wrapper
      .find(Tabs.Tab)
      .filterWhere(tab => tab.text() === 'Lorem Ipsum')
      .simulate('click')

    expect(onClickSpy).to.have.been.calledWith(someTabs[0])
  })

  it('should call the close handler on closing any tab', () => {
    const onCloseStub = sinon.stub()
    const wrapper = mount(<Tabs onTabClose={onCloseStub} tabs={someTabs} />)

    wrapper
      .find(Tabs.Tab)
      .filterWhere(tab => tab.text() === 'Lorem Ipsum')
      .find(Icon)
      .simulate('click')

    expect(onCloseStub).to.have.been.called()
  })

  it('should call the new tab handler on clicking that button', () => {
    const onNewTabStub = sinon.stub()
    const wrapper = mount(<Tabs tabs={someTabs} onNewTabClick={onNewTabStub} />)

    wrapper.find(Tabs.NewTab).simulate('click')

    expect(onNewTabStub).to.have.been.called()
  })

  describe('Overflowing', () => {
    it("should render an overflow indicator if state 'overflowingRight' is true", () => {
      const wrapper = mount(<Tabs tabs={someTabs} />)

      wrapper.setState({ overflowingRight: true })

      const indicator = wrapper.find(OverflowIndicator).filterWhere(propEquals('direction', 'right'))

      expect(indicator).to.exist()
      expect(indicator.props().visible).to.be.true()
    })
  })
})
