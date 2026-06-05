import PagesLayout from "@/components/pagesLayout/PagesLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PagesLayout player={true}>{children}</PagesLayout>
}
