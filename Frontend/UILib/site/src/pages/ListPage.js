import React from 'react';
import { Row } from '../Layout';
import PropsTable from '../PropsTable';
import List from '../../../lib/components/list/List';

const demoStyles = {
  width: '100%',
  background: '#f6f6f6',
};

const demoCenteredStyles = Object.assign({}, demoStyles, { height: '150px' });

export default () => (
  <div>
    <h1>List</h1>
    <h2>Description</h2>
    <p>
      The {'<List />'} component is just a simple way to list items and get margins inbetween those automatically. The
      gray background in the examples below are just for demo purposes (what happens when you put the list in a parent
      with set width/height).
    </p>
    <p>
      For now we will keep this component simple. If we find it useful, we might extend its usage to be more
      layout-like.
    </p>
    <h1>Centered</h1>

    <div style={demoCenteredStyles}>
      <List>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </List>
    </div>

    <h1>Right</h1>

    <div style={demoStyles}>
      <List direction="right">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </List>
    </div>

    <h1>Down</h1>

    <div style={demoStyles}>
      <List direction="down">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </List>
    </div>

    <h1>Left</h1>

    <div style={demoStyles}>
      <List direction="left">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </List>
    </div>

    <h1>Up</h1>

    <div style={demoStyles}>
      <List direction="up">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </List>
    </div>

    <Row>
      <PropsTable component={List} />
    </Row>
  </div>
);
