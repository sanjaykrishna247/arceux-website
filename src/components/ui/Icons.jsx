// Hand-drawn 24px line icons, 1.5px stroke.
const P = {
  lidar: (
    <>
      <ellipse cx="12" cy="16" rx="7" ry="2.5" />
      <path d="M5 16v-4c0-1.4 3.1-2.5 7-2.5s7 1.1 7 2.5v4" />
      <path d="M8 12.5h8" />
      <path d="M17.5 5.5a8 8 0 0 1 3 3M15.5 3.5a11 11 0 0 1 6.5 4" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" />
    </>
  ),
  chip: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="1.5" />
      <path d="M7 7V4M11 7V4M15 7V4M7 20v-3M11 20v-3M15 20v-3" />
      <circle cx="17" cy="12" r="1.5" />
    </>
  ),
  motor: (
    <>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 10h3v4h-3M18 12h3M6 7v10M9 7v10" />
    </>
  ),
  driver: (
    <>
      <rect x="3" y="9" width="18" height="10" rx="1.5" />
      <path d="M6 9V5M9 9V5M12 9V5M15 9V5M18 9V5" />
      <path d="M7 14h4M14 13l2 2 2-2" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M21 10.5v3M11.5 9l-2.5 3.5h4L10.5 15" />
    </>
  ),
  screen: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M9 21h6M12 17v4M6.5 13.5l3-3 2 2 4-4" />
    </>
  ),
  wifi: (
    <>
      <path d="M3 9.5a13 13 0 0 1 18 0M6 12.8a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  imu: (
    <>
      <path d="M12 3v18M3 12h18" />
      <path d="M12 12l6-6" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  arm: (
    <>
      <path d="M4 21h8M6 21v-3h4v3" />
      <path d="M8 18l2-8 7-3" />
      <circle cx="10" cy="10" r="1.6" />
      <path d="M17 7l2.5-1 1 2.5-2.5 1z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.9 1.2-3 2.6-3S17 11.4 17 13v4" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </>
  ),
};

export default function Icon({ name, size = 24, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {P[name]}
    </svg>
  );
}
