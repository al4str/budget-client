import propTypes from 'prop-types';
import TransactionOverlay from '@/components/transaction/Overlay';

TransactionPage.propTypes = {
  match: propTypes.object,
};

TransactionPage.defaultProps = {
  match: {},
};

/** @param {{ match: { params: { type: TransactionType } } }} props */
function TransactionPage(props) {
  const { match: { params: { type } } } = props;

  return (
    <TransactionOverlay type={type} />
  );
}

export default TransactionPage;
