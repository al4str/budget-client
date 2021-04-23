import propTypes from 'prop-types';
import cn from 'classnames';
import { sumFormat } from '@/libs/sum';
import FieldLabel from '@/components/ui/fields/Label';
import FieldNumber from '@/components/ui/fields/Number';
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
  const displaySum = isExpense
    ? sumFormat(-1 * sum, { style: 'currency' })
    : sumFormat(sum, { style: 'currency' });

  return (
    <FieldLabel
      className={cn(s.step, className)}
      description={displaySum}
    >
      <FieldNumber
        wrapperClassName={s.fieldWrapper}
        className={s.field}
        placeholder="0,00"
        min={0}
        max={999999999.99}
        step={1}
        maxLength={14}
        value={sum}
        onChange={onSumChange}
      />
    </FieldLabel>
  );
}

export default TransactionStepSum;
