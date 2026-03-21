import { EmployeesTable } from '@/components/EmployeesTable';

export default function EmployeesPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Employees Management</h1>
            <EmployeesTable />
        </div>
    );
}
