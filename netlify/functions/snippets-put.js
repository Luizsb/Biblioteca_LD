import { getStore } from "@netlify/blobs";

const TOKEN_HEADER = "authorization";

export default async (request) => {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const expectedToken = process.env.NETLIFY_BLOBS_TOKEN;
    const authHeader = request.headers.get(TOKEN_HEADER) || "";
    const incomingToken = authHeader.replace(/^Bearer\s+/i, "");

    if (!expectedToken || incomingToken !== expectedToken) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const snippets = Array.isArray(body?.snippets) ? body.snippets : null;
        if (!snippets) {
            return new Response("Bad Request", { status: 400 });
        }

        const store = getStore("snippets");
        await store.set("data", { snippets });

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response("Server Error", { status: 500 });
    }
};
