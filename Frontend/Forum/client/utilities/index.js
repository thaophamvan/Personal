import { find, sortBy, slice, filter } from "lodash/core";
import reverse from "lodash/reverse";
import pathToRegexp from "path-to-regexp";
import moment from "moment";

moment.locale("sv");

function findMenuWithFallBack(menuItems, menuName, previousValue, defaultValue) {
  const firstMatch = find(menuItems, { menuName });

  if (firstMatch) {
    return firstMatch.menuName;
  }

  if (previousValue) {
    return previousValue;
  }

  return defaultValue;
}

export function computeUserId(location) {
  const matches = pathToRegexp("/user/:userId?").exec(location.pathname);
  return matches[1];
}

export function computeUserSetting(location) {
  const matches = pathToRegexp("/usersettings/:setting?").exec(location.pathname);
  return matches[1];
}

export function computeForumName(location) {
  const matches = pathToRegexp("/newthread/:forum?").exec(location.pathname);
  return matches[1];
}

export function computeSearchQuery(search) {
  const matches = pathToRegexp("?query=:query?").exec(search);
  return matches && matches[1] ? matches[1] : "";
}

export function computeSelectedForum(menuItems, location, previousSelection) {
  const matches = pathToRegexp("/:forumId?/:threadId?").exec(location.pathname);

  const defaultMenu = find(menuItems, { isDefault: true });
  const defaultMenuName = defaultMenu ? defaultMenu.menuName : "";
  if (!matches[1]) {
    return defaultMenuName;
  }

  return findMenuWithFallBack(menuItems, matches[1], previousSelection, defaultMenuName);
}

export function computeSelectedMenu(menuItems, location, staticMenuItems, previousSelection) {
  const matches = pathToRegexp("/:firstLevel?/:secondLevel?").exec(location.pathname);
  const menuMatch = matches[1] || "";
  const menuName = menuMatch.indexOf("?") > -1 ? menuMatch.substr(0, menuMatch.indexOf("?")) : menuMatch;
  if (staticMenuItems && staticMenuItems.indexOf(menuName) > -1) {
    return /newthread/i.test(matches[1]) ? matches[2] : matches[1];
  }

  return computeSelectedForum(menuItems, location, previousSelection);
}

export function extractThreadIdFromUrl(location, notForumPaths) {
  const matches = pathToRegexp("/:forumId?/:threadId?").exec(location.pathname);
  const forumId = matches[1];
  const isValidForum = !notForumPaths || notForumPaths.indexOf(forumId) === -1;
  const threadMatch = matches[2];

  if (!threadMatch) {
    return null;
  }

  const threadId = threadMatch.indexOf("?") > -1 ? threadMatch.substr(0, threadMatch.indexOf("?")) : threadMatch;
  return isValidForum ? threadId : null;
}

export function computeSelectedThread(threads, threadIdInUrl, previousThreadId) {
  const firstThreadId = threads && threads.length ? threads[0].ThreadId : 0;

  if (!threadIdInUrl) {
    return previousThreadId || firstThreadId;
  }

  return +threadIdInUrl;
}

export function scrollTop() {
  window.scrollTo(0, 0);
}

export function convertHashLocation(hashLocation) {
  let pathname = hashLocation.hash.replace("#", "");
  let search = "";

  if (pathname.indexOf("?") > -1) {
    const searchIndex = pathname.indexOf("?");
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname,
    search,
  };
}

export function getForumLink(menuId, menuItems, remainMenuPart) {
  const forum = find(menuItems, { menuId });
  if (forum) {
    return !remainMenuPart && forum.isDefault ? "" : forum.menuName;
  }

  return "";
}

export function getForumId(menuName, menuItems) {
  const forum = find(menuItems, { menuName });
  return forum ? forum.menuId : -1;
}

export function formatDateTime(date, formatString) {
  return moment(date).format(formatString);
}

export function formatCalendar(date) {
  return date ? moment(date).calendar() : "";
}

export function dateToString(date) {
  const dateDayPart = moment(date).startOf("day");
  if (moment().startOf("day").diff(dateDayPart) === 0) {
    return moment(date).format("HH:mm");
  }
  const yesterday = moment().subtract(1, "day").startOf("day");
  if (yesterday.diff(dateDayPart) === 0) {
    return "igår";
  }
  if (yesterday > dateDayPart && yesterday.format("YYYY") === dateDayPart.format("YYYY")) {
    return moment(date).format("DD/M");
  }
  return moment(date).format("DD/M/YY");
}

export function validateAuthentication(credentials) {
  return credentials != null && credentials.ServicePlusToken != null && credentials.ServicePlusToken.trim() !== "";
}

export function validateAuthorization(credentials) {
  return validateAuthentication(credentials) && credentials.UserId !== 0 && credentials.UserId !== null;
}

export function sortAscending(arr, field) {
  return sortBy(arr, field);
}

export function sortDescending(arr, field) {
  return reverse(sortAscending(arr, field));
}

export function isAdminRole(credentials) {
  return credentials.Roles.indexOf("admin") > -1;
}

export function computeEditPermissionForThread(credentials, thread) {
  const isAdmin = isAdminRole(credentials);
  if (isAdmin) {
    return true;
  }
  const isAuthorized = validateAuthorization(credentials);
  if (!isAuthorized) {
    return false;
  }

  const isTimeValid = moment().subtract({ minutes: 60 }).isBefore(moment(thread.CreateDate));
  return thread.UserId === credentials.UserId && isTimeValid;
}

export function computeEditPermissionForComment(credentials, comment) {
  const isAdmin = isAdminRole(credentials);
  if (isAdmin) {
    return true;
  }
  const isAuthorized = validateAuthorization(credentials);
  if (!isAuthorized) {
    return false;
  }

  const isTimeValid = moment().subtract({ minutes: 60 }).isBefore(moment(comment.CreateDate));
  return comment.UserId === credentials.UserId && isTimeValid;
}

export function pagingItems(items, page, pageSize) {
  if (items.length < pageSize) {
    return items;
  }
  const total = items.length;
  const computedPageSize = pageSize || 10;
  const ignored = (page - 1) * computedPageSize;
  if (ignored > total) {
    return [];
  }
  const end = ignored + computedPageSize > total ? total : ignored + computedPageSize;
  return slice(items, ignored, ignored + pageSize, end);
}

export function getCommentsByReplyNo(items, ReplyNo) {
  return filter(items, { ReplyNo });
}

export function cutCommentsAt(items, cutAt) {
  if (cutAt > 0) {
    return filter(items, (comment) => comment.LatestReply > cutAt);
  }
  return items;
}

export function showMoreItems(items, page, pageSize) {
  if (items.length < pageSize) {
    return items;
  }
  const total = items.length;
  const computedPageSize = pageSize || 10;
  const take = page * computedPageSize > total ? total : page * computedPageSize;
  const skip = (page - 1) * computedPageSize;
  return slice(items, skip, take);
}

export function getRemainingItems(items, firstItems, lastItemLength) {
  const firstItemsCount = firstItems.length;
  return slice(items, firstItemsCount, items.length - lastItemLength);
}

export function willScroll(element, availableHeight) {
  const rect = element.getBoundingClientRect();
  const bounding = element.offsetTop;
  return rect.top < 0 && rect.top <= -bounding;
}

export function getScrollY() {
  return window.scrollY || window.pageYOffset || document.documentElement.scrollTop >> 0;
}

export function getScrollPosition(element) {
  const rect = element.getBoundingClientRect();
  return getScrollY() + rect.top;
}

export function getForumOptions(menuItems, selectedForum) {
  const filteredMenuItems = filter(menuItems, (menuItem) => menuItem.menuName !== selectedForum);
  return filteredMenuItems.map((menuItem) => ({
    text: menuItem.name,
    value: menuItem.menuId.toString(),
  }));
}

function getTargetLinkByLink(link) {
  return link.match(/personal/i) ? "_top" : "_blank";
}

// Convert http://... in text to links
function convertTextToLinks(content) {
  // https://github.com/urbanhire/text-to-link
  const pattern =
    "(^|[\\s\\n]|<[A-Za-z]*/?>)" +
    "((?:https?|ftp)://[\\-A-Z0-9+\\u0026\\u2019;@#/%?=()~_|!:,.]*[\\-A-Z0-9+\\u0026@#/%=~()_|])";
  return content.replace(new RegExp(pattern, "gi"), ($0, $1, $2) => {
    const link = $2.replace(/&nbsp;/g, "");
    const target = getTargetLinkByLink(link);
    const rel = target === "_blank" ? 'rel="nofollow"' : "";
    return `${$1}<a href="${link}" target="${target}" ${rel}>${link}</a>`;
  });
}

function applyTargetLink(content) {
  const division = document.createElement("div");
  division.innerHTML = content;
  const links = division.getElementsByTagName("a");
  for (let i = 0; i < links.length; i += 1) {
    const link = links[i];
    if (link.href !== "") {
      const target = getTargetLinkByLink(link.href);
      link.target = target;
      if (target === "_blank") {
        link.rel = "nofollow";
      }
    }
  }
  return division.innerHTML;
}

function checkAndFixSingleNode(content) {
  const paragraphs = content
    // replace br outside paragraph
    .replace(/<\/p>(\s+)?(<br\s*\/?>)+(\s+)?<p(.*?)>/gi, `</p><p$4>`)
    //more than 3 br next sibling to 2 br
    .replace(/(<br\s*\/?>){3,}/gi, "<br/><br/>")
    //br next sibling p then remove it
    .replace(/<p(.*?)>(<br\s*\/?>)+/gi, "<p$1>")
    // split by paragraph to correct
    .split(/(?=<p)/i);

  const res = [];
  let regexMatch;
  paragraphs.forEach((paragraph) => {
    regexMatch = paragraph.match(/(<p.*?>(.*)<\/p>)(.*)/);
    if (regexMatch) {
      if (regexMatch[3] !== "") {
        //append paragraph
        res.push(regexMatch[1]);
        //append content outside paragraph
        res.push(`<p>${regexMatch[3]}</p>`);
      } else {
        res.push(paragraph);
      }
    } else {
      //append content outside paragraph
      res.push(`<p>${paragraph}</p>`);
    }
  });
  return res.join("");
}

export function linkify(inputText) {
  return convertTextToLinks(applyTargetLink(inputText));
}

export function shortenList(list, start, end) {
  const computedEnd = end < list.length ? end : list.length;
  return slice(list, start, computedEnd);
}

export function userInArray(favoriteUsers, userId) {
  if (favoriteUsers) {
    const item = find(favoriteUsers, { Id: userId });
    return typeof item !== "undefined";
  }
  return false;
}

export function isNotEmptyHtml(html) {
  return html !== "" && html !== "<p></p>" && html !== "<p><br/></p>" && html !== "<p><br></p>";
}

export function setCookie(cookieName, value, expDays) {
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + expDays);
  const cookieValue = `${escape(value) + (expDays == null ? "" : `; expires=${expDate.toUTCString()}`)};path=/`;
  document.cookie = `${cookieName}=${cookieValue}`;
}

export function getCookie(name) {
  const pattern = `(?:; )?${name}=([^;]*);?`;
  const regexp = new RegExp(pattern);
  if (regexp.test(document.cookie)) {
    return decodeURIComponent(RegExp.$1);
  }
  return false;
}

export function getShareLink(subjectThread, linkThread) {
  const link = encodeURIComponent(linkThread || window.location.href);
  const subject = encodeURIComponent(subjectThread);
  const fbAppId = window.personalSettings ? window.personalSettings.FacebookShareAppId || "" : "";
  const shareLink = {
    email:
      `mailto:?subject=Delat från Börssnack: ${subject}` +
      `&body=Hej.%0D%0AHär är en intressant tråd på Börssnack:%0D%0A${link}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${link}&title=${subject}`,
    twitter: `https://twitter.com/intent/tweet?text=${subject} ${link}`,
    facebook: `https://www.facebook.com/dialog/share?app_id=${fbAppId}&display=popup&href=${link}&redirect_uri=${link}`,
  };
  return shareLink;
}

function getParagraphContent(paragraph) {
  return paragraph.innerText.replace(/\s|&nbsp;/g, "").trim();
}

function removeEmptyBySelector(elt, selector) {
  let node;
  let i = 0;
  // take 1 by selector and remove
  while ((node = elt.querySelector(selector))) {
    const content = getParagraphContent(node);
    if (content === "") {
      node.parentNode.removeChild(node);
    } else {
      break;
    }

    // limit i<30 then break to safe while
    if (i < 30) {
      i += 1;
    } else {
      break;
    }
  }
}

export function removeEmptyParagraphs(content) {
  const division = document.createElement("div");
  division.innerHTML = checkAndFixSingleNode(content);
  const paragraphs = division.getElementsByTagName("p");
  // js: remove into for-loop must reverse
  for (let i = paragraphs.length - 1; i > -1; i -= 1) {
    const paragraph = paragraphs[i];
    const pContent = getParagraphContent(paragraph);
    if (pContent === "") {
      paragraph.parentNode.removeChild(paragraph);
    }
  }
  return division.innerHTML;
}

export function removeFirstLastEmptyParagraphs(content) {
  const division = document.createElement("div");
  division.innerHTML = checkAndFixSingleNode(content);
  try {
    removeEmptyBySelector(division, "p:first-child");
    removeEmptyBySelector(division, "p:last-child");
  } catch (err) {
    /* eslint-disable */
    if (console && console.log) {
      console.log(err);
    }
  }
  return division.innerHTML;
}

export function detectBrowser() {
  const browsers = {};
  const htmlTag = document.getElementsByTagName("html")[0];
  // Opera 8.0+
  browsers.opera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
  // Firefox 1.0+
  browsers.firefox = navigator.userAgent.match(/Firefox\/([0-9]+)\./);
  // At least Safari 3+: "[object HTMLElementConstructor]"
  browsers.safari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
  // Internet Explorer 6-11
  browsers.ie = /* @cc_on!@ */ false || !!document.documentMode;
  // Edge 20+
  browsers.edge = !browsers.ie && !!window.StyleMedia;
  // Chrome 1+
  browsers.chrome = !!window.chrome && !!window.chrome.webstore;

  Object.keys(browsers).forEach((key) => {
    htmlTag.classList.add(browsers[key] ? key : `not-${key}`);
  });
  if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
    htmlTag.classList.add("bn_mac-os");
  }
}
