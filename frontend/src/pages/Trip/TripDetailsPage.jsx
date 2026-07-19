import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getTripById } from "../../utils/storage.js"
import { ArrowLeft, Calendar, MapPin, Plane, Bed, ShieldAlert, Globe, CheckCircle2, Circle } from "lucide-react"

const TripDetailsPage = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true)
            const data = await getTripById(tripId)
            setTrip(data)
            setLoading(false)
        }
        fetchDetails()
    }, [tripId])

    if (loading) {
        return (
            <div className="p-8 text-center bg-white border border-zinc-200 rounded-xl">
                <p className="text-zinc-550 font-semibold">Loading trip details...</p>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="p-8 text-center bg-white border border-zinc-200 rounded-xl space-y-4">
                <p className="text-zinc-550 font-medium">Trip not found.</p>
                <Link to="/dashboard/trips/all" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={16} /> Back to Trips
                </Link>
            </div>
        )
    }

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

    const transportMode = travelDetails?.transportMode || "flight"

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200"
            case "in_progress":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "planning":
                return "bg-amber-50 text-amber-700 border-amber-200"
            default:
                return "bg-zinc-50 text-zinc-650 border-zinc-200"
        }
    }

    const formatStatus = (status) => {
        return status.replace("_", " ").toUpperCase()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Navigation */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 font-semibold transition-colors cursor-pointer"
            >
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>

            {/* Main Details Card */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusStyle(status)}`}>
                                {formatStatus(status)}
                            </span>
                            <span className="text-xs text-zinc-500 font-medium">
                                {durationDays} Days Trip
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-955 flex items-center gap-2">
                            <MapPin className="text-zinc-500 shrink-0" size={28} />
                            {destination}
                        </h1>
                        <p className="text-sm text-zinc-550 mt-2 flex items-center gap-1.5 font-medium">
                            <Calendar size={15} />
                            {startDate} to {endDate}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 px-6 bg-zinc-50 overflow-x-auto">
                    {["overview", "itinerary", "travel details", "tasks"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3.5 px-4 text-sm font-semibold capitalize border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === tab
                                ? "border-zinc-900 text-zinc-900"
                                : "border-transparent text-zinc-500 hover:text-zinc-950"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {/* Budget summary */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 mb-3">Budget Summary</h3>
                                <div className="border border-zinc-200 rounded-lg p-5 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg">
                                            <span className="text-xs text-zinc-500 block font-medium">Total Budget</span>
                                            <span className="text-2xl font-extrabold text-zinc-950">₹{budget.total.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg">
                                            <span className="text-xs text-zinc-500 block font-medium">Spent Amount</span>
                                            <span className="text-2xl font-extrabold text-zinc-950">₹{budget.spent.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Breakdown bars */}
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Breakdown</h4>
                                        <div className="space-y-3">
                                            {budget.breakdown.map((item) => (
                                                <div key={item.category} className="space-y-1.5">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className="text-zinc-600">{item.category}</span>
                                                        <span className="font-bold text-zinc-900">₹{item.amount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-zinc-950 h-full rounded-full"
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
                                <h3 className="text-sm font-bold text-zinc-900 mb-3">Travelers</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {travelers.map((t) => (
                                        <div key={t.id} className="flex items-center gap-3 p-4 border border-zinc-200 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-sm capitalize">
                                                {t.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-zinc-900">{t.name}</div>
                                                <div className="text-xs text-zinc-500 font-medium capitalize">{t.role}</div>
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
                                <div className="relative border-l border-zinc-200 ml-4 pl-8 space-y-8">
                                    {itinerary.map((item) => (
                                        <div key={item.day} className="relative">
                                            {/* dot */}
                                            <span className={`absolute left-[-41px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white ${item.status === "completed" ? "bg-emerald-550" : "bg-zinc-300"
                                                }`} />
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                                                        Day {item.day} - {item.date}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.status === "completed"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                        }`}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-zinc-950 mt-1">{item.title}</h4>
                                                <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">{item.description}</p>

                                                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                                                    <span className="flex items-center gap-1 font-semibold bg-zinc-50 px-2 py-1 rounded-sm border border-zinc-200">
                                                        <MapPin size={12} /> {item.location}
                                                    </span>
                                                    <span>Budget: ₹{item.budget.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-zinc-500 font-medium">
                                    No itinerary items planned yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "travel details" && (
                        <div className="space-y-8">
                            {/* Travel Info */}
                            {transportMode !== "none" && (
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
                                        <Plane className="text-zinc-500" size={20} />
                                        {(() => {
                                            switch (transportMode) {
                                                case "train": return "Train Bookings"
                                                case "bus": return "Bus Bookings"
                                                case "car": return "Car / Road Trip Details"
                                                default: return "Flight Reservations"
                                            }
                                        })()}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Outbound */}
                                        <div className="border border-zinc-200 rounded-lg p-5">
                                            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">
                                                Outbound {transportMode === "car" ? "Journey" : transportMode === "flight" ? "Flight" : transportMode === "train" ? "Train" : "Bus"}
                                            </h4>
                                            {travelDetails?.outboundFlight ? (
                                                <div className="space-y-2">
                                                    <div className="text-base font-bold text-zinc-900">
                                                        {travelDetails.outboundFlight.airline}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 font-semibold uppercase">
                                                        {transportMode === "flight" ? "Flight" : transportMode === "train" ? "Train No" : transportMode === "bus" ? "Ticket No" : "Vehicle No"}: {travelDetails.outboundFlight.flightNumber}
                                                    </div>
                                                    <div className="flex justify-between text-sm text-zinc-650 pt-2 border-t border-zinc-100">
                                                        <span>Route</span>
                                                        <span className="font-bold text-zinc-900">{travelDetails.outboundFlight.from} ➔ {travelDetails.outboundFlight.to}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-zinc-600">
                                                        <span>Departure</span>
                                                        <span className="font-medium text-zinc-900">{new Date(travelDetails.outboundFlight.departure).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-zinc-400">No outbound travel details booked.</p>
                                            )}
                                        </div>

                                        {/* Return */}
                                        <div className="border border-zinc-200 rounded-lg p-5">
                                            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">
                                                Return {transportMode === "car" ? "Journey" : transportMode === "flight" ? "Flight" : transportMode === "train" ? "Train" : "Bus"}
                                            </h4>
                                            {travelDetails?.returnFlight ? (
                                                <div className="space-y-2">
                                                    <div className="text-base font-bold text-zinc-900">
                                                        {travelDetails.returnFlight.airline}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 font-semibold uppercase">
                                                        {transportMode === "flight" ? "Flight" : transportMode === "train" ? "Train No" : transportMode === "bus" ? "Ticket No" : "Vehicle No"}: {travelDetails.returnFlight.flightNumber}
                                                    </div>
                                                    <div className="flex justify-between text-sm text-zinc-650 pt-2 border-t border-zinc-100">
                                                        <span>Route</span>
                                                        <span className="font-bold text-zinc-900">{travelDetails.returnFlight.from} ➔ {travelDetails.returnFlight.to}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-zinc-600">
                                                        <span>Departure</span>
                                                        <span className="font-medium text-zinc-900">{new Date(travelDetails.returnFlight.departure).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-zinc-400">No return travel details booked.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Accommodation */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
                                    <Bed className="text-zinc-550" size={20} />
                                    Accommodation
                                </h3>
                                <div className="border border-zinc-200 rounded-lg p-5">
                                    {travelDetails?.accommodation && travelDetails.accommodation.name !== "TBD" ? (
                                        <div className="space-y-3">
                                            <div className="text-lg font-bold text-zinc-900">{travelDetails.accommodation.name}</div>
                                            <p className="text-sm text-zinc-500 leading-relaxed">{travelDetails.accommodation.address}</p>
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-100 text-xs">
                                                <div>
                                                    <span className="text-zinc-400 block font-semibold uppercase">Check-in</span>
                                                    <span className="font-bold text-zinc-800 text-sm">
                                                        {travelDetails.accommodation.checkIn ? new Date(travelDetails.accommodation.checkIn).toLocaleString() : "TBD"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-400 block font-semibold uppercase">Check-out</span>
                                                    <span className="font-bold text-zinc-800 text-sm">
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
                                    <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
                                        <Globe className="text-zinc-500" size={20} />
                                        Local Info
                                    </h3>
                                    <div className="border border-zinc-200 rounded-lg p-4 space-y-2 text-sm text-zinc-600">
                                        <div className="flex justify-between">
                                            <span>Currency</span>
                                            <span className="font-bold text-zinc-900">{travelDetails?.localInfo?.currency || "TBD"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>TimeZone</span>
                                            <span className="font-bold text-zinc-900">{travelDetails?.localInfo?.timeZone || "TBD"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Language</span>
                                            <span className="font-bold text-zinc-900 truncate max-w-[200px]">{travelDetails?.localInfo?.language || "TBD"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
                                        <ShieldAlert className="text-zinc-500" size={20} />
                                        Emergency Contact
                                    </h3>
                                    <div className="border border-zinc-200 rounded-lg p-4 space-y-2 text-sm text-zinc-600">
                                        {travelDetails?.emergencyContact?.name ? (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Name</span>
                                                    <span className="font-bold text-zinc-900">{travelDetails.emergencyContact.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Phone</span>
                                                    <span className="font-bold text-zinc-900">{travelDetails.emergencyContact.phone}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-zinc-400 py-3">No emergency contacts set.</p>
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
                                        <div key={task.id} className="flex items-center gap-3.5 p-4 hover:bg-zinc-50 transition-colors">
                                            {task.done ? (
                                                <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                                            ) : (
                                                <Circle className="text-zinc-300 shrink-0" size={20} />
                                            )}
                                            <span className={`text-sm ${task.done ? "line-through text-zinc-400" : "text-zinc-900 font-bold"}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-zinc-500 font-medium">
                                    No tasks added to this trip.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TripDetailsPage
