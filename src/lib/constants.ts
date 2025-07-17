
export type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/store' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const ADMIN_NAV_LINKS: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Users', href: '/admin/users' },
];
