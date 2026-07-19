import * as LucideIcons from "lucide-react"

const Metric_Card = ({ label, value, icon, description }) => {
    const IconComponent = typeof icon === "string" 
        ? (LucideIcons[icon] || LucideIcons.HelpCircle)
        : icon

    return (
        <div className="bg-white rounded-xl shadow-xs p-5 border border-zinc-200 hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-semibold text-zinc-500 tracking-wide uppercase">
                    {label}
                </h3>
                <p className="text-3xl font-extrabold text-zinc-900 mt-1.5">
                    {value}
                </p>
                {description && (
                    <p className="text-xs text-zinc-400 mt-1">
                        {description}
                    </p>
                )}
            </div>

            {IconComponent && (
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-650">
                    <IconComponent size={24} />
                </div>
            )}
        </div>
    )
}

export default Metric_Card