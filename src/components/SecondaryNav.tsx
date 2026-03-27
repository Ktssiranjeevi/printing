import { Button } from './ui/button';
import { Package2, Palette, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDesignTabs } from '../contexts/DesignTabsContext';
import { getDesignAppUrl } from '../design/getDesignAppUrl';
import '../styles/secondary-nav.css';

interface SecondaryNavProps {
  activeTab?: string;
  showDesignTabs?: boolean;
}

export default function SecondaryNav({ activeTab = 'Product catalog', showDesignTabs = false }: SecondaryNavProps) {
  const { tabs, activeTabId, removeTab, setActiveTab } = useDesignTabs();
  const location = useLocation();
  const navigate = useNavigate();
  const designTabs = tabs.filter((tab) => tab.productId);
  const activeDesignTab = designTabs.find((tab) => tab.id === activeTabId) ?? designTabs[designTabs.length - 1];
  const creationPath = activeDesignTab?.productId ? getDesignAppUrl(activeDesignTab.productId, activeDesignTab.id) : '/';
  const shouldShowDesignTabs = showDesignTabs || designTabs.length > 0;

  const staticTabs = [
    { label: 'Home', to: '/' },
    { label: 'Product catalog', to: '/catalog' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Your creation', to: creationPath },
  ];

  const isCreationRoute = location.pathname === '/design.html';

  const handleTabClick = (tabName: string) => {
    switch (tabName) {
      case 'Your creation':
        if (activeDesignTab) {
          setActiveTab(activeDesignTab.id);
          window.location.assign(getDesignAppUrl(activeDesignTab.productId, activeDesignTab.id));
        } else {
          navigate('/');
        }
        break;
      default:
        break;
    }
  };

  const handleDesignTabClick = (tabId: string) => {
    const tab = tabs.find((item) => item.id === tabId);
    setActiveTab(tabId);

    if (tab?.productId) {
      window.location.assign(getDesignAppUrl(tab.productId, tab.id));
      return;
    }

    navigate('/');
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const closingIndex = designTabs.findIndex((tab) => tab.id === tabId);
    const remainingTabs = designTabs.filter((tab) => tab.id !== tabId);
    const fallbackTab = remainingTabs[Math.max(0, closingIndex - 1)] || remainingTabs[0];
    const isClosingActiveTab = activeTabId === tabId;

    removeTab(tabId);

    if (!isClosingActiveTab) {
      return;
    }

    if (fallbackTab?.productId) {
      setActiveTab(fallbackTab.id);
      window.location.assign(getDesignAppUrl(fallbackTab.productId, fallbackTab.id));
      return;
    }

    if (location.pathname === '/design.html') {
      window.location.assign('/');
    }
  };

  const getTabClassName = (isActive: boolean) =>
    `secondary-nav__tab${isActive ? ' secondary-nav__tab--active' : ''}`;

  return (
    <nav className="secondary-nav">
      <div className="secondary-nav__inner">
        <div className="secondary-nav__list">
          {/* Static Tabs */}
          {staticTabs.map((tab) => (
            <Button
              key={tab.label}
              variant="ghost"
              asChild
              className={getTabClassName(
                activeTab === tab.label || (tab.label === 'Your creation' ? isCreationRoute : location.pathname === tab.to),
              )}
            >
              <Link
                to={tab.to}
                onClick={(event) => {
                  if (tab.label === 'Your creation') {
                    event.preventDefault();
                    handleTabClick(tab.label);
                    return;
                  }

                  if (tab.to.endsWith('.html')) {
                    event.preventDefault();
                    window.location.assign(tab.to);
                  }
                }}
              >
                {tab.label}
              </Link>
            </Button>
          ))}

          {shouldShowDesignTabs && designTabs.map((tab) => (
            <div key={tab.id} className="secondary-nav__tab-wrap">
              <Button
                variant="ghost"
                className={getTabClassName(activeTabId === tab.id)}
                onClick={() => handleDesignTabClick(tab.id)}
                title={tab.name}
              >
                <span className="secondary-nav__tab-icon" aria-hidden="true">
                  {activeTabId === tab.id ? <Palette className="h-3.5 w-3.5" /> : <Package2 className="h-3.5 w-3.5" />}
                </span>
                <span className="secondary-nav__tab-label">{tab.name}</span>
                <button
                  type="button"
                  className="secondary-nav__close-button"
                  aria-label={`Close ${tab.name}`}
                  onClick={(e) => handleCloseTab(e, tab.id)}
                >
                  <X className="secondary-nav__close h-3 w-3" />
                </button>
              </Button>
            </div>
          ))}

          {shouldShowDesignTabs && (
            <div className="secondary-nav__session-pill" aria-label="Design sessions">
              <Palette className="h-3.5 w-3.5" />
              <span>{designTabs.length} active design{designTabs.length === 1 ? '' : 's'}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
