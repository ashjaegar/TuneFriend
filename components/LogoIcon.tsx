export default function LogoIcon({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 275 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Circle with music note */}
            <circle cx="137.5" cy="66" r="32" stroke="currentColor" strokeWidth="3" fill="none" />

            {/* Music note */}
            <g transform="translate(130, 50)">
                <rect x="0" y="0" width="3" height="24" fill="currentColor" />
                <rect x="12" y="0" width="3" height="24" fill="currentColor" />
                <ellipse cx="1.5" cy="24" rx="5" ry="3.5" fill="currentColor" />
                <ellipse cx="13.5" cy="24" rx="5" ry="3.5" fill="currentColor" />
                <path d="M 3 0 L 15 0" stroke="currentColor" strokeWidth="3" />
            </g>

            {/* Left earbud */}
            <g transform="translate(70, 40)">
                <rect x="0" y="0" width="16" height="24" rx="8" fill="currentColor" />
                <rect x="3" y="3" width="10" height="18" rx="5" fill="#000000" />
            </g>

            {/* Right earbud */}
            <g transform="translate(189, 40)">
                <rect x="0" y="0" width="16" height="24" rx="8" fill="currentColor" />
                <rect x="3" y="3" width="10" height="18" rx="5" fill="#000000" />
            </g>

            {/* Left wire to circle */}
            <path
                d="M 86 50 Q 100 45, 105.5 66"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
            />

            {/* Right wire to circle */}
            <path
                d="M 189 50 Q 175 45, 169.5 66"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
            />

            {/* Bottom left wire */}
            <path
                d="M 105.5 98 Q 90 115, 100 130"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
            />

            {/* Bottom right wire */}
            <path
                d="M 169.5 98 Q 185 115, 175 130"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
            />

            {/* Bottom connector wire */}
            <path
                d="M 100 130 Q 137.5 145, 175 130"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
            />

            {/* Wire end dots */}
            <circle cx="100" cy="130" r="3.5" fill="currentColor" />
            <circle cx="175" cy="130" r="3.5" fill="currentColor" />
        </svg>
    );
}
