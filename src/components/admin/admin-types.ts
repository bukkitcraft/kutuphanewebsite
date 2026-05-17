export type Content = {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  bodyHtml: string;
};

export type PendingSiteReview = {
  id: number;
  fullName: string;
  message: string;
  rating: number;
  gender: string;
};

export type PendingContentComment = {
  id: number;
  contentId: number | null;
  announcementId: number | null;
  fullName: string;
  message: string;
  rating: number;
  gender: string;
  content: { title: string; slug: string } | null;
  announcement: { id: number; title: string } | null;
};

export type Announcement = {
  id: number;
  title: string;
  bodyHtml: string;
  isActive: boolean;
  sortOrder: number;
};

export type MenuRow = {
  id: number;
  label: string;
  href: string;
  isActive: boolean;
  sortOrder: number;
};

export type CarouselRow = {
  id: number;
  imageUrl: string;
  altText: string | null;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

export function redirectIfUnauthorized(res: Response) {
  if (res.status === 401) {
    window.location.href = "/admin/login";
    return true;
  }
  return false;
}
