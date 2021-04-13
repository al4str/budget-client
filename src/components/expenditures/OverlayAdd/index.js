import { useCallback } from 'react';
import propTypes from 'prop-types';
import Overlay from '@/components/overlays/Overlay';
import OverlayHeader from '@/components/overlays/Header';
import OverlayBody from '@/components/overlays/Body';
import ExpendituresFormAdd
  from '@/components/expenditures/FormAdd';
import s from './styles.scss';

ExpendituresOverlayAdd.propTypes = {
  expenditure: propTypes.object,
  onClose: propTypes.func,
  onAdd: propTypes.func,
};

ExpendituresOverlayAdd.defaultProps = {
  expenditure: null,
  onClose: null,
  onAdd: null,
};

/**
 * @param {Object} props
 * @param {null|ExpenditureItem & { title: string }} props.expenditure
 * @param {Function} props.onClose
 * @param {Function} props.onAdd
 * */
function ExpendituresOverlayAdd(props) {
  const {
    onClose,
    onAdd,
  } = props;
  const opened = props.expenditure !== null;
  const { title, ...expenditure } = props.expenditure || { title: '' };

  /** @type {function({ amount: number, essential: boolean }): void} */
  const handleAdd = useCallback(({ amount, essential }) => {
    onAdd({
      ...expenditure,
      amount,
      essential,
    });
  }, [
    expenditure,
    onAdd,
  ]);

  return (
    <Overlay
      opened={opened}
      onClose={onClose}
    >
      <OverlayHeader
        title={title}
        onClose={onClose}
      />
      <OverlayBody className={s.body}>
        <ExpendituresFormAdd
          initialAmount={expenditure.amount}
          initialEssential={expenditure.essential}
          onAdd={handleAdd}
        />
      </OverlayBody>
    </Overlay>
  );
}

export default ExpendituresOverlayAdd;
