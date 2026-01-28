import { getStore } from "@netlify/blobs";

const TOKEN_HEADER = "authorization";

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const expectedToken = process.env.ADMIN_TOKEN;
    const authHeader = event.headers?.[TOKEN_HEADER] || event.headers?.Authorization || "";
    const incomingToken = authHeader.replace(/^Bearer\s+/i, "");

    if (!expectedToken || incomingToken !== expectedToken) {
        return { statusCode: 401, body: "Unauthorized" };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const snippets = Array.isArray(body?.snippets) ? body.snippets : null;
        if (!snippets) {
            return { statusCode: 400, body: "Bad Request" };
        }

        const store = getStore("snippets");
        await store.set("data", { snippets });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ok: true }),
        };
    } catch (error) {
        return { statusCode: 500, body: "Server Error" };
    }
};
