import { useState } from "react"
import { X, Calendar, MapPin, Plane, Bed, ShieldAlert, Globe, CheckCircle2, Circle } from "lucide-react"

const TripDetailsDrawer = ({ trip, onClose }) => {
    const [activeTab, setActiveTab] = useState("overview")

    if (!trip) return null

    const {
        destination,
        startDate,
        endDate,
        durationDays,
        status,
        budget,
        travelers,
        travelDetails,
        itinerary,
        tasks,
    } = trip

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200"
            case "in_progress":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "planning":
                return "bg-amber-50 text-amber-700 border-amber-200"
            default:
                return "bg-zinc-50 text-zinc-600 border-zinc-200"
        }
    }

    const formatStatus = (status) => {
        return status.replace("_", " ").toUpperCase()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
                {/* Header */}
                <div className="p-6 border-b border-zinc-150 flex items-start justify-between bg-zinc-50">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusStyle(status)}`}>
                                {formatStatus(status)}
                            </span>
                            <span className="text-xs text-zinc-500 font-medium">
                                {durationDays} Days Trip
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-1.5">
                            <MapPin className="text-zinc-500 shrink-0" size={24} />
                            {destination}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                            <Calendar size={14} />
                            {startDate} to {endDate}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs navigation */}
                <div className="flex border-b border-zinc-150 px-6 bg-zinc-50">
                    {["overview", "itinerary", "travel details", "tasks"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-4 text-sm font-semibold capitalize border-b-2 transition-all cursor-pointer ${activeTab === tab
                                ? "border-zinc-900 text-zinc-900"
                                : "border-transparent text-zinc-500 hover:text-zinc-950"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Contents */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Budget summary */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 mb-2">Budget Summary</h3>
                                <div className="border border-zinc-200 rounded-lg p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-50 p-3 rounded-md">
                                            <span className="text-xs text-zinc-500 block">Total Budget</span>
                                            <span className="text-lg font-bold text-zinc-900">₹{budget.total.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-zinc-50 p-3 rounded-md">
                                            <span className="text-xs text-zinc-500 block">Spent Amount</span>
                                            <span className="text-lg font-bold text-zinc-900">₹{budget.spent.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Breakdown bars */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Breakdown</h4>
                                        <div className="space-y-2">
                                            {budget.breakdown.map((item) => (
                                                <div key={item.category} className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-zinc-600">{item.category}</span>
                                                        <span className="font-semibold text-zinc-800">₹{item.amount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-zinc-100 rounded-full h-1.5">
                                                        <div
                                                            className="bg-zinc-600 h-full rounded-full"
                                                            style={{ width: `${(item.amount / budget.total) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Travelers */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 mb-2">Travelers</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {travelers.map((t) => (
                                        <div key={t.id} className="flex items-center gap-3 p-3 border border-zinc-150 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs capitalize">
                                                {t.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
                                                <div className="text-xs text-zinc-500 capitalize">{t.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "itinerary" && (
                        <div className="space-y-4">
                            {itinerary && itinerary.length > 0 ? (
                                <div className="relative border-l border-zinc-200 ml-3 pl-6 space-y-6">
                                    {itinerary.map((item) => (
                                        <div key={item.day} className="relative">
                                            {/* dot */}
                                            <span className={`absolute left-[-31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${item.status === "completed" ? "bg-emerald-500" : "bg-zinc-300"
                                                }`} />
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
                                                        Day {item.day} - {item.date}
                                                    </span>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.status === "completed"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                        }`}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-zinc-900 mt-1">{item.title}</h4>
                                                <p className="text-sm text-zinc-650 mt-1">{item.description}</p>

                                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                                    <span className="flex items-center gap-1 font-medium bg-zinc-50 px-2 py-0.5 rounded-sm">
                                                        <MapPin size={12} /> {item.location}
                                                    </span>
                                                    <span>Budget: ₹{item.budget.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-500">
                                    No itinerary items planned yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "travel details" && (
                        <div className="space-y-6">
                            {/* Flights */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                                    <Plane className="text-zinc-500" size={18} />
                                    Flight Reservations
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Outbound */}
                                    <div className="border border-zinc-200 rounded-lg p-4">
                                        <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2">Outbound Flight</h4>
                                        {travelDetails?.outboundFlight ? (
                                            <div className="space-y-1.5">
                                                <div className="text-sm font-bold text-zinc-900">
                                                    {travelDetails.outboundFlight.airline} - {travelDetails.outboundFlight.flightNumber}
                                                </div>
                                                <div className="flex justify-between text-xs text-zinc-650">
                                                    <span>Route</span>
                                                    <span className="font-semibold">{travelDetails.outboundFlight.from} ➔ {travelDetails.outboundFlight.to}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-zinc-650">
                                                    <span>Departure</span>
                                                    <span>{new Date(travelDetails.outboundFlight.departure).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-zinc-400">No outbound flights booked.</p>
                                        )}
                                    </div>

                                    {/* Return */}
                                    <div className="border border-zinc-200 rounded-lg p-4">
                                        <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2">Return Flight</h4>
                                        {travelDetails?.returnFlight ? (
                                            <div className="space-y-1.5">
                                                <div className="text-sm font-bold text-zinc-900">
                                                    {travelDetails.returnFlight.airline} - {travelDetails.returnFlight.flightNumber}
                                                </div>
                                                <div className="flex justify-between text-xs text-zinc-650">
                                                    <span>Route</span>
                                                    <span className="font-semibold">{travelDetails.returnFlight.from} ➔ {travelDetails.returnFlight.to}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-zinc-650">
                                                    <span>Departure</span>
                                                    <span>{new Date(travelDetails.returnFlight.departure).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-zinc-400">No return flights booked.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Accommodation */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                                    <Bed className="text-zinc-500" size={18} />
                                    Accommodation
                                </h3>
                                <div className="border border-zinc-200 rounded-lg p-4">
                                    {travelDetails?.accommodation && travelDetails.accommodation.name !== "TBD" ? (
                                        <div className="space-y-2">
                                            <div className="text-base font-bold text-zinc-900">{travelDetails.accommodation.name}</div>
                                            <p className="text-xs text-zinc-500">{travelDetails.accommodation.address}</p>
                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 text-xs">
                                                <div>
                                                    <span className="text-zinc-400 block">Check-in</span>
                                                    <span className="font-semibold text-zinc-800">
                                                        {travelDetails.accommodation.checkIn ? new Date(travelDetails.accommodation.checkIn).toLocaleString() : "TBD"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-400 block">Check-out</span>
                                                    <span className="font-semibold text-zinc-800">
                                                        {travelDetails.accommodation.checkOut ? new Date(travelDetails.accommodation.checkOut).toLocaleString() : "TBD"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400">No accommodation reserved yet (To Be Decided).</p>
                                    )}
                                </div>
                            </div>

                            {/* Info & Documents */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                                        <Globe className="text-zinc-500" size={18} />
                                        Local Info
                                    </h3>
                                    <div className="border border-zinc-200 rounded-lg p-3 space-y-1.5 text-xs text-zinc-650">
                                        <div className="flex justify-between">
                                            <span>Currency</span>
                                            <span className="font-semibold">{travelDetails?.localInfo?.currency || "TBD"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>TimeZone</span>
                                            <span className="font-semibold">{travelDetails?.localInfo?.timeZone || "TBD"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Language</span>
                                            <span className="font-semibold truncate max-w-[150px]">{travelDetails?.localInfo?.language || "TBD"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                                        <ShieldAlert className="text-zinc-500" size={18} />
                                        Emergency Contact
                                    </h3>
                                    <div className="border border-zinc-200 rounded-lg p-3 space-y-1.5 text-xs text-zinc-650">
                                        {travelDetails?.emergencyContact?.name ? (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Name</span>
                                                    <span className="font-semibold">{travelDetails.emergencyContact.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Phone</span>
                                                    <span className="font-semibold">{travelDetails.emergencyContact.phone}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-zinc-400 py-2">No emergency contacts set.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "tasks" && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 mb-2">Pre-Trip Tasks Checklist</h3>
                            {tasks && tasks.length > 0 ? (
                                <div className="border border-zinc-200 rounded-lg overflow-hidden divide-y">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="flex items-center gap-3 p-3.5 hover:bg-zinc-50 transition-colors">
                                            {task.done ? (
                                                <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
                                            ) : (
                                                <Circle className="text-zinc-300 shrink-0" size={18} />
                                            )}
                                            <span className={`text-sm ${task.done ? "line-through text-zinc-400" : "text-zinc-800 font-medium"}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-500">
                                    No tasks added to this trip.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Inline CSS animation for slide-in */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    )
}

export default TripDetailsDrawer
