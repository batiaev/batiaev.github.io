import { useEffect } from "react";

interface Meta {
  title: string;
  description?: string;
}

/** Swaps the document title and description for a route, then restores them. */
export function useDocumentMeta({ title, description }: Meta) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const tag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const previousDescription = tag?.content ?? null;
    if (tag && description) tag.content = description;

    return () => {
      document.title = previousTitle;
      if (tag && previousDescription !== null) tag.content = previousDescription;
    };
  }, [title, description]);
}
