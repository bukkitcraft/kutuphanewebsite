import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim() || "admin";
  const password = process.env.ADMIN_PASSWORD ?? "123";

  const hash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hash },
    create: { username, passwordHash: hash }
  });

  await prisma.setting.upsert({
    where: { key: "about_html" },
    update: {},
    create: {
      key: "about_html",
      value: "<p>Kütüphanemiz ve haber portalımıza hoş geldiniz.</p>"
    }
  });

  await prisma.setting.upsert({
    where: { key: "about_image_url" },
    update: {},
    create: { key: "about_image_url", value: "" }
  });

  await prisma.setting.upsert({
    where: { key: "about_subtitle" },
    update: {},
    create: {
      key: "about_subtitle",
      value: "Kütüphane ve içeriklerimiz hakkında kısa bilgi ve görsel."
    }
  });

  await prisma.setting.upsert({
    where: { key: "home_page_title" },
    update: {},
    create: {
      key: "home_page_title",
      value: "Kütüphane İçerikleri"
    }
  });

  await prisma.setting.upsert({
    where: { key: "home_page_subtitle" },
    update: {},
    create: { key: "home_page_subtitle", value: "" }
  });

  await prisma.setting.upsert({
    where: { key: "home_page_intro_html" },
    update: {},
    create: {
      key: "home_page_intro_html",
      value:
        "<p>Bu metni yönetim panelinden <strong>Anasayfa düzeni</strong> bölümünden düzenleyebilirsiniz.</p>"
    }
  });

  await prisma.setting.upsert({
    where: { key: "announcements_page_title" },
    update: {},
    create: { key: "announcements_page_title", value: "Duyurular" }
  });

  await prisma.setting.upsert({
    where: { key: "announcements_page_intro_html" },
    update: {},
    create: {
      key: "announcements_page_intro_html",
      value: "<p>Önemli duyurularımızı bu sayfadan takip edebilirsiniz.</p>"
    }
  });

  await prisma.setting.upsert({
    where: { key: "icerikler_page_title" },
    update: {},
    create: { key: "icerikler_page_title", value: "İçerikler" }
  });

  await prisma.setting.upsert({
    where: { key: "icerikler_page_intro_html" },
    update: {},
    create: {
      key: "icerikler_page_intro_html",
      value: "<p>Yayındaki içeriklerimizi bu sayfadan inceleyebilirsiniz.</p>"
    }
  });

  await prisma.setting.upsert({
    where: { key: "about_map_embed_url" },
    update: {},
    create: { key: "about_map_embed_url", value: "" }
  });

  await prisma.setting.updateMany({
    where: {
      key: "home_page_title",
      value: { in: ["Haberler ve Kutuphane Icerikleri", "Haberler ve Kütüphane İçerikleri"] }
    },
    data: { value: "Kütüphane İçerikleri" }
  });

  await prisma.menuItem.deleteMany({ where: { href: "/guestbook" } });

  await prisma.menuItem.updateMany({
    where: { href: "/about", label: "Hakkimizda" },
    data: { label: "Hakkımızda" }
  });

  const menuCount = await prisma.menuItem.count();
  if (menuCount === 0) {
    await prisma.menuItem.createMany({
      data: [
        { label: "Anasayfa", href: "/", sortOrder: 0, isActive: true },
        { label: "İçerikler", href: "/icerikler", sortOrder: 1, isActive: true },
        { label: "Duyurular", href: "/duyurular", sortOrder: 2, isActive: true },
        { label: "Hakkımızda", href: "/about", sortOrder: 3, isActive: true }
      ]
    });
  } else {
    const duyuruMenu = await prisma.menuItem.findFirst({ where: { href: "/duyurular" } });
    if (!duyuruMenu) {
      await prisma.menuItem.create({
        data: {
          label: "Duyurular",
          href: "/duyurular",
          sortOrder: 10,
          isActive: true
        }
      });
    }
    const icerikMenu = await prisma.menuItem.findFirst({ where: { href: "/icerikler" } });
    if (!icerikMenu) {
      await prisma.menuItem.create({
        data: {
          label: "İçerikler",
          href: "/icerikler",
          sortOrder: 5,
          isActive: true
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
