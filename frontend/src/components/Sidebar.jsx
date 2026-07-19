import * as LucideIcons from "lucide-react"
import { NavLink } from "react-router-dom"
import Sidebar_Items from "../config/SideBar_Items.json"

const Sidebar = ({ onClose }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {Sidebar_Items.map((item) => {
                const IconComponent = LucideIcons[item.icon] || LucideIcons.HelpCircle

                return (
                    <NavLink
                        to={item.link}
                        key={item.label}
                        end={item.link === '/dashboard'}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm font-medium
                            ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`
                        }
                    >
                        <IconComponent size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                )
            })}
        </div>
    )
}

export default Sidebar