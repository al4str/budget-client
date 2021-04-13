import { useRef, useState, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { sumFormat } from '@/libs/sum';
import FieldLabel from '@/components/ui/fields/Label';
import FieldText from '@/components/ui/fields/Text';
import s from './styles.scss';

CreateStepSum.propTypes = {
  className: propTypes.string,
  categoryType: propTypes.oneOf([
    'income',
    'expense',
  ]),
  sum: propTypes.number,
  onSumChange: propTypes.func,
};

CreateStepSum.defaultProps = {
  className: '',
  categoryType: 'expense',
  sum: 0.00,
  onSumChange: null,
};

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {CategoryType} props.categoryType
 * @param {number} props.sum
 * @param {function(number): void} props.onSumChange
 * */
function CreateStepSum(props) {
  const {
    className,
    categoryType,
    sum,
    onSumChange,
  } = props;
  /** @type {React.RefObject<HTMLInputElement>} */
  const fieldRef = useRef(null);
  const [value, setValue] = useState(sumFormat(sum, 'decimal'));
  const displaySum = categoryType === 'income'
    ? sumFormat(sum, 'currency')
    : sumFormat(-1 * sum, 'currency');

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
      fieldRef.current.focus();
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
        inputMode="numeric"
        autoComplete="off"
        placeholder="0,00"
        maxLength={14}
        value={value}
        onChange={handleChange}
      />
    </FieldLabel>
  );
}

export default CreateStepSum;
