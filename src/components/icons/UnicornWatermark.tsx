export function UnicornWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`opacity-5 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      {/* Unicorn body */}
      <ellipse cx="100" cy="130" rx="45" ry="35" fill="#5b6cf5" />
      
      {/* Unicorn head */}
      <ellipse cx="100" cy="80" rx="35" ry="30" fill="#5b6cf5" />
      
      {/* Horn */}
      <polygon points="100,35 95,65 105,65" fill="#ffd700" />
      
      {/* Horn spiral */}
      <path d="M 97 40 Q 103 45 97 50 Q 103 55 97 60" stroke="#ff69b4" strokeWidth="2" fill="none" />
      
      {/* Ears */}
      <ellipse cx="85" cy="70" rx="8" ry="15" fill="#5b6cf5" transform="rotate(-30 85 70)" />
      <ellipse cx="115" cy="70" rx="8" ry="15" fill="#5b6cf5" transform="rotate(30 115 70)" />
      
      {/* Eyes */}
      <circle cx="90" cy="80" r="4" fill="#ffffff" />
      <circle cx="110" cy="80" r="4" fill="#ffffff" />
      <circle cx="91" cy="81" r="2" fill="#000000" />
      <circle cx="111" cy="81" r="2" fill="#000000" />
      
      {/* Nostrils */}
      <ellipse cx="95" cy="90" rx="2" ry="1" fill="#ff69b4" />
      <ellipse cx="105" cy="90" rx="2" ry="1" fill="#ff69b4" />
      
      {/* Mane */}
      <path d="M 70 60 Q 60 50 65 40 Q 75 45 80 55" fill="#ff69b4" />
      <path d="M 75 50 Q 65 35 70 25 Q 80 30 85 45" fill="#9d4edd" />
      <path d="M 125 50 Q 135 35 130 25 Q 120 30 115 45" fill="#ff69b4" />
      <path d="M 130 60 Q 140 50 135 40 Q 125 45 120 55" fill="#9d4edd" />
      
      {/* Legs */}
      <rect x="75" y="155" width="8" height="25" fill="#5b6cf5" />
      <rect x="90" y="155" width="8" height="25" fill="#5b6cf5" />
      <rect x="102" y="155" width="8" height="25" fill="#5b6cf5" />
      <rect x="117" y="155" width="8" height="25" fill="#5b6cf5" />
      
      {/* Hooves */}
      <ellipse cx="79" cy="183" rx="6" ry="3" fill="#333333" />
      <ellipse cx="94" cy="183" rx="6" ry="3" fill="#333333" />
      <ellipse cx="106" cy="183" rx="6" ry="3" fill="#333333" />
      <ellipse cx="121" cy="183" rx="6" ry="3" fill="#333333" />
      
      {/* Tail */}
      <path d="M 145 120 Q 165 115 170 130 Q 160 140 150 135 Q 155 125 145 125" fill="#ff69b4" />
      <path d="M 150 125 Q 170 120 175 135 Q 165 145 155 140 Q 160 130 150 130" fill="#9d4edd" />
      
      {/* Magic sparkles */}
      <g fill="#ffd700" opacity="0.7">
        <polygon points="40,40 42,46 48,44 42,50 40,56 38,50 32,44 38,46" />
        <polygon points="160,50 162,56 168,54 162,60 160,66 158,60 152,54 158,56" />
        <polygon points="170,100 171,104 175,103 171,107 170,111 169,107 165,103 169,104" />
        <polygon points="30,120 31,124 35,123 31,127 30,131 29,127 25,123 29,124" />
      </g>
    </svg>
  );
}