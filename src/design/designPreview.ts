import type { DesignTab } from '../contexts/DesignTabsContext';

type DesignPreviewInput = Pick<
  DesignTab,
  'name' | 'productImage' | 'productInfo' | 'selectedColor' | 'selectedSize' | 'artworkImage' | 'previewImage'
>;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildDesignPreviewSvg(tab: DesignPreviewInput) {
  const productImage = tab.productImage ? `<image href="${escapeXml(tab.productImage)}" x="140" y="120" width="720" height="900" preserveAspectRatio="xMidYMid meet" />` : '';
  const artwork = tab.artworkImage
    ? `<image href="${escapeXml(tab.artworkImage)}" x="395" y="390" width="210" height="210" preserveAspectRatio="xMidYMid meet" />`
    : '';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1200" viewBox="0 0 1000 1200">
      ${productImage}
      ${artwork}
    </svg>
  `.trim();
}

export function buildDesignPreviewDataUrl(tab: DesignPreviewInput) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildDesignPreviewSvg(tab))}`;
}

export function getDesignPreviewImage(tab: DesignPreviewInput) {
  return tab.previewImage || buildDesignPreviewDataUrl(tab);
}

export async function exportDesignPreviewImage(tab: DesignPreviewInput) {
  const svgUrl = buildDesignPreviewDataUrl(tab);

  return new Promise<string>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1200;

      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas is not available.'));
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = () => reject(new Error('Unable to render design preview.'));
    image.src = svgUrl;
  });
}
