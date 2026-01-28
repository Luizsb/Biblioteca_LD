import { getStore } from "@netlify/blobs";

export default async () => {
    try {
        const store = getStore("snippets");
        const data = await store.get("data", { type: "json" });
        const payload = data && Array.isArray(data.snippets) ? data : { snippets: [] };
        return new Response(JSON.stringify(payload), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ snippets: [], error: "failed_to_load" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
};
