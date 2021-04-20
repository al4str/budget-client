import propTypes from 'prop-types';
import cn from 'classnames';
import { dateGetNow, dateGetObjFromISO } from '@/libs/date';
import FieldLabel from '@/components/ui/fields/Label';
import FieldsDate from '@/components/ui/fields/Date';
import s from './styles.scss';

TransactionStepDate.propTypes = {
  className: propTypes.string,
  date: propTypes.string,
  onDateChange: propTypes.func,
};

TransactionStepDate.defaultProps = {
  className: '',
  date: '',
  onDateChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.date
 * @param {function(string): void} props.onDateChange
 * */
function TransactionStepDate(props) {
  const {
    className,
    date,
    onDateChange,
  } = props;
  const maxDate = dateGetNow().plus({ day: 1 }).toISODate();

  return (
    <FieldLabel
      className={cn(s.step, className)}
      description={dateGetObjFromISO(date).toFormat('dd.LL.yyyy')}
    >
      <FieldsDate
        className={s.field}
        maxDate={maxDate}
        value={date}
        onChange={onDateChange}
      />
    </FieldLabel>
  );
}

export default TransactionStepDate;
