import { useNavigate } from 'react-router';
import { Edit, Images, Share2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import PageIntro from '../components/layout/PageIntro';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useCommunityGallery } from '../contexts/CommunityGalleryContext';
import { useDesignTabs, type DesignTab } from '../contexts/DesignTabsContext';
import { getDesignAppUrl } from '../design/getDesignAppUrl';
import { getDesignPreviewImage } from '../design/designPreview';

export default function MyDesigns() {
  const navigate = useNavigate();
  const { storefrontUser } = useAuth();
  const { tabs, setActiveTab } = useDesignTabs();
  const { galleryDesigns, publishDesign } = useCommunityGallery();
  const savedDesigns = tabs;
  const publishedSourceIds = new Set(galleryDesigns.map((item) => item.sourceTabId));

  const openDesign = (tab: DesignTab) => {
    setActiveTab(tab.id);
    window.location.assign(getDesignAppUrl(tab.productId, tab.id));
  };

  const handlePublish = (tab: DesignTab) => {
    publishDesign(tab, storefrontUser);
  };

  return (
    <AppShell activeTab="Your creation" showDesignTabs>
      <PageIntro
        title="My designs"
        description="See every design you saved in the designing area, reopen it anytime, and share it to the public gallery."
        action={<Button onClick={() => navigate('/')}>Start a new design</Button>}
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
            <Images className="h-4 w-4" />
            Saved work
          </div>
        }
      />

      {savedDesigns.length === 0 ? (
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">No saved designs yet</h2>
            <p className="max-w-xl text-sm text-slate-600">
              Start from any product, create your design, and it will appear here once you save it in the designing area.
            </p>
            <Button onClick={() => navigate('/')}>Browse products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedDesigns.map((tab) => {
            const isPublished = publishedSourceIds.has(tab.id);

            return (
              <Card key={tab.id} className="overflow-hidden border-0 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div
                    className="flex h-72 items-center justify-center border-b border-slate-200"
                    style={{ backgroundColor: `${tab.selectedColor}22` }}
                  >
                    <img
                      src={getDesignPreviewImage(tab)}
                      alt={tab.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{tab.productInfo || tab.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {tab.selectedSize} size · {tab.layers.length} layer{tab.layers.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={() => openDesign(tab)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit design
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handlePublish(tab)}
                        disabled={isPublished}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        {isPublished ? 'Uploaded' : 'Upload to gallery'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
