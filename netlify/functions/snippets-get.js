import { getStore } from "@netlify/blobs";

export const handler = async () => {
    try {
        const store = getStore("snippets");
        const data = await store.get("data", { type: "json" });
        const payload = data && Array.isArray(data.snippets) ? data : { snippets: [] };
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(payload),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ snippets: [], error: "failed_to_load" }),
        };
    }
};
