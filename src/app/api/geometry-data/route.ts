import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
	const filePath = path.join(
		process.cwd(),
		"public",
		"assets",
		"georgi_2.json.gz",
	);
	const fileBuffer = fs.readFileSync(filePath);

	return new NextResponse(fileBuffer, {
		headers: {
			"Content-Type": "application/json",
			"Content-Encoding": "gzip",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
