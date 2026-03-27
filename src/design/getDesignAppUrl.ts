export function getDesignAppUrl(productId?: string, tabId?: string) {
  if (!productId) {
    return '/design.html';
  }

  const params = new URLSearchParams({
    productId,
  });

  if (tabId) {
    params.set('tabId', tabId);
  }

  return `/design.html?${params.toString()}`;
}
