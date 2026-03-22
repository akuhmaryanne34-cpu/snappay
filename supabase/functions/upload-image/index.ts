import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Converts raw bytes to a Uint8Array buffer (copy) and base64 string.
 */
function fileToBufferAndBase64(bytes: Uint8Array): {
  buffer: Uint8Array;
  base64: string;
} {
  const buffer = new Uint8Array(bytes);
  const base64 = encodeBase64(buffer);
  return { buffer, base64 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // Multipart file upload: field name "file"
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return new Response(
          JSON.stringify({
            error: 'Expected multipart field "file" with an image',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const { buffer, base64 } = fileToBufferAndBase64(bytes);

      return new Response(
        JSON.stringify({
          ok: true,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: buffer.byteLength,
          base64,
          // Optional: data URL for direct <img src> / APIs that expect it
          dataUrl: `data:${file.type || "application/octet-stream"};base64,${base64}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Raw body: treat entire body as image bytes
    const arrayBuffer = await req.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Empty body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bytes = new Uint8Array(arrayBuffer);
    const { buffer, base64 } = fileToBufferAndBase64(bytes);
    const mime =
      contentType.split(";")[0]?.trim() || "application/octet-stream";

    return new Response(
      JSON.stringify({
        ok: true,
        mimeType: mime,
        size: buffer.byteLength,
        base64,
        dataUrl: `data:${mime};base64,${base64}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
