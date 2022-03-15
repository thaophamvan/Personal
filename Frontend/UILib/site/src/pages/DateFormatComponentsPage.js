import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import PropsTable from '../PropsTable';
import DateFormat from '../../../lib/components/dateFormat/dateFormat';
import Badge from '../../../lib/components/badge/badge';
import Button from '../../../lib/components/button/button';
import time from '../../../lib/components/dateFormat/time';

const DateFormatComponentsPage = () => (
  <div>
    <h1>DateFormat</h1>
    <Row>
      <Column>
        <h2>Access the logic through a static method:</h2>
        <code>DateFormat.format(Date.now(), 1516029000000, options)</code>
      </Column>
    </Row>
    <hr />
    <Row>
      <Column>
        <ComponentDemo>
          <div>
            <ul>
              <li><DateFormat input={1516029000000} /></li>
              <li><DateFormat input={1516029000000} relative /></li>
              <li><DateFormat input={1516029000000} withTime withWeekday longFormat /></li>
              <li>Ändrad av Anton Niklasson för <DateFormat input={Date.now() - 10000} autoUpdate relative /></li>
              <li><DateFormat input={(new Date('2017-01-01')).getTime()} /></li>
              <li><DateFormat input={Date.now() - (2 * time.hour)} relative /></li>
              <li><DateFormat input={1516029000000} withTime relative /></li>
              <li><DateFormat input={Date.now() - 15000} autoUpdate relative tickInterval={10000} render={formatted => <Badge icon="open_in_new">{formatted}</Badge>} /></li>
            </ul>
            <DateFormat
              input={Date.now() + 20000}
              autoUpdate
              relative
              render={formatted => <Button size="large" icon="fullscreen">{formatted}</Button>}
            />
          </div>
        </ComponentDemo>
      </Column>
    </Row>
    <Row>
      <PropsTable component={DateFormat} />
    </Row>
  </div>
);


export default DateFormatComponentsPage;
