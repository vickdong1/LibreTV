export async function onRequest(context) {
  const { env, next } = context;
  const response = await next();

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    let html = await response.text();

    // 直接使用环境变量中的明文密码
    const password = env.PASSWORD || "";

    html = html.replace(
      /window\.__ENV__\.PASSWORD\s*=\s*"\{\{PASSWORD\}\}";/g,
      `window.__ENV__.PASSWORD = "${password}";`
    );

    return new Response(html, {
      headers: new Headers(response.headers),
      status: response.status,
      statusText: response.statusText,
    });
  }

  return response;
}
