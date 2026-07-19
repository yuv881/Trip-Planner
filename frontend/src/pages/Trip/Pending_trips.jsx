import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getTrips } from "../../utils/storage.js"
import TripCard from "../../components/TripCard.jsx"

const Pending_trips = () => {
    const navigate = useNavigate()
    const [trips, setTrips] = useState([])

    useEffect(() => {
        const fetchAndSetTrips = async () => {
            const data = await getTrips()
            setTrips(data.filter((t) => t.status !== "completed"))
        }
        fetchAndSetTrips()
    }, [])

    return (
        <div className="space-y-6">
            {trips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onClick={() => navigate(`/dashboard/trip/${trip.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-400 font-semibold border border-dashed border-zinc-200 rounded-xl bg-white shadow-xs">
                    No records available
                </div>
            )}
        </div>
    )
}

export default Pending_trips
