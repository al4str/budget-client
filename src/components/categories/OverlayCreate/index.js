import propTypes from 'prop-types';
import { useI18nTranslations } from '@/hooks/useI18n';
import Overlay from '@/components/overlays/Overlay';
import OverlayHeader from '@/components/overlays/Header';
import OverlayBody from '@/components/overlays/Body';
import CategoriesFormCreate from '@/components/categories/FormCreate';
import s from './styles.scss';

CategoriesOverlayCreate.propTypes = {
  opened: propTypes.bool,
  onClose: propTypes.func,
  type: propTypes.string,
  onCreate: propTypes.func,
};

CategoriesOverlayCreate.defaultProps = {
  opened: false,
  onClose: null,
  type: '',
  onCreate: null,
};

/**
 * @param {Object} props
 * @param {boolean} props.opened
 * @param {Function} props.onClose
 * @param {TransactionType} props.type
 * @param {function(CategoryItem): void} props.onCreate
 * */
function CategoriesOverlayCreate(props) {
  const {
    opened,
    onClose,
    type,
    onCreate,
  } = props;
  const { title } = useI18nTranslations({
    title: 'titles.category-create',
  });

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
        <CategoriesFormCreate
          type={type}
          onCreate={onCreate}
        />
      </OverlayBody>
    </Overlay>
  );
}

export default CategoriesOverlayCreate;
