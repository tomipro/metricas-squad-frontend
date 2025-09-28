export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const suffix = url.pathname.replace(/^\/api\/analytics/, "");

  const base = env.ANALYTICS_BASE_URL;
  const apiKey = env.ANALYTICS_API_KEY;
  if (!base) return new Response("Missing ANALYTICS_BASE_URL", { status: 500 });
  if (!apiKey) return new Response("Missing ANALYTICS_API_KEY", { status: 500 });

  const targetUrl = new URL(suffix + url.search, base);

  const headers = new Headers(request.headers);
  headers.set("x-api-key", apiKey);
  headers.delete("host");
  headers.delete("cookie");

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const resp = await fetch(targetUrl.toString(), {
    method,
    headers,
    body,
    redirect: "manual",
  });

  return new Response(resp.body, {
    status: resp.status,
    headers: resp.headers,
  });
};
