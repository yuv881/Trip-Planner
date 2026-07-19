import { useState } from "react"
import { X, Plus, Trash2, MapPin, Plane, Bed, Check, FileText, Image as ImageIcon } from "lucide-react"
import { saveTrip } from "../../utils/storage.js"

const TripCreationModal = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1)

    // Step 1: General
    const [destination, setDestination] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [status, setStatus] = useState("planning")
    const [coverImage, setCoverImage] = useState("")
    const [uploading, setUploading] = useState(false)

    // Step 2: Travel & Stay Details
    const [transportMode, setTransportMode] = useState("flight") // flight, train, bus, car, none
    const [outboundAirline, setOutboundAirline] = useState("")
    const [outboundFlightNumber, setOutboundFlightNumber] = useState("")
    const [outboundFrom, setOutboundFrom] = useState("")
    const [outboundTo, setOutboundTo] = useState("")
    const [outboundDeparture, setOutboundDeparture] = useState("")

    const [returnAirline, setReturnAirline] = useState("")
    const [returnFlightNumber, setReturnFlightNumber] = useState("")
    const [returnFrom, setReturnFrom] = useState("")
    const [returnTo, setReturnTo] = useState("")
    const [returnDeparture, setReturnDeparture] = useState("")

    const [hotelName, setHotelName] = useState("")
    const [hotelAddress, setHotelAddress] = useState("")
    const [hotelCheckIn, setHotelCheckIn] = useState("")
    const [hotelCheckOut, setHotelCheckOut] = useState("")

    // Step 3: Budget
    const [totalBudget, setTotalBudget] = useState(10000)
    const [budgetBreakdown, setBudgetBreakdown] = useState([
        { category: "Accommodation", amount: 0 },
        { category: "Food & dining", amount: 0 },
        { category: "Activities & attractions", amount: 0 },
        { category: "Transportation", amount: 0 },
        { category: "Other", amount: 0 }
    ])
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newCategoryAmount, setNewCategoryAmount] = useState(0)

    // Step 4: Travelers
    const [travelers, setTravelers] = useState([{ id: "organizer", name: "You", role: "organizer" }])
    const [newTravelerName, setNewTravelerName] = useState("")
    const [newTravelerRole, setNewTravelerRole] = useState("member")

    // Step 5: Itinerary
    const [itineraryList, setItineraryList] = useState([])
    const [itineraryDay, setItineraryDay] = useState(1)
    const [itineraryTitle, setItineraryTitle] = useState("")
    const [itineraryDesc, setItineraryDesc] = useState("")
    const [itineraryLocation, setItineraryLocation] = useState("")
    const [itineraryBudget, setItineraryBudget] = useState(0)
    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("image", file)

        try {
            const res = await fetch("http://localhost:5000/api/trips/upload", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if (res.ok) {
                setCoverImage(data.url)
            } else {
                alert(data.message || "Failed to upload image")
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Error uploading image")
        } finally {
            setUploading(false)
        }
    }

    if (!isOpen) return null

    const handleAddTraveler = (e) => {
        e.preventDefault()
        if (!newTravelerName.trim()) return
        const newTraveler = {
            id: `user_${Date.now()}`,
            name: newTravelerName.trim(),
            role: newTravelerRole
        }
        setTravelers([...travelers, newTraveler])
        setNewTravelerName("")
    }

    const handleRemoveTraveler = (id) => {
        if (id === "organizer") return
        setTravelers(travelers.filter(t => t.id !== id))
    }

    const handleAddItineraryItem = (e) => {
        e.preventDefault()
        if (!itineraryTitle.trim()) return

        // Calculate date based on day number and startDate
        let dateStr = startDate
        if (startDate && Number(itineraryDay) > 1) {
            const dateObj = new Date(startDate)
            dateObj.setDate(dateObj.getDate() + (Number(itineraryDay) - 1))
            dateStr = dateObj.toISOString().split('T')[0]
        }

        const newItem = {
            day: Number(itineraryDay),
            date: dateStr,
            title: itineraryTitle.trim(),
            description: itineraryDesc.trim(),
            location: itineraryLocation.trim() || destination,
            budget: Number(itineraryBudget),
            status: "pending"
        }

        // Sort itinerary items by day when adding
        setItineraryList([...itineraryList, newItem].sort((a, b) => a.day - b.day))
        setItineraryTitle("")
        setItineraryDesc("")
        setItineraryLocation("")
        setItineraryBudget(0)
    }

    const handleRemoveItineraryItem = (index) => {
        setItineraryList(itineraryList.filter((_, idx) => idx !== index))
    }

    const getProgressValue = (status) => {
        switch (status) {
            case "completed": return 100
            case "in_progress": return 60
            case "planning": return 35
            default: return 0
        }
    }

    const handleSubmit = async () => {
        const durationDays = (startDate && endDate)
            ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
            : 1

        let breakdown = budgetBreakdown
        const sumBreakdown = budgetBreakdown.reduce((acc, cat) => acc + cat.amount, 0)
        if (breakdown.length === 0 || sumBreakdown === 0) {
            const dividedAmount = Math.round(Number(totalBudget) / 5)
            breakdown = [
                { category: "Accommodation", amount: dividedAmount },
                { category: "Food & dining", amount: dividedAmount },
                { category: "Activities & attractions", amount: dividedAmount },
                { category: "Transportation", amount: dividedAmount },
                { category: "Other", amount: dividedAmount }
            ]
        }

        // Build outboundFlight details if entered
        const outboundFlight = outboundAirline ? {
            airline: outboundAirline,
            flightNumber: outboundFlightNumber,
            from: outboundFrom,
            to: outboundTo,
            departure: outboundDeparture
        } : null

        // Build returnFlight details if entered
        const returnFlight = returnAirline ? {
            airline: returnAirline,
            flightNumber: returnFlightNumber,
            from: returnFrom,
            to: returnTo,
            departure: returnDeparture
        } : null

        const newTrip = {
            id: `trip_${Date.now()}`,
            destination: destination.trim() || "Unnamed Trip",
            coverImage,
            startDate: startDate || "TBD",
            endDate: endDate || "TBD",
            durationDays,
            status,
            progress: getProgressValue(status),
            budget: {
                total: Number(totalBudget),
                currency: "INR",
                spent: status === "completed" ? Number(totalBudget) : Math.round(Number(totalBudget) * 0.2),
                breakdown
            },
            travelers,
            travelDetails: {
                transportMode,
                outboundFlight,
                returnFlight,
                accommodation: hotelName ? {
                    name: hotelName,
                    address: hotelAddress,
                    checkIn: hotelCheckIn || null,
                    checkOut: hotelCheckOut || null
                } : { name: "TBD", address: "", checkIn: null, checkOut: null },
                documents: {
                    idProofValid: true,
                    visaRequired: false,
                    travelInsurance: false
                },
                emergencyContact: {
                    name: travelers[1]?.name || travelers[0]?.name || "",
                    phone: ""
                },
                localInfo: {
                    currency: "INR",
                    timeZone: "IST (UTC+5:30)",
                    language: "Hindi, English"
                }
            },
            itinerary: itineraryList,
            tasks: []
        }

        await saveTrip(newTrip)
        onSuccess()
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden m-4 border border-zinc-200">
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-950">Create New Trip</h2>
                        <p className="text-xs text-zinc-500 mt-0.5">Step {step} of 6</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-zinc-205 rounded-lg text-zinc-400 hover:text-zinc-650 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-zinc-100 h-1">
                    <div
                        className="bg-zinc-950 h-full transition-all duration-300"
                        style={{ width: `${(step / 6) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 border-b pb-1">General Details</h3>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Shimla, Goa, Indore"
                                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg text-sm focus:border-zinc-955 focus:outline-hidden"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:border-zinc-955 focus:outline-hidden"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:border-zinc-955 focus:outline-hidden"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:border-zinc-955 focus:outline-hidden bg-white"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="planning">Planning (Draft)</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="not_started">Not Started (Upcoming)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Trip Cover Image</label>
                                {coverImage ? (
                                    <div className="relative rounded-xl overflow-hidden border border-zinc-200 aspect-video group">
                                        <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => setCoverImage("")}
                                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/85 text-white p-1 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:border-zinc-450 rounded-xl p-6 cursor-pointer bg-zinc-50/50 hover:bg-zinc-50 transition-all">
                                        <ImageIcon className="text-zinc-400 mb-2" size={24} />
                                        <span className="text-xs font-semibold text-zinc-650">
                                            {uploading ? "Uploading banner..." : "Upload Trip Banner Image"}
                                        </span>
                                        <span className="text-[10px] text-zinc-400 mt-0.5">Supports PNG, JPG, WEBP</span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageUpload} 
                                            className="hidden" 
                                            disabled={uploading}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (() => {
                        const getLabels = () => {
                            switch (transportMode) {
                                case "train":
                                    return { title: "Train", carrier: "Train Name (e.g. Rajdhani)", id: "Train Number (e.g. 12951)", from: "From Station", to: "To Station" }
                                case "bus":
                                    return { title: "Bus", carrier: "Bus Operator (e.g. Zingbus)", id: "Ticket / Seat No.", from: "Boarding Point", to: "Drop Point" }
                                case "car":
                                    return { title: "Car/Cab", carrier: "Vehicle Info (e.g. Zoomcar Swift)", id: "License Plate / Driver", from: "Origin", to: "Destination" }
                                default:
                                    return { title: "Flight", carrier: "Airline (e.g. Indigo)", id: "Flight Number (e.g. 6E 234)", from: "From Airport", to: "To Airport" }
                            }
                        }
                        const labels = getLabels()

                        return (
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-zinc-900 border-b pb-1">Travel & Stay Details</h3>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mode of Transport</label>
                                    <select
                                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:border-zinc-955 focus:outline-hidden bg-white font-medium text-zinc-700"
                                        value={transportMode}
                                        onChange={(e) => setTransportMode(e.target.value)}
                                    >
                                        <option value="flight">Flight</option>
                                        <option value="train">Train</option>
                                        <option value="bus">Bus</option>
                                        <option value="car">Car / Road Trip</option>
                                        <option value="none">No Transport / Local Stay Only</option>
                                    </select>
                                </div>

                                {transportMode !== "none" && (
                                    <>
                                        {/* Outbound */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                                                <Plane size={14} /> Outbound {labels.title}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text" placeholder={labels.carrier}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={outboundAirline} onChange={(e) => setOutboundAirline(e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder={labels.id}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={outboundFlightNumber} onChange={(e) => setOutboundFlightNumber(e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder={labels.from}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={outboundFrom} onChange={(e) => setOutboundFrom(e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder={labels.to}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={outboundTo} onChange={(e) => setOutboundTo(e.target.value)}
                                                />
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Departure Date & Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                        value={outboundDeparture} onChange={(e) => setOutboundDeparture(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Return */}
                                        <div className="space-y-3 pt-2 border-t">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                                                <Plane size={14} className="rotate-180" /> Return {labels.title}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text" placeholder={labels.carrier}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={returnAirline} onChange={(e) => setReturnAirline(e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder={labels.id}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={returnFlightNumber} onChange={(e) => setReturnFlightNumber(e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder={labels.from}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={returnFrom} onChange={(e) => setReturnFrom(e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder={labels.to}
                                                    className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                    value={returnTo} onChange={(e) => setReturnTo(e.target.value)}
                                                />
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Departure Date & Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                        value={returnDeparture} onChange={(e) => setReturnDeparture(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Stay Reservation */}
                                <div className="space-y-3 pt-2 border-t">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Bed size={14} /> Accommodation
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text" placeholder="Hotel Name"
                                            className="col-span-2 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                            value={hotelName} onChange={(e) => setHotelName(e.target.value)}
                                        />
                                        <input
                                            type="text" placeholder="Hotel Address"
                                            className="col-span-2 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                            value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)}
                                        />
                                        <div>
                                            <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Check-in</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                value={hotelCheckIn} onChange={(e) => setHotelCheckIn(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Check-out</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                                value={hotelCheckOut} onChange={(e) => setHotelCheckOut(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}

                    {step === 3 && (() => {
                        const allocatedSum = budgetBreakdown.reduce((acc, b) => acc + b.amount, 0)
                        const remaining = totalBudget - allocatedSum
                        const percent = totalBudget > 0 ? Math.min(Math.round((allocatedSum / totalBudget) * 100), 100) : 0

                        const handleAddCategory = (e) => {
                            e.preventDefault()
                            if (!newCategoryName.trim()) return

                            const newCat = {
                                category: newCategoryName.trim(),
                                amount: Number(newCategoryAmount) || 0
                            }
                            setBudgetBreakdown([...budgetBreakdown, newCat])
                            setNewCategoryName("")
                            setNewCategoryAmount(0)
                        }

                        const handleRemoveCategory = (index) => {
                            setBudgetBreakdown(budgetBreakdown.filter((_, idx) => idx !== index))
                        }

                        const handleUpdateAmount = (index, value) => {
                            const updated = [...budgetBreakdown]
                            updated[index].amount = Number(value) || 0
                            setBudgetBreakdown(updated)
                        }

                        return (
                            <div className="space-y-5">
                                {/* Total Budget Input Card */}
                                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Travel Budget</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3.5 font-extrabold text-lg text-zinc-400">₹</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-2 border-0 bg-transparent text-xl font-extrabold text-zinc-950 focus:outline-hidden focus:ring-0"
                                            value={totalBudget}
                                            onChange={(e) => setTotalBudget(Number(e.target.value))}
                                            placeholder="Enter total budget"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Allocation Progress Meter */}
                                <div className="space-y-2 px-1">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-zinc-500">Allocation Status</span>
                                        <span className={allocatedSum > totalBudget ? "text-rose-600 font-bold" : "text-zinc-700"}>
                                            ₹{allocatedSum.toLocaleString()} / ₹{totalBudget.toLocaleString()} ({percent}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-100 border border-zinc-200/50 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${allocatedSum > totalBudget ? "bg-rose-500" : allocatedSum === totalBudget ? "bg-emerald-500" : "bg-zinc-800"
                                                }`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        {remaining > 0 ? (
                                            <span className="text-zinc-450">₹{remaining.toLocaleString()} remaining to allocate</span>
                                        ) : remaining === 0 ? (
                                            <span className="text-emerald-600 flex items-center gap-1">✓ Budget fully allocated</span>
                                        ) : (
                                            <span className="text-rose-600 animate-pulse">⚠ Exceeded budget by ₹{Math.abs(remaining).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Category Allocation List */}
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-1">Category Breakdown</div>
                                    <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-150 overflow-hidden max-h-56 overflow-y-auto bg-white">
                                        {budgetBreakdown.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-3 p-3 hover:bg-zinc-50/50 transition-colors">
                                                <span className="font-bold text-zinc-800 text-xs truncate max-w-[150px]">{item.category}</span>
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    <span className="text-zinc-400 text-xs">₹</span>
                                                    <input
                                                        type="number"
                                                        className="w-20 px-2 py-1 border border-zinc-200 rounded-md focus:outline-hidden bg-white text-right text-xs font-bold text-zinc-900"
                                                        value={item.amount || ""}
                                                        onChange={(e) => handleUpdateAmount(idx, e.target.value)}
                                                        placeholder="0"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCategory(idx)}
                                                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Compact Custom Category Inline Form */}
                                <form onSubmit={handleAddCategory} className="flex gap-2 items-center bg-zinc-50 p-2 border border-zinc-200 rounded-xl">
                                    <input
                                        type="text" placeholder="Add Custom Category (e.g. Shopping)"
                                        className="flex-1 px-3 py-1.5 border border-zinc-200 bg-white rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden font-medium"
                                        value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                                    />
                                    <input
                                        type="number" placeholder="₹0"
                                        className="w-16 px-2 py-1.5 border border-zinc-200 bg-white rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden text-right font-bold"
                                        value={newCategoryAmount || ""} onChange={(e) => setNewCategoryAmount(Number(e.target.value))}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-zinc-900 hover:bg-zinc-800 text-white p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                                        title="Add Custom Category"
                                    >
                                        <Plus size={15} />
                                    </button>
                                </form>
                            </div>
                        )
                    })()}

                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 border-b pb-1">Travelers & Roles</h3>

                            <form onSubmit={handleAddTraveler} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Traveler Name"
                                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                    value={newTravelerName}
                                    onChange={(e) => setNewTravelerName(e.target.value)}
                                />
                                <select
                                    className="px-2 py-2 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden bg-white"
                                    value={newTravelerRole}
                                    onChange={(e) => setNewTravelerRole(e.target.value)}
                                >
                                    <option value="member">Member</option>
                                    <option value="organizer">Organizer</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-zinc-900 text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                                >
                                    <Plus size={16} />
                                </button>
                            </form>

                            <div className="space-y-2 max-h-40 overflow-y-auto pt-2">
                                {travelers.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-150 rounded-lg text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-900">{t.name}</span>
                                            <span className="text-[10px] text-zinc-400 capitalize bg-white border px-1.5 py-0.5 rounded-sm font-bold">
                                                {t.role}
                                            </span>
                                        </div>
                                        {t.id !== "organizer" && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTraveler(t.id)}
                                                className="text-rose-500 hover:text-rose-700 transition-colors p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 border-b pb-1 flex items-center gap-1">
                                <FileText size={16} /> Add Daily Itinerary
                            </h3>

                            <form onSubmit={handleAddItineraryItem} className="space-y-3 p-3 bg-zinc-50 rounded-xl border border-zinc-250">
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Day</label>
                                        <input
                                            type="number" min="1"
                                            className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden bg-white"
                                            value={itineraryDay} onChange={(e) => setItineraryDay(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Activity Title</label>
                                        <input
                                            type="text" placeholder="e.g. Phoenix Mall, Old Church"
                                            className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                            value={itineraryTitle} onChange={(e) => setItineraryTitle(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Location</label>
                                        <input
                                            type="text" placeholder="e.g. Shimcha Island"
                                            className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                            value={itineraryLocation} onChange={(e) => setItineraryLocation(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Allocated Budget</label>
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden"
                                            value={itineraryBudget} onChange={(e) => setItineraryBudget(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Description</label>
                                    <textarea
                                        rows="2" placeholder="Describe the activity..."
                                        className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs focus:border-zinc-955 focus:outline-hidden resize-none"
                                        value={itineraryDesc} onChange={(e) => setItineraryDesc(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                    <Plus size={14} /> Add Day Plan
                                </button>
                            </form>

                            {/* Added Itinerary Items List */}
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {itineraryList.length > 0 ? (
                                    itineraryList.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-start p-3 bg-white border border-zinc-200 rounded-lg text-xs">
                                            <div>
                                                <span className="font-bold text-zinc-450 uppercase text-[9px]">Day {item.day} — {item.date}</span>
                                                <h5 className="font-bold text-zinc-900 mt-0.5">{item.title}</h5>
                                                <p className="text-zinc-500 mt-0.5 text-[11px] leading-tight">{item.description}</p>
                                                <span className="inline-block mt-1 font-semibold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-sm text-[10px]">
                                                    {item.location} • ₹{item.budget}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItineraryItem(idx)}
                                                className="text-rose-500 hover:text-rose-700 transition-colors p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-6 text-zinc-400 text-xs">No itinerary days added yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 border-b pb-1">Confirm Trip Details</h3>

                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3.5 text-xs text-zinc-650">
                                <div className="flex justify-between">
                                    <span className="font-medium text-zinc-400">Destination</span>
                                    <span className="font-bold text-zinc-900">{destination || "Not Specified"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-zinc-400">Duration</span>
                                    <span className="font-bold text-zinc-900">
                                        {startDate ? `${startDate} to ${endDate}` : "Dates Not Set"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-zinc-400">Status</span>
                                    <span className="font-bold text-zinc-900 capitalize">{status.replace("_", " ")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-zinc-400">Total Budget</span>
                                    <span className="font-bold text-zinc-900">₹{totalBudget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-zinc-400">Itinerary Items</span>
                                    <span className="font-bold text-zinc-900">{itineraryList.length} items</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-zinc-400">Travelers</span>
                                    <span className="font-bold text-zinc-900">{travelers.length} people</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <button
                        onClick={onClose}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-2">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-zinc-700"
                            >
                                Back
                            </button>
                        )}
                        {step < 6 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Check size={14} /> Create Trip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TripCreationModal
