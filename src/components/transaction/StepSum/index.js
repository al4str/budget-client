import { useRef, useState, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { sumFormat } from '@/libs/sum';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import s from './styles.scss';

TransactionStepSum.propTypes = {
  className: propTypes.string,
  type: propTypes.string,
  sum: propTypes.number,
  onSumChange: propTypes.func,
};

TransactionStepSum.defaultProps = {
  className: '',
  type: '',
  sum: 0.00,
  onSumChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {TransactionType} props.type
 * @param {number} props.sum
 * @param {function(number): void} props.onSumChange
 * */
function TransactionStepSum(props) {
  const {
    className,
    type,
    sum,
    onSumChange,
  } = props;
  const isExpense = type === 'expense';
  /** @type {React.RefObject<HTMLInputElement>} */
  const fieldRef = useRef(null);
  const [value, setValue] = useState(sumFormat(sum, { sign: 'never' }));
  const displaySum = isExpense
    ? sumFormat(-1 * sum, { style: 'currency' })
    : sumFormat(sum, { style: 'currency' });

  const handleChange = useCallback((nextValue) => {
    const sanitized = parseFloat(nextValue
      .replace(/[^0-9.,]/g, '')
      .replace(/[.,]/g, '.')) || 0.00;
    setValue(nextValue);
    onSumChange(sanitized);
  }, [
    onSumChange,
  ]);

  useEffect(() => {
    setTimeout(() => {
      fieldRef.current.select();
    }, 0);
  }, []);

  return (
    <FieldLabel
      className={cn(s.step, className)}
      description={displaySum}
    >
      <FieldText
        className={s.field}
        ref={fieldRef}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        maxLength={14}
        value={value}
        onChange={handleChange}
      />
    </FieldLabel>
  );
}

export default TransactionStepSum;
