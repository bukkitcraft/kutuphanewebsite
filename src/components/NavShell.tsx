import { prisma } from "@/lib/prisma";
import { Navbar } from "./Navbar";

export const dynamic = "force-dynamic";

export async function NavShell() {
  const items = await prisma.menuItem.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
  });

  return (
    <Navbar
      items={items.map((i) => ({ id: i.id, label: i.label, href: i.href }))}
    />
  );
}
