import { GuestBuyerLayout } from "@/components/layout/GuestBuyerLayout";
import { RoleSelectionModal } from "@/components/ui/RoleSelectionModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GuestBuyerLayout>
        {children}
      </GuestBuyerLayout>
      <RoleSelectionModal />
    </>
  );
}
