import { HTMLRewritingStream } from 'fastly:html-rewriter';

async function handleRequest(event) {
  console.log("Rewriting ESI request");
  const transformer = new HTMLRewritingStream()
    .onElement('div.esi', e => e.replaceWith('<esi:include src="/skywards" />'));

  let body = (await fetch("https://main--dnata--cpilsworth.aem.live/")).body.pipeThrough(transformer);

  return new Response(body, {
    status: 200,
    headers: new Headers({
      "content-type": "text/html",
      "x-aem-esi": "on",
    })
  });
}

export { handleRequest }