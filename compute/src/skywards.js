import Mustache from 'mustache';
// import template from "./skywards.mustache";
import { skywards as template } from './templates.js';

async function skywardsHandler(request) {
  // Parse request URL and attributes
  const url = new URL(request.url);
  const path = url.pathname;
  const params = Object.fromEntries(url.searchParams.entries());
  const headers = Object.fromEntries(request.headers.entries());
  // Prepare data for Mustache
  const view = {
    title: 'Dynamic Edge HTML',
    path,
    params: Object.entries(params).map(([key, value]) => ({ key, value })),
    headers: Object.entries(headers).map(([key, value]) => ({ key, value })),
  };

  // Render the HTML
  const html = Mustache.render(template, view);

  // Return as HTML response
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// eslint-disable-next-line import/prefer-default-export
export { skywardsHandler };
