import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contents = await prisma.content.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(contents);
}
