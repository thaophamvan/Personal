import React from 'react'
import { Switch, Route } from 'react-router'
import { HashRouter, Link } from 'react-router-dom'

import './styleguide.styl'

import GroupedMenu from './menu/GroupedMenu'
import Icon from '../../lib/components/icon/icon'
import ButtonComponentsPage from './pages/ButtonComponentsPage'
import ColorsPage from './pages/ColorsPage'
import DropDownComponentsPage from './pages/DropDownComponentsPage'
import IconComponentsPage from './pages/IconComponentsPage'
import SpinnerComponentsPage from './pages/SpinnerComponentsPage'
import StartPage from './pages/StartPage'
import SwitchComponentsPage from './pages/SwitchComponentsPage'
import CheckboxComponentsPage from './pages/CheckboxComponentsPage'
import TextFieldComponentsPage from './pages/TextFieldComponentsPage'
import TextFieldCustomComponentsPage from './pages/TextFieldCustomComponentsPage'
import TypographyPage from './pages/TypographyPage'
import ListPage from './pages/ListPage'
import BadgeComponentsPage from './pages/BadgeComponentsPage'
import NotificationComponentPage from './pages/NotificationComponentPage'
import AutocompleteComponentPage from './pages/AutocompleteComponentPage'
import TextHighlightPage from './pages/TextHighlightPage'
import TooltipComponentsPage from './pages/TooltipComponentsPage'
import DateFormatComponentsPage from './pages/DateFormatComponentsPage'
import TabsComponentPage from './pages/TabsComponentPage'

const linkGroups = [
  {
    title: 'Visual',
    basePath: '/visual',
    pages: [
      { path: '/colors', label: 'Colors', pageComponent: ColorsPage },
      {
        path: '/typography',
        label: 'Typography',
        pageComponent: TypographyPage,
      },
      { path: '/lists', label: 'Lists', pageComponent: ListPage },
    ],
  },
  {
    title: 'Components',
    basePath: '/components',
    pages: [
      {
        path: '/AutocompletePage',
        label: 'Autocomplete',
        pageComponent: AutocompleteComponentPage,
      },
      { path: '/Badge', label: 'Badge', pageComponent: BadgeComponentsPage },
      { path: '/Button', label: 'Button', pageComponent: ButtonComponentsPage },
      {
        path: '/DateFormat',
        label: 'DateFormat',
        pageComponent: DateFormatComponentsPage,
      },
      {
        path: '/Dropdown',
        label: 'Dropdown',
        pageComponent: DropDownComponentsPage,
      },
      { path: '/Icon', label: 'Icon', pageComponent: IconComponentsPage },
      {
        path: '/Notifications',
        label: 'Notification',
        pageComponent: NotificationComponentPage,
      },
      {
        path: '/Spinner',
        label: 'Spinner',
        pageComponent: SpinnerComponentsPage,
      },
      { path: '/Switch', label: 'Switch', pageComponent: SwitchComponentsPage },
      { path: '/Checkbox', label: 'Checkbox', pageComponent: CheckboxComponentsPage },
      { path: '/Tabs', label: 'Tabs', pageComponent: TabsComponentPage },
      { path: '/TextField', label: 'TextField', pageComponent: TextFieldComponentsPage },
      { path: '/TextFieldCustom', label: 'TextField (Custom)', pageComponent: TextFieldCustomComponentsPage },
      { path: '/TextHighlight', label: 'TextHighlight', pageComponent: TextHighlightPage },
      { path: '/Tooltip', label: 'Tooltip', pageComponent: TooltipComponentsPage },
    ],
  },
]

export default () => (
  <HashRouter>
    <div className="style-guide">
      <div className="style-guide__navigation">
        <div className="style-guide__logo">
          <Link to="/">
            <Icon shape="logo" size={92} />
          </Link>
        </div>
        <Link to="/" className="style-guide__logo-text">
          Klara UI
        </Link>
        <nav className="style-guide__menu">
          <GroupedMenu menuGroups={linkGroups} />
        </nav>
      </div>
      <div className="style-guide__wrapper">
        <Switch>
          <Route exact path="/" component={StartPage} />
          {linkGroups.map(linkGroup =>
            linkGroup.pages.map(page => (
              <Route exact path={linkGroup.basePath + page.path} component={page.pageComponent} />
            ))
          )}
        </Switch>
      </div>
    </div>
  </HashRouter>
)
