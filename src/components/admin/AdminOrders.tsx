import { useState } from 'react';
import { Search, Filter, FileText, X } from 'lucide-react';
import { Button } from '../Button';

interface OrderType {
    id: string;
    date: string;
    customer: string;
    total: number;
    status: string;
    items: number;
}

// Dummy Order Data
const ordersList = [
    { id: 'ALF-49201', date: 'Oct 24, 2024', customer: 'Zahra Ahmed', total: 24500, status: 'Processing', items: 1 },
    { id: 'ALF-49200', date: 'Oct 24, 2024', customer: 'Ayesha Khan', total: 56100, status: 'Shipped', items: 3 },
    { id: 'ALF-49199', date: 'Oct 23, 2024', customer: 'Fatima Ali', total: 18900, status: 'Delivered', items: 1 },
    { id: 'ALF-49198', date: 'Oct 23, 2024', customer: 'Sara Malik', total: 42000, status: 'Processing', items: 2 },
    { id: 'ALF-49197', date: 'Oct 22, 2024', customer: 'Nida Yasir', total: 32000, status: 'Delivered', items: 1 },
    { id: 'ALF-49196', date: 'Oct 22, 2024', customer: 'Hira Mani', total: 24500, status: 'Canceled', items: 1 },
];

export const AdminOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-amber-100 text-amber-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Canceled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage shipments, invoices, and fulfillment.</p>
                </div>
                <Button variant="outline" className="text-sm h-10 px-5 flex items-center shadow-sm bg-white">
                    <FileText size={16} className="mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by order ID, customer name..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                    />
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                    <Button variant="outline" className="h-10 px-4 text-gray-600 bg-gray-50 border-gray-200">
                        <Filter size={16} className="mr-2" />
                        Status: All
                    </Button>
                    <select className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-brand-accent text-gray-600">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                <div className={`w-full transition-all duration-300 ${selectedOrder ? 'w-2/3 border-r border-gray-100' : ''}`}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="py-4 px-6 font-medium">Order ID</th>
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">Customer</th>
                                <th className="py-4 px-6 font-medium">Total</th>
                                <th className="py-4 px-6 font-medium">Items</th>
                                <th className="py-4 px-6 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList.map((order, i) => (
                                <tr 
                                    key={i} 
                                    onClick={() => setSelectedOrder(order)}
                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-brand-accent/5' : ''}`}
                                >
                                    <td className="py-4 px-6 font-mono text-sm font-semibold text-brand-primary">{order.id}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{order.date}</td>
                                    <td className="py-4 px-6 text-sm font-medium">{order.customer}</td>
                                    <td className="py-4 px-6 text-sm">Rs. {order.total.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{order.items} piece(s)</td>
                                    <td className="py-4 px-6 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Side Slide-in Summary (Selected Order) */}
                {selectedOrder && (
                    <div className="w-1/3 bg-gray-50/50 p-6 relative animate-in slide-in-from-right-4 duration-300 hidden md:block">
                        <button 
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <h3 className="font-bold text-lg mb-1">{selectedOrder.id}</h3>
                        <p className="text-sm text-gray-500 mb-6">{selectedOrder.date}</p>

                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">Customer Profile</h4>
                                <div className="font-medium text-sm">{selectedOrder.customer}</div>
                                <div className="text-xs text-gray-500 mt-1">user@alif-customer.com</div>
                                <div className="text-xs text-gray-500 mt-1">+92 300 1234567</div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">Shipping Address</h4>
                                <div className="text-sm text-gray-700 leading-relaxed">
                                    House 42, Block C,<br />
                                    DHA Phase 5,<br />
                                    Lahore, Pakistan<br />
                                    54000
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">Updating Status</h4>
                                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-accent outline-none bg-gray-50 mb-3" defaultValue={selectedOrder.status}>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                                <Button className="w-full text-xs h-9">Update Fulfillment Phase</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
