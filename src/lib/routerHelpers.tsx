/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// GitHub Pages SPA fallback handler
export function useGitHubPagesSPA() {
  useEffect(() => {
    // Single Page Apps for GitHub Pages
    // https://github.com/rafgraph/spa-github-pages
    // This script checks to see if a redirect is present in the query string,
    // and if so it takes the redirect and converts it back to the correct url
    const query = window.location.search;
    if (query && query.startsWith('?/')) {
      const route = query.slice(2).split('&')[0].replace(/~/g, '&');
      window.history.replaceState(null, '', route + window.location.hash);
    }
  }, []);
}

// Scroll to top on route change
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
