/* eslint-disable */
import { DateTime } from 'luxon';
import React from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import Modal from '~/components/Shared/Modals/Modal';
import ModalHeader from '~/components/Shared/Modals/Header';
import ModalBody from '~/components/Shared/Modals/Body';
import ModalActions from '~/components/Shared/Modals/Actions';
import DayPicker from '~/components/Shared/Utils/Calendars/DayPicker';
import s from './styles.scss';

DateRangeSelector.propTypes = {
  title: propTypes.string,
  value: propTypes.array,
  onClose: propTypes.func,
  onSubmit: propTypes.func,
};

DateRangeSelector.defaultProps = {
  title: 'Date range selector',
  value: ['', ''],
  onClose: null,
  onSubmit: null,
};

function DateRangeSelector(props) {
  const {
    title,
    value,
    onClose,
    onSubmit,
  } = props;
  const [
    leftValue = '',
    rightValue = '',
  ] = value;
  const [leftDatetime, setLeftDatetime] = React.useState(() => {
    return leftValue
      ? DateTime.fromSeconds(+leftValue)
      : DateTime
        .local()
        .startOf('day')
        .minus({ day: 1 });
  });
  const [rightDatetime, setRightDatetime] = React.useState(() => {
    return rightValue
      ? DateTime.fromSeconds(+rightValue)
      : DateTime
        .local()
        .endOf('day')
        .minus({ seconds: 1 })
        .plus({ day: 1 });
  });

  const handleLeftChange = React.useCallback((nextValue) => {
    setLeftDatetime((prevValue) => prevValue
      .set(nextValue)
      .startOf('day'));
  }, []);
  const handleRightChange = React.useCallback((nextValue) => {
    setRightDatetime((prevValue) => prevValue
      .set(nextValue)
      .endOf('day')
      .minus({ seconds: 1 }));
  }, []);
  const handleClose = React.useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [
    onClose,
  ]);
  const handleReset = React.useCallback(() => {
    if (typeof onSubmit === 'function') {
      onSubmit(['', '']);
    }
    handleClose();
  }, [
    onSubmit,
    handleClose,
  ]);
  const handleSubmit = React.useCallback(() => {
    if (typeof onSubmit === 'function') {
      const leftSeconds = leftDatetime && leftDatetime.isValid
        ? Math.round(leftDatetime.toSeconds()).toString()
        : '';
      const rightSeconds = rightDatetime && rightDatetime.isValid
        ? Math.round(rightDatetime.toSeconds()).toString()
        : '';
      onSubmit([leftSeconds, rightSeconds]);
    }
    handleClose();
  }, [
    onSubmit,
    leftDatetime,
    rightDatetime,
    handleClose,
  ]);

  const formattedLeftValue = React.useMemo(() => {
    return leftDatetime && leftDatetime.isValid
      ? leftDatetime.toFormat('DD')
      : '';
  }, [
    leftDatetime,
  ]);
  const formattedRightValue = React.useMemo(() => {
    return rightDatetime && rightDatetime.isValid
      ? rightDatetime.toFormat('DD')
      : '';
  }, [
    rightDatetime,
  ]);
  const leftMaxDatetime = React.useMemo(() => {
    return rightDatetime || null;
  }, [
    rightDatetime,
  ]);
  const rightMinDatetime = React.useMemo(() => {
    return leftDatetime || null;
  }, [
    leftDatetime,
  ]);
  const actions = React.useMemo(() => {
    return [
      {
        key: 'accept',
        className: s.submitBtn,
        theme: 'yellow',
        label: 'Apply',
        onClick: handleSubmit,
      },
      {
        key: 'reset',
        className: s.resetBtn,
        theme: 'lightgray',
        label: 'Reset',
        onClick: handleReset,
      },
      {
        key: 'close',
        className: s.cancelBtn,
        theme: 'lightgray',
        label: 'Close',
        onClick: handleClose,
      },
    ];
  }, [
    handleSubmit,
    handleReset,
    handleClose,
  ]);

  return (
    <Modal
      className={s.modal}
      withCloseButton={false}
      onClose={handleClose}
    >
      <ModalHeader className={s.header}>
        <span className={s.title}>
          {title}
        </span>
        <div className={s.ranges}>
          <div className={cn(s.range, s.rangeLeft)}>
            <span className={s.rangeLabel}>
              Start date
            </span>
            <span className={cn(s.rangeValue, formattedLeftValue && s.rangeValueDefined)}>
              {formattedLeftValue || 'Not defined'}
            </span>
          </div>
          <div className={cn(s.range, s.rangeRight)}>
            <span className={s.rangeLabel}>
              End date
            </span>
            <span className={cn(s.rangeValue, formattedRightValue && s.rangeValueDefined)}>
              {formattedRightValue || 'Not defined'}
            </span>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className={s.body}>
        <div className={s.pickers}>
          <DayPicker
            className={cn(s.datePicker, s.datePickerLeft)}
            theme="selector"
            year={leftDatetime.year}
            month={leftDatetime.month}
            day={leftDatetime.day}
            maxDate={leftMaxDatetime}
            onChange={handleLeftChange}
          />
          <DayPicker
            className={cn(s.datePicker, s.datePickerRight)}
            theme="selector"
            year={rightDatetime.year}
            month={rightDatetime.month}
            day={rightDatetime.day}
            minDate={rightMinDatetime}
            onChange={handleRightChange}
          />
        </div>
        <ModalActions
          className={s.actions}
          actions={actions}
        />
      </ModalBody>
    </Modal>
  );
}

export default DateRangeSelector;
