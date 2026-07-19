import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import Trip_Filter from "../config/Trip_Page.json"
import TripCreationModal from "../components/Trip_creation/TripCreationModal.jsx"
import { Plus } from "lucide-react"

const Trip = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleSuccess = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return (
        <div className="w-full">
            {/* Header and buttons */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div className="flex gap-3 flex-wrap">
                    {Trip_Filter.map((item) => {
                        return (
                            <NavLink
                                key={item.label}
                                to={item.link}
                                className={({ isActive }) =>
                                    `px-4 py-2 border rounded-md cursor-pointer transition-colors text-sm font-semibold ${
                                        isActive
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        )
                    })}
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Create Trip</span>
                </button>
            </div>

            {/* active sub-page */}
            <div className="mt-4">
                <Outlet key={refreshKey} />
            </div>

            {/* Creation Modal */}
            <TripCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    )
}

export default Trip