import { DateTime, Info, Settings } from 'luxon';

/**
 * @typedef {import('luxon').DateTime} DateObj
 * */

Settings.defaultLocale = (window.navigator.languages && window.navigator.languages[0])
  || window.navigator.language;

Settings.defaultZoneName = 'local';

/**
 * @param {string} date
 * @return {DateObj}
 * */
export function dateGetObjFromISO(date) {
  return DateTime.fromISO(date);
}

/**
 * @param {Object} params
 * @param {number} [params.year]
 * @param {number} [params.month]
 * @param {number} [params.day]
 * @return {DateObj}
 * */
export function dateGetObjFromParams(params) {
  return DateTime.fromObject(params);
}

/**
 * @return {DateObj}
 * */
export function dateGetNow() {
  return DateTime.local();
}

/**
 * @param {string|number} ts
 * @return {string|undefined}
 * */
export function dateToISO(ts) {
  if (!+ts) {
    return undefined;
  }
  const date = DateTime.fromMillis(+ts);
  return date.invalid
    ? undefined
    : date.toISODate();
}

/**
 * @param {string} ts
 * @return {string}
 * */
export function dateToLocalTime(ts) {
  if (!+ts) {
    return '';
  }
  const date = DateTime.fromMillis(+ts);
  if (date.invalid) {
    return '';
  }
  return date
    .setZone('local')
    .toMillis()
    .toString();
}

/**
 * @param {Object} params
 * @param {string} params.date
 * @param {string} params.minDate
 * @param {string} params.maxDate
 * @return {boolean}
 * */
export function datesIsDayDisabled(params) {
  const { date, minDate, maxDate } = params;
  const dateObj = DateTime.fromISO(date).startOf('day');
  const minDateObj = DateTime.fromISO(minDate).startOf('day');
  const maxDateObj = DateTime.fromISO(maxDate).startOf('day');

  return (minDateObj.isValid && dateObj <= minDateObj)
    || (maxDateObj.isValid && dateObj >= maxDateObj);
}

/**
 * @param {DateObj} date
 * @return {Array<{
 *   prev: boolean
 *   next: boolean
 *   dateObj: DateObj
 * }>}
 * */
export function datesDaysOf(date) {
  const dateObj = date.startOf('month');
  const {
    year: currentYear,
    month: currentMonth,
    weekday: currentWeekday,
    daysInMonth: currentDaysInMonth,
  } = dateObj;
  const {
    year: prevYear,
    month: prevMonth,
    daysInMonth: prevDaysInMonth,
  } = dateObj.minus({ months: 1 }).startOf('month');
  const {
    year: nextYear,
    month: nextMonth,
    weekday: nextWeekday,
  } = dateObj.plus({ months: 1 }).startOf('month');

  const prevMonthDays = new Array(currentWeekday - 1)
    .fill(0)
    .map((_, index) => ({
      prev: true,
      next: false,
      dateObj: dateGetObjFromParams({
        day: (prevDaysInMonth - (currentWeekday - 1)) + (index + 1),
        month: prevMonth,
        year: prevYear,
      }),
    }));
  const currentMonthDays = new Array(currentDaysInMonth)
    .fill(0)
    .map((_, index) => ({
      prev: false,
      next: false,
      dateObj: dateGetObjFromParams({
        day: index + 1,
        month: currentMonth,
        year: currentYear,
      }),
    }));
  const nextMonthDays = new Array(7 - nextWeekday + 1)
    .fill(0)
    .map((_, index) => ({
      prev: false,
      next: true,
      dateObj: dateGetObjFromParams({
        day: index + 1,
        month: nextMonth,
        year: nextYear,
      }),
    }));

  return [
    ...prevMonthDays,
    ...currentMonthDays,
    ...nextMonthDays,
  ];
}

/**
 * @return {Array<string>}
 * */
export function datesWeekdays() {
  return Info.weekdays('short');
}

/**
 * @return {Array<string>}
 * */
export function datesMonths() {
  return Info.months();
}
