import Link from 'next/link';

type Language = 'en' | 'bn';
type Page = 'results' | 'statistics' | 'history' | 'dream-number';

export default function SiteNavbar({
  language = 'en',
  activePage = 'results',
}: {
  language?: Language;
  activePage?: Page;
}) {
  const bengali = language === 'bn';
  const home = bengali ? '/bn' : '/';

  const links: { id: Page; href: string; label: string }[] = bengali
    ? [
        { id: 'results', href: '/bn', label: 'ফলাফল' },
        { id: 'statistics', href: '/bn/statistics', label: 'পরিসংখ্যান' },
        { id: 'history', href: '/bn/history', label: 'ইতিহাস' },
        { id: 'dream-number', href: '/bn/dream-number', label: 'ড্রিম নম্বর' },
      ]
    : [
        { id: 'results', href: '/', label: 'Results' },
        { id: 'statistics', href: '/statistics', label: 'Statistics' },
        { id: 'history', href: '/history', label: 'History' },
        { id: 'dream-number', href: '/dream-number', label: 'Dream Number' },
      ];

  const navLinks = (mobile = false) =>
    links.map((item) => {
      const active = activePage === item.id;
      return (
        <Link
          key={item.id}
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
            active
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          } ${mobile ? 'whitespace-nowrap' : ''}`}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <nav className="sticky top-0 z-50 -mx-4 w-auto border-b border-slate-800 bg-slate-950 px-4 shadow-md">
      <div className="mx-auto max-w-6xl">
        <div className="flex min-h-16 items-center justify-between gap-3">
          <Link href={home} className="flex min-w-0 shrink-0 items-center gap-3">
            <img
              src="/icon.png"
              alt="Teer Khobor logo"
              width="40"
              height="40"
              className="h-10 w-10 rounded-xl object-contain"
            />
            <span className="text-sm font-black tracking-wide text-white sm:text-base">
              TEER KHOBOR
            </span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            {navLinks()}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-3 sm:hidden">
          {navLinks(true)}
        </div>
      </div>
    </nav>
  );
}
