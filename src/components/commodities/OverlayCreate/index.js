import propTypes from 'prop-types';
import { useI18nTranslations } from '@/hooks/useI18n';
import Overlay from '@/components/overlays/Overlay';
import OverlayHeader from '@/components/overlays/Header';
import OverlayBody from '@/components/overlays/Body';
import CommoditiesFormCreate from '@/components/commodities/FormCreate';
import s from './styles.scss';

CommoditiesOverlayCreate.propTypes = {
  opened: propTypes.bool,
  onClose: propTypes.func,
  categoryId: propTypes.string,
  onCreate: propTypes.func,
};

CommoditiesOverlayCreate.defaultProps = {
  opened: false,
  onClose: null,
  categoryId: '',
  onCreate: null,
};

/**
 * @param {Object} props
 * @param {boolean} props.opened
 * @param {Function} props.onClose
 * @param {string} props.categoryId
 * @param {Function} props.onCreate
 * */
function CommoditiesOverlayCreate(props) {
  const {
    opened,
    onClose,
    categoryId,
    onCreate,
  } = props;
  const { title } = useI18nTranslations({
    title: 'titles.commodity-create',
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
        <CommoditiesFormCreate
          categoryId={categoryId}
          onCreate={onCreate}
        />
      </OverlayBody>
    </Overlay>
  );
}

export default CommoditiesOverlayCreate;
