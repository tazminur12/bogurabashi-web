import { useEffect } from 'react';

/**
 * Simple hook to set document title per page.
 * Usage: usePageTitle('পাতার নাম | বগুড়াবাসী');
 */
export default function usePageTitle(title) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

