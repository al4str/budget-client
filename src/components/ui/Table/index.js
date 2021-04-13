import { useState, useCallback, useMemo } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import Action from '@/components/ui/Action';
import btn from '@/styles/button.scss';
import s from './styles.scss';

Table.propTypes = {
  className: propTypes.string,
  columns: propTypes.array,
  rows: propTypes.array,
};

Table.defaultProps = {
  className: '',
  columns: [],
  rows: [],
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {Array<TableColumn>} props.columns
 * @param {Array<TableRow>} props.rows
 * */
function Table(props) {
  const {
    className,
    columns,
    rows,
  } = props;
  const [sorting, setSorting] = useState({
    name: '',
    dir: 'ASC',
    onSort: Function.prototype,
  });

  /** @type {function(TableColumn): void} */
  const handleSort = useCallback((column) => {
    setSorting((prevSorting) => ({
      name: column.name,
      dir: prevSorting.name === column.name && prevSorting.dir === 'DESC'
        ? 'ASC'
        : 'DESC',
      onSort: column.onSort,
    }));
  }, []);
  const sortedRows = useMemo(() => {
    if (typeof sorting.onSort !== 'function') {
      return rows;
    }
    if (sorting.dir === 'DESC') {
      return rows
        .slice()
        .sort((a, b) => {
          return sorting.onSort(b, a);
        });
    }
    return rows
      .slice()
      .sort(sorting.onSort);
  }, [
    rows,
    sorting,
  ]);

  return (
    <div className={cn(s.wrp, className)}>
    <table className={s.table}>
      <thead className={s.head}>
        <tr className={cn(s.row, s.rowHead)}>
          {columns.map((column) => (
            <th
              className={cn(s.cell, s.cellHead)}
              key={column.name}
            >
              <div className={cn(
                s.cellHeadWrp,
                column.cellClassName,
                column.headClassName,
              )}>
                <Action
                  className={cn(
                    s.headBtn,
                    typeof column.onSort === 'function' && s.headBtnActive,
                  )}
                  disabled={typeof column.onSort !== 'function'}
                  theme=""
                  onClick={typeof column.onSort === 'function'
                    ? handleSort.bind(null, column)
                    : null}
                >
                  <span className={cn(btn.wrp, s.headWrp)}>
                    <span className={cn(btn.label, s.headLabel)}>
                      {column.label}
                    </span>
                  </span>
                </Action>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={s.body}>
        {sortedRows.map((row, index) => (
          <tr
            className={cn(
              s.row,
              s.rowData,
            )}
            key={row.key}
          >
            {columns.map((column) => (
              <td
                className={cn(s.cell, s.cellData)}
                key={column.name}
              >
                <div className={cn(
                  s.cellDataWrp,
                  column.cellClassName,
                  column.dataClassName,
                )}>
                  {column.onRender(row, index)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/**
 * @typedef {Object} TableColumn
 * @property {string} [cellClassName]
 * @property {string} [headClassName]
 * @property {string} [dataClassName]
 * @property {string} name
 * @property {string} label
 * @property {function(a: Object, b: Object): number} [onSort]
 * @property {function(row: Object, index: number): *} onRender
 * */

/**
 * @typedef {Object} TableRow
 * @property {string} key
 * */

export default Table;
