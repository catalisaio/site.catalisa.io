import { useEffect, useId } from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Injects JSON-LD structured data into <head> via useEffect.
 * Supports single schema or array of schemas. Cleanup on unmount.
 */
export function JsonLd({ data }: JsonLdProps) {
  const id = useId();

  useEffect(() => {
    const schemas = Array.isArray(data) ? data : [data];
    const scripts = schemas.map((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jsonld', `${id}-${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [data, id]);

  return null;
}
