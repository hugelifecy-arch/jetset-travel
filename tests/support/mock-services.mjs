// Only loaded by the local production-build smoke runner, never by the app.
if (process.env.JETSET_HTTP_SMOKE !== "1") throw new Error("Smoke adapter requires an isolated test process");

globalThis.fetch = async (input, init) => {
  const url = String(input);
  if (url === "https://www.google.com/recaptcha/api/siteverify") {
    const token = new URLSearchParams(init.body).get("response");
    return Response.json({
      success: token?.startsWith("smoke-") === true,
      score: 0.9,
      action: token?.slice(6),
      hostname: "localhost",
    });
  }
  if (url === "https://api.resend.com/emails") {
    const body = JSON.parse(init.body);
    if (body.html.includes("Delivery Failure") || body.to === "reply-fails@example.invalid") {
      return new Response("Simulated email outage", { status: 503 });
    }
    return Response.json({ id: "smoke-email" });
  }
  throw new Error(`Unexpected outbound request in isolated smoke test: ${new URL(url).origin}`);
};
