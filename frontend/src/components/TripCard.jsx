const destinationImages = {
    "Goa, India": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "Jaipur, Rajasthan": "https://images.unsplash.com/photo-1477584322902-4872358c733a?auto=format&fit=crop&w=600&q=80",
    "Manali, Himachal Pradesh": "https://images.unsplash.com/photo-1589136775597-96f3a58f4070?auto=format&fit=crop&w=600&q=80",
    "Kerala Backwaters, Alleppey": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    "Indore, Madhya Pradesh": "https://res.cloudinary.com/daozrkyox/image/upload/f_auto,q_auto/v1784458891/IMG_E0644_tgniug.jpg",
}

const defaultImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"

const TripCard = ({ trip, onClick }) => {
    const { destination, startDate, endDate, durationDays, status, budget, travelers, coverImage } = trip

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return "text-emerald-700 bg-emerald-50 border-emerald-150"
            case "in_progress":
                return "text-blue-700 bg-blue-50 border-blue-150"
            case "planning":
                return "text-amber-700 bg-amber-50 border-amber-150"
            default:
                return "text-zinc-600 bg-zinc-50 border-zinc-150"
        }
    }

    const imageUrl = coverImage || destinationImages[destination] || defaultImage

    return (
        <div
            onClick={onClick}
            className="group bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* Image Header */}
            <div className="h-36 w-full overflow-hidden bg-zinc-100 relative shrink-0">
                <img
                    src={imageUrl}
                    alt={destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 uppercase tracking-wider backdrop-blur-md ${getStatusStyle(status)}`}>
                    {status.replace("_", " ")}
                </span>
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-zinc-900 text-base leading-tight group-hover:text-zinc-650 transition-colors">
                        {destination}
                    </h3>
                    <p className="text-xs text-zinc-400 font-semibold">
                        {startDate} — {endDate} • {durationDays} days
                    </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-zinc-100 text-xs">
                    <div className="flex justify-between">
                        <span className="text-zinc-400 font-medium">Budget Spent</span>
                        <span className="font-semibold text-zinc-900">
                            ₹{budget.spent.toLocaleString()} <span className="text-zinc-400 font-normal">/ ₹{budget.total.toLocaleString()}</span>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400 font-medium">Travelers</span>
                        <span className="font-semibold text-zinc-900">{travelers.length} {travelers.length === 1 ? "person" : "people"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TripCard
