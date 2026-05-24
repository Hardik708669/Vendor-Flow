const statusColors = {
  Created:    'bg-slate-700 text-slate-300',
  Confirmed:  'bg-blue-500/20 text-blue-400',
  Production: 'bg-purple-500/20 text-purple-400',
  Dispatch:   'bg-amber-500/20 text-amber-400',
  Completed:  'bg-success/20 text-success',
  Cancelled:  'bg-red-500/20 text-red-400',
}

const OrdersTable = ({ orders = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-slate-800">
            <th className="pb-4 font-semibold">Order ID</th>
            <th className="pb-4 font-semibold">Customer</th>
            <th className="pb-4 font-semibold">Date</th>
            <th className="pb-4 font-semibold">Amount</th>
            <th className="pb-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {orders.length === 0 && (
            <tr><td colSpan={5} className="py-8 text-center text-text-muted text-sm">No orders yet.</td></tr>
          )}
          {orders.map((order) => (
            <tr key={order.id} className="group hover:bg-slate-800/50 transition-colors">
              <td className="py-4 text-sm font-medium font-mono text-primary">{order.orderNumber || order.id}</td>
              <td className="py-4 text-sm">{order.customer?.name || '—'}</td>
              <td className="py-4 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="py-4 text-sm font-semibold">₹{Number(order.amount).toLocaleString()}</td>
              <td className="py-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusColors[order.status] || 'bg-slate-700 text-slate-300'}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersTable
