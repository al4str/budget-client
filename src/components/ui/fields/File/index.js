import { useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { filesGetHumanSize } from '@/libs/files';
import IconUpload from '@/components/icons/IconUpload';
import IconDelete from '@/components/icons/IconDelete';
import Action from '@/components/ui/Action';
import FieldFileInput from '@/components/ui/fields/File/Input';
import FieldFileDropZone from '@/components/ui/fields/File/DropZone';
import btn from '@/styles/button.scss';
import s from './styles.scss';

FieldFile.propTypes = {
  className: propTypes.string,
  disabled: propTypes.bool,
  pending: propTypes.bool,
  failed: propTypes.bool,
  value: propTypes.instanceOf(window.File),
  onChange: propTypes.func,
};

FieldFile.defaultProps = {
  className: '',
  disabled: false,
  pending: false,
  failed: false,
  value: null,
  onChange: null,
};

/**
 * @param {Object} props
 * @param {File} props.value
 * */
function FieldFile(props) {
  const {
    className,
    disabled,
    pending,
    failed,
    value,
    onChange,
  } = props;
  const selected = value instanceof window.File && value.size > 0;

  const handleChange = useCallback((nextValue) => {
    if (typeof onChange === 'function') {
      onChange(nextValue);
    }
  }, [
    onChange,
  ]);
  /** @type {function(Array<File>)} */
  const handleSelect = useCallback((files) => {
    const [file] = files;
    if (file) {
      handleChange(file);
    }
  }, [
    handleChange,
  ]);
  const handleDelete = useCallback(() => {
    handleChange(null);
  }, [
    handleChange,
  ]);

  return (
    <div className={cn(s.uploader, failed && s.failed, className)}>
      {!selected
      && <div className={s.select}>
        <FieldFileInput
          className={s.field}
          disabled={disabled || pending}
          multiple={false}
          onSelect={handleSelect}
        />
        <div className={btn.wrp}>
          <IconUpload className={cn(btn.icon, s.icon, s.iconLarge)} />
        </div>
      </div>}
      {selected
      && <div className={s.file}>
        <div className={s.fileMeta}>
          <span
            className={s.fileName}
            title={value.name}
          >
            {value.name}
          </span>
          <span className={s.fileSize}>
            {filesGetHumanSize(value)}
          </span>
        </div>
        <Action
          className={s.deleteBtn}
          onClick={handleDelete}
        >
          <span className={btn.wrp}>
            <IconDelete className={cn(btn.icon, s.icon)} />
          </span>
        </Action>
      </div>}
      <FieldFileDropZone
        className={s.dropZone}
        disabled={disabled || pending}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default FieldFile;
