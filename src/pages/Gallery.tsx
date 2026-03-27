import { useNavigate } from 'react-router';
import { Edit, Sparkles, UploadCloud } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import AppShell from '../components/layout/AppShell';
import PageIntro from '../components/layout/PageIntro';
import { useCommunityGallery } from '../contexts/CommunityGalleryContext';
import { useDesignTabs } from '../contexts/DesignTabsContext';
import { getDesignAppUrl } from '../design/getDesignAppUrl';

export default function Gallery() {
  const navigate = useNavigate();
  const { galleryDesigns } = useCommunityGallery();
  const { addTab, setActiveTab } = useDesignTabs();

  const handleOpenGalleryDesign = (designId: string) => {
    const selectedDesign = galleryDesigns.find((item) => item.id === designId);

    if (!selectedDesign) {
      return;
    }

    const nextTab = addTab(selectedDesign.title, {
      productId: selectedDesign.productId,
      productImage: selectedDesign.productImage,
      productInfo: selectedDesign.productInfo || selectedDesign.title,
      selectedColor: selectedDesign.selectedColor,
      selectedSize: selectedDesign.selectedSize,
      layers: selectedDesign.layers,
      artworkImage: selectedDesign.artworkImage,
      artworkName: selectedDesign.artworkName,
      previewImage: selectedDesign.image,
    });

    setActiveTab(nextTab.id);
    window.location.assign(getDesignAppUrl(selectedDesign.productId, nextTab.id));
  };

  return (
    <AppShell activeTab="Gallery">
      <PageIntro
        title="Design gallery"
        description="Explore community designs, reuse them in your own workspace, or upload one of your saved designs for everyone to edit."
        action={<Button onClick={() => navigate('/my-designs')}>Upload from my designs</Button>}
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            <Sparkles className="h-4 w-4" />
            Community highlights
          </div>
        }
      />

      {galleryDesigns.length === 0 ? (
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <UploadCloud className="h-12 w-12 text-slate-400" />
            <h2 className="text-2xl font-semibold text-slate-900">No gallery designs yet</h2>
            <p className="max-w-xl text-sm text-slate-600">
              Publish one of your saved designs and it will appear here for other users to open and edit.
            </p>
            <Button onClick={() => navigate('/my-designs')}>Go to my designs</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryDesigns.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 bg-white shadow-sm transition-transform hover:-translate-y-1">
              <CardContent className="p-0">
                <img src={item.image} alt={item.title} className="h-72 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                    <p className="text-sm text-slate-500">
                      By {item.creatorName} · {item.selectedSize} size · {item.layers.length} layer{item.layers.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => handleOpenGalleryDesign(item.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Use and edit design
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
