/* eslint-disable import/no-cycle */
import { NX_ORIGIN } from './scripts.js';

let expMod;
const DA_EXP = '/public/plugins/exp/exp.js';

async function toggleExp() {
  const exists = document.querySelector('#aem-sidekick-exp');

  // If it doesn't exist, let module side effects run
  if (!exists) {
    expMod = await import(`${NX_ORIGIN}${DA_EXP}`);
    return;
  }

  // Else, cache the module here and toggle it.
  if (!expMod) expMod = await import(`${NX_ORIGIN}${DA_EXP}`);
  expMod.default();
}

async function sendReview() {
  const pageDetails = {
    url: window.location.href,
    title: document.title,
    pathname: window.location.pathname,
    hostname: window.location.hostname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    metadata: {},
  };

  // Collect page metadata
  const metaTags = document.querySelectorAll('meta');
  metaTags.forEach((meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      pageDetails.metadata[name] = content;
    }
  });

  try {
    const response = await fetch('https://www.postb.in/b/1763560521955-8418951861094', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageDetails),
    });

    if (response.ok) {
      // eslint-disable-next-line no-console
      console.log('Review submitted successfully');
      // Show success notification if sidekick provides a method
      const sk = document.querySelector('aem-sidekick');
      if (sk && sk.showModal) {
        sk.showModal({
          message: 'Page review submitted successfully!',
          sticky: false,
        });
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Failed to submit review:', response.status);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting review:', error);
  }
}

(async function sidekick() {
  const sk = document.querySelector('aem-sidekick');
  if (!sk) return;
  sk.addEventListener('custom:experimentation', toggleExp);
  sk.addEventListener('custom:review', sendReview);
}());
