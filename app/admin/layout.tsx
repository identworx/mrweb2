import { getSessionUser } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | Mosaroma",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    return <>{children}</>;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
