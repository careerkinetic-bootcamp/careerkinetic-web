export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Read GCS bucket name from wrangler environment variables
    const bucketName = env.GCS_BUCKET_NAME || 'careerkinetic-prod-frontend';
    const gcsHost = 'storage.googleapis.com';

    // Determine if the request is for a specific static file asset
    // We check if the last segment of the path has a dot (e.g. index.css, logo.svg)
    const lastSegment = path.split('/').pop() || '';
    const isStaticFile = lastSegment.includes('.') && !lastSegment.endsWith('.html');

    let gcsTargetUrl;

    if (isStaticFile) {
      // Direct asset request (e.g. CSS, JS, images)
      gcsTargetUrl = `https://${gcsHost}/${bucketName}${path}`;
    } else {
      // SPA route (e.g. /profile, /about) - rewrite to serve index.html
      gcsTargetUrl = `https://${gcsHost}/${bucketName}/index.html`;
    }

    // Perform origin pull from Google Cloud Storage
    // GCS requires the Host header to match the storage endpoint
    let response = await fetch(gcsTargetUrl, {
      headers: {
        'Host': gcsHost
      }
    });

    // Create a mutable copy of the response to edit headers
    response = new Response(response.body, response);

    // Override headers for caching optimization
    if (isStaticFile) {
      // Long-term immutable caching for hashed asset files
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      // Prevent caching of index.html so frontend updates are immediate
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      // Set correct content type for index.html if overwritten
      response.headers.set('Content-Type', 'text/html; charset=UTF-8');
    }

    // Secure headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }
};
