import { validateAuthentication } from '../utilities';
import { subscribe } from './eventBus';

function sendIpaPush(details) {
  if (window.IPA && window.IPA.q) {
    window.IPA.q.push((ipa) => {
      ipa.page.pageview(details);
    });
  }
}

export function trackThread(state, additions) {
  const { credentials } = state.app;
  const { selectedThread } = state.leftColumn;
  const { Thread } = state.mainTopic;
  const authors = Thread ? Thread.UserAlias : null;
  const loggedin = validateAuthentication(credentials);
  const details = {
    build: 'PROD',
    hasContentAccess: 'viewaccess',
    isAutorefresh: false,
    loggedIn: loggedin,
    pageType: 'thread',
    authors,
    articleFriendlyId: selectedThread,
  };
  if (additions) {
    sendIpaPush({ ...details, ...additions });
  } else {
    sendIpaPush(details);
  }
}

export function trackUser(state) {
  const { credentials } = state.app;
  const loggedin = validateAuthentication(credentials);
  const details = {
    build: 'PRODUCTION',
    isAuthenticated: loggedin,
    isAutoSsoLogin: true,
    isManualLogin: true,
    userId: credentials ? credentials.ServicePlusToken : null,
  };
  sendIpaPush(details);
}

export default function initTracking() {
  subscribe('loadCurrentMainTopicDone', (getState) => {
    try {
      trackThread(getState());
    } catch (error) {
      console.log(error);
    }
  });

  subscribe('loadedCurrentUser', (getState) => {
    try {
      trackUser(getState());
    } catch (error) {
      console.log(error);
    }
  });

  subscribe('sharedThread', (getState, provider) => {
    try {
      trackThread(getState(), { action: `share${provider}` });
    } catch (error) {
      console.log(error);
    }
  });
}
