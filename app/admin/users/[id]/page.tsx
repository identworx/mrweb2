import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserEditForm from "@/components/admin/UserEditForm";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </Link>
            {" > "}
            <Link href="/admin/users" className="hover:text-orange-600 transition-colors">
              Benutzer
            </Link>
            {" > "}
            Neuer Benutzer
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Neuer Benutzer</h1>
        </div>

        <UserEditForm user={null} />
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/admin/users");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/users" className="hover:text-orange-600 transition-colors">
            Benutzer
          </Link>
          {" > "}
          Bearbeiten
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {user.name || user.email}
        </h1>
      </div>

      <UserEditForm
        user={{
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          role: user.role,
        }}
      />
    </div>
  );
}
