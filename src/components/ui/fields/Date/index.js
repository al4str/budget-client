import { useState, useMemo, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import {
  dateGetObjFromISO,
  datesIsDayDisabled,
  datesDaysOf,
  datesMonths,
  datesWeekdays,
} from '@/libs/date';
import IconArrowLeft from '@/components/icons/IconArrowLeft';
import Action from '@/components/ui/Action';
import btn from '@/styles/button.scss';
import s from './styles.scss';

FieldsDate.propTypes = {
  className: propTypes.string,
  minDate: propTypes.string,
  maxDate: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
};

FieldsDate.defaultProps = {
  className: '',
  minDate: '',
  maxDate: '',
  value: '',
  onChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.minDate
 * @param {string} props.maxDate
 * @param {string} props.value
 * @param {function(string): void} props.onChange
 * */
function FieldsDate(props) {
  const {
    className,
    minDate,
    maxDate,
    value,
    onChange,
  } = props;
  const selectedDateObj = dateGetObjFromISO(value);
  const [dateObj, setDateObj] = useState(selectedDateObj);
  const { year: dateYear, month: dateMonth } = dateObj;

  /**
   * @type {Array<{
   *   key: string
   *   label: string
   * }>}
   * */
  const weekdays = useMemo(() => {
    return datesWeekdays().map((item, index) => ({
      key: index.toString(),
      label: item,
    }));
  }, []);
  /**
   * @type {string}
   * */
  const monthName = useMemo(() => {
    return datesMonths()[dateMonth - 1];
  }, [
    dateMonth,
  ]);

  /** @type {function(DateObj): void} */
  const handleDaySelect = useCallback((nextValue) => {
    if (typeof onChange === 'function') {
      onChange(nextValue.toISODate());
    }
  }, [
    onChange,
  ]);
  const handlePrevMonthSelect = useCallback(() => {
    setDateObj(dateObj.minus({ months: 1 }));
  }, [
    dateObj,
  ]);
  const handleNextMonthSelect = useCallback(() => {
    setDateObj(dateObj.plus({ months: 1 }));
  }, [
    dateObj,
  ]);

  /**
   * @type {Array<{
   *   key: string
   *   prev: boolean
   *   next: boolean
   *   selected: boolean
   *   disabled: boolean
   *   label: string
   *   onSelect: Function
   * }>}
   * */
  const days = useMemo(() => {
    return datesDaysOf(dateObj).map((item) => {
      const dateISO = item.dateObj.toISODate();

      return {
        key: dateISO,
        prev: item.prev,
        next: item.next,
        selected: item.dateObj.hasSame(selectedDateObj, 'day'),
        disabled: datesIsDayDisabled({
          date: dateISO,
          minDate,
          maxDate,
        }),
        label: item.dateObj.day.toString(),
        onSelect: handleDaySelect.bind(null, item.dateObj),
      };
    });
  }, [
    minDate,
    maxDate,
    selectedDateObj,
    dateObj,
    handleDaySelect,
  ]);

  return (
    <div className={cn(s.date, className)}>
      <div className={s.navigation}>
        <Action
          className={cn(s.navBtn, s.navBtnPrev)}
          onClick={handlePrevMonthSelect}
        >
          <span className={btn.wrp}>
            <IconArrowLeft className={cn(btn.icon, s.navIcon, s.navIconPrev)} />
          </span>
        </Action>
        <div className={s.currentMonth}>
          {monthName} {dateYear}
        </div>
        <Action
          className={cn(s.navBtn, s.navBtnNext)}
          onClick={handleNextMonthSelect}
        >
          <span className={btn.wrp}>
            <IconArrowLeft className={cn(btn.icon, s.navIcon, s.navIconNext)} />
          </span>
        </Action>
      </div>
      <ul className={s.weekdayList}>
        {weekdays.map((item) => (
          <li
            className={s.weekdayItem}
            key={item.key}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <ul className={s.daysList}>
        {days.map((item) => (
          <li
            className={s.daysItem}
            key={item.key}
          >
            <Action
              className={cn(
                s.day,
                item.selected && s.daySelected,
                item.disabled && s.dayDisabled,
                item.prev && s.daysPrevMonth,
                item.next && s.daysNextMonth,
              )}
              disabled={item.disabled}
              onClick={item.onSelect}
            >
              <span className={cn(btn.wrp, s.dayWrp)}>
                <span className={cn(btn.label, s.dayValue)}>
                  {item.label}
                </span>
              </span>
            </Action>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FieldsDate;
