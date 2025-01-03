import { join } from "path";

// Build the bundle from public directory
console.log("Building the bundle...");
const buildResult = await Bun.build({
    entrypoints: [join(__dirname, "../public/**/*")],
    outdir: join(__dirname, "../dist"),
    minify: true,
});

if (!buildResult.success) {
    console.error("Build failed:", buildResult.logs);
    process.exit(1);
}

// Serve the dist directory
console.log("Serving the dist directory...");
const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
        const fullPath = join(import.meta.dir, "../dist", filePath);

        return new Response(Bun.file(fullPath));
    },
});

console.log(`Server running at http://localhost:${server.port}`);