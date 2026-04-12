import { AccountsTable } from "@/components/AccountsTable";

export const metadata = {
  title: "Account Management | WSDelgado",
  description: "Manage administrative and user accounts for WSDelgado Construction Corp.",
};

export default function AccountsPage() {
  return (
    <div className="p-4 md:p-12 min-h-screen bg-white">
      <AccountsTable />
    </div>
  );
}
