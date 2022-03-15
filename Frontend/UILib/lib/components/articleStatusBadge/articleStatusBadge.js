import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Badge from '../badge/badge';

function getBadgeIcon(status) {
  if (status === 'Schemalagd') return 'set_time';
  if (status === 'Publicerad') return 'check';
  if (status === 'EPi') return 'send';
  if (status === 'Newspilot') return 'send';
  if (status === 'Utkast') return 'draft';

  return 'check';
}

function getStatusFrom({ sentToEPiAt, sentToNpAt, publishedAt, firstPublishedAt }) {
  if (publishedAt && publishedAt > Date.now()) {
    return 'Schemalagd';
  }

  if (firstPublishedAt) {
    return 'Publicerad';
  }

  if (sentToEPiAt && sentToEPiAt > (sentToNpAt || 0)) {
    return 'EPi';
  }

  if (sentToNpAt && sentToNpAt > (sentToEPiAt || 0)) {
    return 'Newspilot';
  }

  return 'Utkast';
}

const ArticleStatusBadge = ({ article, className }) => {
  const articleStatus = getStatusFrom(article);
  const classes = classnames(className, {
    'article-status-badge--published': articleStatus === 'Publicerad',
    'article-status-badge--scheduled': articleStatus === 'Schemalagd',
  });

  return (
    <Badge className={classes} icon={getBadgeIcon(articleStatus)}>
      {articleStatus}
    </Badge>
  );
};

ArticleStatusBadge.propTypes = {
  className: PropTypes.string,
  article: PropTypes.shape({
    publishedAt: PropTypes.number,
    firstPublishedAt: PropTypes.number,
    sentToEPiAt: PropTypes.number,
    sentToNpAt: PropTypes.number,
  }).isRequired,
};

ArticleStatusBadge.defaultProps = {
  className: '',
};

export default ArticleStatusBadge;
