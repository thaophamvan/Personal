import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import Spinner from '../../../lib/components/spinner/spinner';

export default () => (
  <div>
    <h1>Spinners</h1>
    <Row>
      <Column>
        <ComponentDemo>
          <Spinner />
        </ComponentDemo>
      </Column>
      <Column>
        <ComponentDemo>
          <Spinner type="fading" />
        </ComponentDemo>
      </Column>
    </Row>
  </div>
);
