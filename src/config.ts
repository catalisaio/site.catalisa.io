function getBaseDocsUrl(): string {
  if (typeof window === 'undefined') return 'https://docs.catalisa.app';
  const hostname = window.location.hostname;
  if (hostname.includes('staging') || hostname.includes('stg') || hostname === 'localhost') {
    return 'https://docs.stg.catalisa.app';
  }
  return 'https://docs.catalisa.app';
}

export const config = {
  docsUrl: getBaseDocsUrl(),
  apiReferenceUrl: `${getBaseDocsUrl()}/api-reference`,
};
