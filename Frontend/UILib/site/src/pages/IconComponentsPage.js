import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import PropsTable from '../PropsTable';
import Icon from '../../../lib/components/icon/icon';
import standardShapes from '../../../lib/utils/standardShapes';
import customShapes from '../../../lib/utils/customShapes';

export default () => (
  <div>
    <h1>Icon</h1>

    <Row>
      <Column>
        <ComponentDemo>
          <div>
            <Icon shape="add" />
            <Icon shape="crop" />
            <Icon shape="notifications" type="danger" />
            <Icon shape="download" type="inverted" />
            <Icon shape="download" type="inverted" small />
            <Icon shape="remove" type="inverted" size={50} />
          </div>
        </ComponentDemo>
      </Column>
    </Row>

    <Row>
      <Column>
        <div className="icons-page__list">
          {Object.keys(standardShapes).map(key => (
            <div className="icon-card" key={key}>
              <Icon className="icon-card__icon" shape={key} />
              <h3 className="icon-card__title">{key}</h3>
            </div>
          ))}
        </div>
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Custom Icons</h2>
        <div className="icons-page__list">
          { Object.keys(customShapes).map(key => (
            <div className="icon-card" key={key}>
              <Icon className="icon-card__icon" shape={key} />
              <h3 className="icon-card__title">{key}</h3>
            </div>
          ))}
        </div>
      </Column>
    </Row>

    <Row>
      <PropsTable component={Icon} />
    </Row>
  </div>);
