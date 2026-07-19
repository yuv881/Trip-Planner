import { useState, useEffect } from "react"
import Metric_Card from "../components/Metric_Card.jsx"
import { getTrips } from "../utils/storage.js"
import { Calendar, CheckCircle2, Clock, DollarSign, MapPin } from "lucide-react"

const DashboardHome = () => {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        const fetchAndSetTrips = async () => {
            const data = await getTrips()
            setTrips(data)
        }
        fetchAndSetTrips()
    }, [])

    const totalTrips = trips.length
    const completedTrips = trips.filter((t) => t.status === "completed").length
    const pendingTrips = trips.filter((t) => t.status !== "completed").length

    const totalBudget = trips.reduce((acc, t) => acc + (t.budget?.total || 0), 0)
    const totalSpent = trips.reduce((acc, t) => acc + (t.budget?.spent || 0), 0)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-zinc-950">Dashboard</h1>
                <p className="mt-1.5 text-zinc-500 font-medium">Welcome back! Here's a summary of your travel plans and budgets.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Metric_Card 
                    label="Total Trips" 
                    value={totalTrips} 
                    icon={Calendar} 
                    description="All-time planned trips"
                />
                <Metric_Card 
                    label="Pending Trips" 
                    value={pendingTrips} 
                    icon={Clock} 
                    description="Active or in planning stage"
                />
                <Metric_Card 
                    label="Completed Trips" 
                    value={completedTrips} 
                    icon={CheckCircle2} 
                    description="Trips finished successfully"
                />
                <Metric_Card 
                    label="Total Budget Spent" 
                    value={`₹${totalSpent.toLocaleString()}`} 
                    icon={DollarSign} 
                    description={`Out of ₹${totalBudget.toLocaleString()} allocated`}
                />
            </div>

            {/* Recent Trips Preview */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
                <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-zinc-500" />
                    Destinations List
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-200 text-zinc-400 font-semibold uppercase text-xs tracking-wider">
                                <th className="pb-3 pr-4">Destination</th>
                                <th className="pb-3 px-4">Dates</th>
                                <th className="pb-3 px-4">Status</th>
                                <th className="pb-3 pl-4 text-right">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {trips.length > 0 ? (
                                trips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="py-4 pr-4 font-semibold text-zinc-900">{trip.destination}</td>
                                        <td className="py-4 px-4 text-zinc-500 text-xs">{trip.startDate} to {trip.endDate}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                                                trip.status === "completed" 
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                                    : trip.status === "in_progress" 
                                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                            }`}>
                                                {trip.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="py-4 pl-4 text-right font-medium text-zinc-900">
                                            ₹{trip.budget.spent.toLocaleString()} <span className="text-zinc-400 text-xs font-normal">/ ₹{trip.budget.total.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-zinc-400 font-semibold">
                                        No records available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
