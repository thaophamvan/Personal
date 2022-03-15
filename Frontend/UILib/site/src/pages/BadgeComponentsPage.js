import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import Badge from '../../../lib/components/badge/badge';
import ArticleStatusBadge from '../../../lib/components/articleStatusBadge/articleStatusBadge';

const draftArticle = {};
const publishedArticle = { publishedAt: 1 };
const scheduledArticle = { publishedAt: Date.now() * 2 };
const sentToEpiArticle = { sentToEPiAt: 1 };
const sentToNewspilotArticle = { sentToNpAt: 1 };

const BadgeComponentsPage = () => (
  <div>
    <h1>Buttons</h1>
    <Row>
      <Column>
        <ComponentDemo>
          <div>
            <Badge icon="check">Check!</Badge>
            <Badge icon="check" rightAlignedIcon>My icon is on the right!</Badge>
          </div>
        </ComponentDemo>
      </Column>
    </Row>

    <h2>Article Status Badge</h2>
    <p>This is a specialized <strong>Badge</strong> component. Use it to display an articles current status.</p>
    <Row>
      <Column>
        <ComponentDemo>
          <ArticleStatusBadge article={draftArticle} />
        </ComponentDemo>
      </Column>
      <Column>
        <ComponentDemo>
          <ArticleStatusBadge article={publishedArticle} />
        </ComponentDemo>
      </Column>
      <Column>
        <ComponentDemo>
          <ArticleStatusBadge article={scheduledArticle} />
        </ComponentDemo>
      </Column>
    </Row>
    <Row>
      <Column>
        <ComponentDemo>
          <ArticleStatusBadge article={sentToEpiArticle} />
        </ComponentDemo>
      </Column>
      <Column>
        <ComponentDemo>
          <ArticleStatusBadge article={sentToNewspilotArticle} />
        </ComponentDemo>
      </Column>
    </Row>
  </div>
);

export default BadgeComponentsPage;
