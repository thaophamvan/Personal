import React from 'react'
import { filter } from 'lodash/fp'
import { Row, Column } from '../Layout'
import ComponentDemo from '../ComponentDemo'
import Tabs from '../../../lib/components/tabs'

const adjectives = ['Fast', 'Slow', 'Tiny', 'Scary', 'Sleeping', 'Sad', 'Laughing', 'Crying']
const animals = ['Elephant', 'Bear', 'Rabbit', 'Fish', 'Dragon', 'Lion', 'Panda', 'Anton', 'Niclas']
const getRandomAnimal = () => {
  const randomArrayElement = arr => arr[Math.floor(Math.random() * arr.length)]

  return `${randomArrayElement(adjectives)} ${randomArrayElement(animals)}`
}

class TabsComponentPage extends React.Component {
  state = {
    activeTab: '222',
    tabs: [
      {
        id: '111',
        title: getRandomAnimal(),
      },
      {
        id: '222',
        title: getRandomAnimal(),
      },
      {
        id: '333',
        title: getRandomAnimal(),
      },
      {
        id: '444',
        title: getRandomAnimal(),
      },
    ],
  }

  onTabClick = tab => {
    this.setState({ activeTab: tab.id })
  }

  onTabClose = tabToRemove => {
    const tabs = filter(tab => tab.id !== tabToRemove.id, this.state.tabs)

    this.setState({
      tabs,
      activeTab: tabs[0].id,
    })
  }

  onNewTabClick = () => {
    const tabKey = `${Date.now()}`

    this.setState({
      activeTab: tabKey,
      tabs: [
        ...this.state.tabs,
        {
          id: tabKey,
          title: getRandomAnimal(),
        },
      ],
    })
  }

  render() {
    const { activeTab, tabs } = this.state
    return (
      <div>
        <h1>Tabs</h1>
        <Row>
          <Column>
            <ComponentDemo>
              <Tabs
                activeTab={activeTab}
                onTabClick={this.onTabClick}
                onTabClose={this.onTabClose}
                onNewTabClick={this.onNewTabClick}
                tabs={tabs}
              />
            </ComponentDemo>
          </Column>
        </Row>
      </div>
    )
  }
}

export default TabsComponentPage
