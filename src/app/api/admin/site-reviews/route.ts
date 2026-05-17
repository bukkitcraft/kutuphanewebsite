import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const pending = new URL(request.url).searchParams.get("pending") === "1";

  const list = await prisma.siteReview.findMany({
    where: pending ? { isApproved: false } : undefined,
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(list);
}
