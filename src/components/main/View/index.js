import { useState, useMemo, useCallback } from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';
import { dateGetNow, datesMonths } from '@/libs/date';
import { connectUseHook } from '@/libs/connect';
import { useSession } from '@/hooks/useSession';
import IconArrowLeft from '@/components/icons/IconArrowLeft';
import Action from '@/components/ui/Action';
import CreateMenu from '@/components/transaction/Menu';
import MainMonth from '@/components/main/Month';
import btn from '@/styles/button.scss';
import s from './styles.scss';

function useHook() {
  const { authed } = useSession();

  return {
    authed,
  };
}

MainView.propTypes = {
  authed: propTypes.bool,
  className: propTypes.string,
};

MainView.defaultProps = {
  authed: false,
  className: '',
};

function MainView(props) {
  const {
    authed,
    className,
  } = props;
  const [dateObj, setDateObj] = useState(() => {
    return dateGetNow().startOf('month');
  });

  const months = useMemo(() => {
    const prev = dateObj
      .minus({ months: 1 })
      .startOf('month');
    const next = dateObj
      .plus({ months: 1 })
      .startOf('month');

    return {
      prev: {
        month: datesMonths()[prev.month - 1],
        year: prev.year,
      },
      current: {
        month: datesMonths()[dateObj.month - 1],
        year: dateObj.year,
      },
      next: {
        month: datesMonths()[next.month - 1],
        year: next.year,
      },
    };
  }, [
    dateObj,
  ]);

  const handlePrev = useCallback(() => {
    setDateObj((prevDateObj) => prevDateObj
      .minus({ months: 1 })
      .startOf('month'));
  }, []);
  const handleNext = useCallback(() => {
    setDateObj((prevDateObj) => prevDateObj
      .plus({ months: 1 })
      .startOf('month'));
  }, []);

  if (!authed) {
    return null;
  }
  return (
    <div className={cn(s.content, className)}>
      <div className={s.nav}>
        <Action
          className={cn(s.navBtn, s.navPrev)}
          onClick={handlePrev}
        >
          <span className={cn(btn.wrp, s.navWrp)}>
            <IconArrowLeft className={cn(btn.icon, s.navIconPrev)} />
            <span className={cn(btn.label, s.navLabel)}>
              <span className={s.navMonth}>
                {months.prev.month}
              </span>
              <span className={s.navYear}>
                {months.prev.year}
              </span>
            </span>
          </span>
        </Action>
        <span className={cn(s.navWrp, s.navCurrent)}>
          <span className={cn(btn.label, s.navLabel)}>
            <span className={s.navMonth}>
              {months.current.month}
            </span>
            <span className={s.navYear}>
              {months.current.year}
            </span>
          </span>
        </span>
        <Action
          className={cn(s.navBtn, s.navNext)}
          onClick={handleNext}
        >
          <span className={cn(btn.wrp, s.navWrp)}>
            <span className={cn(btn.label, s.navLabel)}>
              <span className={s.navMonth}>
                {months.next.month}
              </span>
              <span className={s.navYear}>
                {months.next.year}
              </span>
            </span>
            <IconArrowLeft className={cn(btn.icon, s.navIconNext)} />
          </span>
        </Action>
      </div>
      <MainMonth
        className={s.month}
        date={dateObj.toISODate()}
      />
      <CreateMenu className={s.menu} />
    </div>
  );
}

export default connectUseHook(useHook)(MainView);
