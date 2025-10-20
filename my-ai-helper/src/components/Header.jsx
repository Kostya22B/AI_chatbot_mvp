import { LocaleProvider, useLocale, LocaleToggleButton } from '../locale/LocaleSwitcher';

const Header = () => {
  const { t } = useLocale();
  return (
    <header className="p-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold">{t('app.title')}</h1>
      <div className="flex items-center gap-2">
        <LocaleToggleButton />
      </div>
    </header>
  );
};
export default Header;