import { RoleBasedLayout } from "@/components/layout/RoleBasedLayout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleBasedLayout>
      {children}
    </RoleBasedLayout>
  );
}
