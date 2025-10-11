export default function PurchaseButton({ onClick, children = "Purchase" }) {
    return (
        <button
            className="
                relative
                bg-gradient-radial from-green-300 via-green-500 to-green-700
                hover:from-green-200 hover:via-green-400 hover:to-green-600
                active:from-green-400 active:via-green-600 active:to-green-800
                border border-green-800
                text-white font-bold text-lg
                px-8 py-4
                rounded-lg
                shadow-lg shadow-black/30
                hover:shadow-xl hover:shadow-black/40
                active:shadow-md active:shadow-black/50
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all duration-150 ease-in-out
                inline-flex items-center gap-3
                overflow-hidden
            "
            onClick={onClick}
        >
            {/* Glossy overlay effect */}
            <div className="
                absolute top-0 left-0 right-0 h-1/2
                bg-gradient-to-b from-white/30 to-transparent
                rounded-t-lg
            "></div>

            <span className="relative z-10">{children}</span>

            <div className="
                relative z-10
                w-10 h-10
                bg-gradient-to-b from-white/10 to-white/5
                rounded-full
                flex items-center justify-center
                shadow-inset
                border border-black/20
                backdrop-blur-sm
            ">
                <span className="text-white text-xl font-bold">$</span>
            </div>
        </button>
    )
}
