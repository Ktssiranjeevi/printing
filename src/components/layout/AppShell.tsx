import { ReactNode } from 'react';
import TopNavBar from '../TopNavBar';
import SecondaryNav from '../SecondaryNav';
import '../../styles/app-shell.css';

interface AppShellProps {
  children: ReactNode;
  activeTab?: string;
  showDesignTabs?: boolean;
  showBackButton?: boolean;
  showTopNav?: boolean;
  showSecondaryNav?: boolean;
  fullWidth?: boolean;
}

export default function AppShell({
  children,
  activeTab = 'Product catalog',
  showDesignTabs = false,
  showBackButton = false,
  showTopNav = true,
  showSecondaryNav = true,
  fullWidth = false,
}: AppShellProps) {
  return (
    <div className="app-shell">
      {showTopNav && <TopNavBar showBackButton={showBackButton} />}
      {showSecondaryNav && <SecondaryNav activeTab={activeTab} showDesignTabs={showDesignTabs} />}
      <main className={fullWidth ? 'app-shell__main app-shell__main--full-width' : 'app-shell__main'}>{children}</main>
    </div>
  );
}
