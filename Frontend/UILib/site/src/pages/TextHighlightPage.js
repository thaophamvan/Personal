import React from 'react';
import { Row, Column } from '../Layout';
import PropsTable from '../PropsTable';
import ComponentDemo from '../ComponentDemo';
import TextHighlight from '../../../lib/components/textHighlight/textHighlight';

const TextHighlights = () => (
  <div>
    <h1>TextHighlight</h1>
    <Row>
      <Column>
        <ComponentDemo>
          <TextHighlight
            highlight="strän"
          >
              Hela strängen
          </TextHighlight>
        </ComponentDemo>
      </Column>
      <Column>
        <ComponentDemo>
          <TextHighlight
            highlight="strän"
            renderHighlight={(fragment, highlightProps) => <button {...highlightProps}>{fragment}</button>}
          >
              Hela strängen och stränder
          </TextHighlight>
        </ComponentDemo>
      </Column>
    </Row>
    <Row>
      <PropsTable component={TextHighlight} />
    </Row>
  </div>
);

export default TextHighlights;

