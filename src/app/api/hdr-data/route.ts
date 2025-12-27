import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const filenameParam = searchParams.get("filename") as string;

	console.log({ filenameParam });

	const filePath = path.join(
		process.cwd(),
		"public",
		"assets",
		`${filenameParam}.gz`,
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
