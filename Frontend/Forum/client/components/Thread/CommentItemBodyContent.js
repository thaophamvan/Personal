import React from 'react';
import PropTypes from 'prop-types';

import { IfComponent } from '../share';
import CiteCommentBody from './CiteCommentBody';

import { linkify, removeEmptyParagraphs } from '../../utilities';

const propTypes = {
  Body: PropTypes.string,
  DeletionStatus: PropTypes.number,
  Subject: PropTypes.string,
  ignoredUser: PropTypes.bool,
  thread: PropTypes.shape({}),
  ignoredMenuState: PropTypes.bool,
};

const defaultProps = {
  Body: '',
  DeletionStatus: 0,
  Subject: '',
  ignoredUser: false,
  thread: {},
  ignoredMenuState: false,
};


const CommentItemBodyContent = ({ Body, DeletionStatus, Subject, ignoredUser,
  thread, ignoredMenuState }) => {
  const bodyContent = linkify(removeEmptyParagraphs(Body));

  const isDeleted = DeletionStatus !== 0;
  const showSubject = (Subject !== '' && Subject !== thread.Subject) && !isDeleted;

  let bodyClassName = 'bodyText bn_thread-comment__body';

  if (isDeleted) {
    bodyClassName = 'bn_thread-comment__body-delete';
  } else if (ignoredUser) {
    const ignoredClass = !ignoredMenuState ? 'hideText' : '';
    bodyClassName = `ignored bodyText bn_thread-comment__body-ignored ${ignoredClass}`;
  }

  return (
    <div className="bn_thread-comment__text">
      <IfComponent
        condition={isDeleted}
        whenTrue={
          <CiteCommentBody text="Kommentaren har tagits bort av webmaster." className="bn_thread-comment__body" />
        }
        whenFalse={null}
      />
      <IfComponent
        condition={ignoredUser}
        whenTrue={
          <CiteCommentBody text="Ignorerat inlägg." className="bodyText" />
        }
        whenFalse={null}
      />
      <div className={bodyClassName}>
        <IfComponent
          condition={showSubject}
          whenTrue={
            <p><strong>{Subject}</strong></p>
          }
          whenFalse={null}
        />
        <div
          className="bn_thread-comment__body-html"
          dangerouslySetInnerHTML={{
            __html: bodyContent,
          }}
        />
      </div>
    </div>
  );
};

CommentItemBodyContent.propTypes = propTypes;
CommentItemBodyContent.defaultProps = defaultProps;

export default CommentItemBodyContent;
