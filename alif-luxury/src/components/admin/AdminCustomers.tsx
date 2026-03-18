import { Search, Mail } from 'lucide-react';

const usersList = [
    { name: 'Zahra Ahmed', email: 'zahra@example.com', orders: 4, spent: 145000, joined: 'Mar 2024' },
    { name: 'Ayesha Khan', email: 'ayesha@example.com', orders: 2, spent: 85000, joined: 'Jul 2024' },
    { name: 'Fatima Ali', email: 'fatima@example.com', orders: 1, spent: 18900, joined: 'Sep 2024' },
    { name: 'Sara Malik', email: 'sara@example.com', orders: 7, spent: 320000, joined: 'Jan 2024' },
];

export const AdminCustomers = () => {
    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Clientele</h1>
                    <p className="text-gray-500 mt-1">Manage VIPs and registered users.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center mb-6">
                <div className="relative w-full max-w-lg">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search clientele by name or email..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6 font-medium">Client Name</th>
                            <th className="py-4 px-6 font-medium">Contact</th>
                            <th className="py-4 px-6 font-medium text-center">Orders</th>
                            <th className="py-4 px-6 font-medium">Total Spent</th>
                            <th className="py-4 px-6 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.map((user, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-brand-primary">{user.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-500 flex items-center">
                                    <Mail size={14} className="mr-2 opacity-50" />
                                    {user.email}
                                </td>
                                <td className="py-4 px-6 text-sm text-center font-mono">{user.orders}</td>
                                <td className="py-4 px-6 text-sm font-semibold text-brand-accent">Rs. {user.spent.toLocaleString()}</td>
                                <td className="py-4 px-6 text-sm text-gray-400">{user.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
