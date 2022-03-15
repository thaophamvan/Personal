import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { formatDateTime } from '../../utilities';

const propTypes = {
  items: React.PropTypes.arrayOf(PropTypes.shape({
    Id: PropTypes.number,
    Alias: PropTypes.string,
    LastVisit: PropTypes.string,
  })),
  onClick: PropTypes.func,
};

const defaultProps = {
  items: [],
  onClick: () => { },
};

const TableSettings = ({ items, onClick }) => (
  <table className="user-favorites__table">
    <tbody>
      {
        [...items].map((item, i) => (
          <tr key={item.Id}>
            <td className="name">
              <Link
                to={`/user/${item.Id}`}
                className="user profile"
              >
                {item.Alias}
              </Link>
            </td>
            <td>{formatDateTime(item.LastVisit, 'YYYY-MM-DD HH:mm:ss')}</td>
            <td>
              <a
                className="user"
                role="button"
                tabIndex="-1"
                onClick={() => onClick(item.Id)}
                title="Ta bort användare som favorit"
              >Radera</a>
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>
);

TableSettings.propTypes = propTypes;
TableSettings.defaultProps = defaultProps;

export default TableSettings;
