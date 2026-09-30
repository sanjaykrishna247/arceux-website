// ─────────────────────────────────────────────────────────────
//  All editable site copy lives here.
//  Figures follow the design report "Design and Development of a
//  Multipurpose Mobile Robot for Material Handling and Inspection".
// ─────────────────────────────────────────────────────────────

export const links = {
  // The ARCEUX control platform (the "Platform" and "Try the live console" buttons open it).
  console: 'https://amr-controller-app.vercel.app/#/',
  // Paste the GitHub repo URL here; the footer link stays hidden while it is empty.
  repo: 'https://github.com/sanjaykrishna247/arceux-website',
  email: 'team.krenoviantz@gmail.com',
};

/** Props for a link: external URLs open in a new tab, in-page anchors do not. */
export const linkProps = (url) => (/^https?:/.test(url) ? { href: url, target: '_blank', rel: 'noreferrer' } : { href: url });

export const meta = {
  teamName: 'Team Krenoviantz',
};

// Smart India Hackathon 2026 problem statement this project answers.
export const problem = {
  id: '26112',
  title: 'Design and Develop a Modular Autonomous Mobile Robot (AMR) Platform for Smart Warehouse Automation',
  summary:
    'A universal AMR/AGV chassis that serves as a common mobile platform for warehouse automation and supports interchangeable attachments, balancing structural integrity, payload capacity, weight, modularity, manufacturability and ease of maintenance.',
  organization: 'Autodesk',
  department: 'Autodesk Education Experience',
  theme: 'Robotics and Drones',
  category: 'Hardware',
};

export const nav = [
  { id: 'product', label: 'Product' },
  { id: 'how', label: 'How it works' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'arm', label: 'Arm' },
  { id: 'software', label: 'Software' },
  { id: 'specs', label: 'Specs' },
  { id: 'team', label: 'Team' },
];

export const hero = {
  kicker: 'SMART INDIA HACKATHON 2026 · PROBLEM STATEMENT 26112 · AUTODESK',
  title: ['One robot.', 'Tow, map, inspect.'],
  subtitle:
    'A multipurpose autonomous mobile robot that hauls up to 150 kg, navigates factory floors with LiDAR SLAM, and inspects racks and machinery with a high-resolution camera on a 4-DOF arm.',
  ctaPrimary: 'Explore the robot',
  ctaSecondary: 'Open the platform',
  chips: [
    { key: 'battery', label: 'BATTERY', value: 86, unit: '%', decimals: 0, jitter: 0.4, status: 'ok' },
    { key: 'speed', label: 'SPEED', value: 0.5, unit: 'm/s', decimals: 2, jitter: 0.02 },
    { key: 'payload', label: 'PAYLOAD', value: 120, unit: 'kg', decimals: 0, jitter: 0 },
    { key: 'lidar', label: 'LIDAR', value: 7.6, unit: 'Hz', decimals: 1, jitter: 0.15 },
    { key: 'arm', label: 'ARM', text: 'RACK INSPECTION' },
    { key: 'nav', label: 'NAV2', text: 'PATH OK', status: 'ok' },
  ],
};

export const meet = {
  index: '01',
  label: 'Meet the robot',
  title: 'Material handling and inspection, in one platform.',
  lead:
    'Moving material and inspecting stock by hand takes a lot of labour, carries safety risks and does not adapt when the floor changes. Fixed automation is expensive to reconfigure. Industry 4.0 needs machines that can be re-tasked in minutes. This robot does both jobs.',
  columns: [
    {
      title: 'Intralogistics',
      tag: 'MOVE',
      items: ['Autonomous navigation', 'Payload towing up to 150 kg', 'Obstacle avoidance', 'Return to dock'],
    },
    {
      title: 'Inspection',
      tag: 'SEE',
      items: ['4-DOF camera arm', 'Rack and label reading', 'Gauge checks', 'Hazardous-zone surveillance'],
    },
  ],
  callouts: [
    {
      title: 'Arm & camera end-effector',
      body: 'Four joints put the camera anywhere in a 45 cm reach, from floor sweeps to 60 cm rack labels.',
      crop: 'arm',
    },
    {
      title: 'Control panel with E-stop',
      body: 'A hardware mushroom E-stop cuts drive power directly. The status display and charge port sit on the flank.',
      crop: 'panel',
    },
    {
      title: 'LiDAR and tow hook',
      body: 'A 360° RPLiDAR scans through the chassis gap. The rear hook couples a trolley in seconds.',
      crop: 'lidar',
    },
  ],
};

export const mission = {
  index: '02',
  label: 'How it works',
  title: 'Watch a mission run.',
  steps: [
    { title: 'Receive task', body: 'The operator queues a tow from the web console. The goal reaches the robot over rosbridge.' },
    { title: 'Localise & plan', body: 'SLAM Toolbox localises on the saved map, and the Nav2 global planner draws a path.' },
    { title: 'Navigate', body: 'The local controller follows the path, and the LiDAR costmap inflates around racks and obstacles.' },
    { title: 'Yield to people', body: 'A worker crosses the aisle. The robot slows, waits for a clear path, then resumes.' },
    { title: 'Tow & deliver', body: 'It couples the trolley, hauls it round the corner and releases it at the drop station.' },
    { title: 'Inspect', body: 'The arm lifts to rack height (60 cm labels) and the camera captures and reads the bin label.' },
    { title: 'Return to dock', body: 'Mission complete. The arm stows and the robot drives back to its dock to wait for the next task.' },
  ],
};

export const hardware = {
  index: '03',
  label: 'Hardware',
  title: 'Every layer, accounted for.',
  lead: 'Scroll to take the robot apart. Eight layers, from the inspection arm down to the castors.',
  layers: [
    { name: 'Inspection Arm', spec: '4-DOF · 45 cm reach · camera end-effector' },
    { name: 'Tote / Payload Deck', spec: 'Open-top tote · 150 kg tow rating' },
    { name: 'Top Frame & Control Panel', spec: 'E-stop · mode buttons · 7" display' },
    { name: 'Compute', spec: 'Raspberry Pi 4 B + Arduino · ROS 2 Humble' },
    { name: 'Sensors', spec: 'RPLiDAR A1 · HP60C depth camera · IMU · ultrasonic' },
    { name: 'Power', spec: '12 V 45 Ah Li-ion · buck converter' },
    { name: 'Drive', spec: '2 × 160 kg·cm planetary DC motors with encoders · Cytron 20 A' },
    { name: 'Chassis Base', spec: '4 wheels · tow hitch · 2 kill switches' },
  ],
  components: [
    { icon: 'lidar', name: 'RPLiDAR A1 ×2', spec: '360° 2D laser scanner', role: 'SLAM, obstacle detection' },
    { icon: 'cpu', name: 'Raspberry Pi 4 B+', spec: 'Cortex-A72 @ 1.5 GHz, 4 GB', role: 'ROS 2 main computer' },
    { icon: 'chip', name: 'Arduino', spec: 'Microcontroller', role: 'Low-level motor/servo control' },
    { icon: 'motor', name: 'DC planetary motors ×2', spec: '160 kg·cm, with encoders', role: 'Differential drive' },
    { icon: 'driver', name: 'Cytron 20 A motor driver', spec: 'PWM/DIR, protections', role: 'Drive motor control' },
    { icon: 'battery', name: 'Li-ion battery', spec: '12 V 45 Ah', role: 'Main power' },
    { icon: 'screen', name: '7" touchscreen', spec: 'Pi display', role: 'On-robot HMI' },
    { icon: 'wifi', name: 'Wi-Fi router', spec: 'Onboard local network', role: 'SSH / rosbridge link to operator' },
    { icon: 'imu', name: 'IMU sensor', spec: 'Orientation + position', role: 'Odometry fusion' },
    { icon: 'arm', name: 'Robotic arm', spec: '4-DOF, camera end-effector', role: 'Inspection' },
  ],
};

export const engineering = {
  index: '04',
  label: 'Engineering',
  title: 'Designed from first principles.',
  lead: 'Every motor, cell and wire was sized from one load case: 40 kg of robot tugging 150 kg on a cement floor, up a 2° incline. Air drag at this speed is only 8.77 × 10⁻³ N, so it is ignored.',
  stats: [
    { value: 190, decimals: 0, unit: 'kg', label: 'Total mass', formula: 'm = 40 kg robot + 150 kg tugging load · W = m·g = 1863.9 N' },
    { value: 37.28, decimals: 2, unit: 'N', label: 'Rolling resistance', formula: 'F_RR = C_rr × W = 0.02 × 1863.9 N (cement floor)' },
    { value: 65.05, decimals: 2, unit: 'N', label: 'Gradient resistance', formula: 'F_GR = W × sin θ = 1863.9 N × sin 2°' },
    { value: 39.84, decimals: 2, unit: 'W', label: 'Power per motor', formula: 'P = F_motor × V = 79.67 N × 0.5 m/s' },
    { value: 9.51, decimals: 2, unit: 'N·m', label: 'Torque per motor', formula: 'T = (P × 60) / (2π × N) at N = 40 rpm' },
    { value: 0.5, decimals: 1, unit: 'm/s', label: 'Operating speed', formula: 'Chosen with the payload as the constraint' },
    { value: 13.2, decimals: 1, unit: 'A', label: 'Total current draw', formula: 'Pi 2.0 + driver 0.2 + LiDAR 0.5 + display 1.5 + motors 8.0 + arm 1.0' },
    { value: 3.5, decimals: 1, unit: 'h', prefix: '≈ ', label: 'Battery life', formula: 't = 45 Ah / 13.2 A' },
  ],
  kinematics: {
    title: 'Differential-drive kinematics',
    body: 'Two driven wheels a distance w apart. Driving them at different speeds sets both forward speed and turn rate.',
    formulas: ['V_b,x = (V_right + V_left) / 2', 'ω_b,z = (V_right − V_left) / w', 'V_right − V_left = w · ω_b,z'],
  },
};

export const arm = {
  index: '05',
  label: 'The inspection arm',
  title: 'Put the camera where the work is.',
  lead: 'Drag the sliders to pose the arm. The orange cone is the camera’s field of view, the dashed line is pallet-label height, and the arc marks the 45 cm reach.',
  presets: [
    { name: 'Stow', pose: { yaw: 0, sh: 150, el: -150, tilt: -30 } },
    { name: 'Look ahead', pose: { yaw: 0, sh: 80, el: -80, tilt: -8 } },
    { name: 'Rack inspection', pose: { yaw: 0, sh: 35, el: -45, tilt: -35 } },
    { name: 'Ground sweep', pose: { yaw: 25, sh: 60, el: -110, tilt: -40 } },
  ],
  joints: [
    { key: 'yaw', label: 'Base yaw', min: -90, max: 90 },
    { key: 'sh', label: 'Shoulder', min: 0, max: 170 },
    { key: 'el', label: 'Elbow', min: -150, max: 150 },
    { key: 'tilt', label: 'Camera tilt', min: -90, max: 90 },
  ],
  specs: [
    ['Links', '25 / 15 / 5 cm'],
    ['Reach from base', '45 cm'],
    ['Target height', '60 cm pallet labels'],
    ['Work volume', '0.4339 m³'],
    ['Link masses (SS, 8 g/cm³)', '160 / 96 / 32 g'],
    ['Camera end-effector', '100 g'],
    ['DOF (Kutzbach)', '3(5−1) − 2·4 − 0 = 4'],
  ],
  // [joint, required torque (FOS 2), selected motor]
  motors: [
    ['Base yaw', '2.94 N·m', 'NEMA 17 stepper'],
    ['Shoulder pitch', '54 kg·cm', 'DS servo 80 kg·cm'],
    ['Elbow pitch', '9.5 kg·cm', 'MG996R 11 kg·cm'],
    ['Camera tilt', '1.32 kg·cm', '9 g micro servo'],
  ],
  // D-H parameters as given in the report (Fig 3.2.1).
  dh: {
    head: ['i', 'αᵢ₋₁', 'aᵢ₋₁', 'dᵢ', 'θᵢ'],
    rows: [
      ['1', '0', '0', 'L₁', 'θ₁'],
      ['2', '0', 'L₂', '0', 'θ₂'],
      ['3', '0', 'L₃', '0', 'θ₃'],
      ['4', '0', 'L₄', '0', 'θ₄'],
    ],
    note: 'L₁ is the base height; L₂, L₃, L₄ are the 25, 15 and 5 cm links.',
  },
};

export const software = {
  index: '06',
  label: 'Software',
  title: 'ROS 2 at the core.',
  lead: 'Every capability is a ROS 2 node talking over DDS. LiDAR and the depth camera feed SLAM, SLAM and the HMI feed Nav2, and the goals controller drives the hardware. This is the methodology diagram from our report (Fig 5.3.1).',
  stack: [
    'ROS 2 Humble',
    'DDS',
    'Nav2 · behaviour trees',
    'Nav2 · global planner',
    'Nav2 · local controller',
    'Nav2 · costmaps',
    'SLAM Toolbox',
    'TF2',
    'rosbridge_suite + roslibjs',
    'web_video_server',
  ],
};

export const consoleApp = {
  index: '07',
  label: 'Operator console',
  title: 'Drive it from any browser.',
  lead: 'A PWA controller that runs on the factory laptop or on a phone in a supervisor’s pocket.',
  features: [
    'Tap-to-navigate on the SLAM map',
    'Dual virtual joysticks (drive + pan/tilt)',
    'Arm posture macros',
    'Emergency stop',
    'Works offline as an installable PWA',
  ],
  cta: 'Try the live console',
  // Optional: set to '/console/laptop.png' etc. to show real screenshots instead of the drawn UI.
  screenshots: { laptop: null, phone: null },
};

export const specs = {
  index: '08',
  label: 'Specifications',
  title: 'The spec sheet.',
  rows: [
    ['Robot mass', '40 kg'],
    ['Max tow load', '150 kg'],
    ['Operating speed', '0.5 m/s'],
    ['Gradeability', '2°'],
    ['Drive', 'Differential, 2 × 160 kg·cm DC motors with encoders'],
    ['Battery', '12 V 45 Ah Li-ion'],
    ['Battery life', '≈ 3.5 h at 13.2 A'],
    ['Arm', '4 DOF, 45 cm reach, 0.4339 m³ work volume'],
    ['Sensors', 'RPLiDAR A1, HP60C depth camera, IMU, ultrasonic'],
    ['Compute', 'Raspberry Pi 4 B+ (4 GB) + Arduino'],
    ['Middleware', 'ROS 2 Humble + Nav2'],
    ['Prototype cost', '₹76,260'],
  ],
};

export const why = {
  index: '09',
  label: 'Why it matters',
  title: 'Six reasons it earns floor space.',
  cards: [
    { title: 'Multipurpose', body: 'Transport and inspection in one machine.' },
    { title: 'Autonomous', body: 'LiDAR SLAM and Nav2 path planning.' },
    { title: 'Safe', body: 'Obstacle avoidance, people-aware yielding and a hardware E-stop.' },
    { title: 'Modular', body: 'ROS 2 nodes, swappable payloads and tools.' },
    { title: 'Low-cost', body: 'Built on accessible hardware: a ₹76k prototype.' },
    { title: 'Industry 4.0 ready', body: 'Ready for fleet, IoT and AI-vision extensions.' },
  ],
};

export const gallery = {
  index: '10',
  label: 'Gallery',
  title: 'From the CAD model.',
  items: [
    { src: '/robot/iso.png', alt: 'Isometric CAD render of ARCEUX with blue tote and camera arm', caption: 'Isometric view' },
    { src: '/robot/side.png', alt: 'Side CAD render of ARCEUX showing the two-tier chassis, tote and arm', caption: 'Side view' },
    { src: '/robot/top.png', alt: 'Top CAD render of ARCEUX showing the tote, control panel and tow hook', caption: 'Top view' },
  ],
};

export const roadmap = {
  index: '11',
  label: 'Future scope',
  title: 'Where it goes next.',
  items: [
    { title: 'AI vision defect detection', body: 'On-arm models that flag damaged stock and faulty gauges.' },
    { title: 'Reinforcement-learning decisions', body: 'Learned policies for task allocation and tricky manoeuvres.' },
    { title: 'IoT monitoring & predictive maintenance', body: 'Motor, battery and bearing health streamed to the plant.' },
    { title: 'Cloud analytics', body: 'Mission logs and inspection results in one dashboard.' },
    { title: 'Multi-robot fleet management', body: 'Shared maps, traffic control and a single queue for many robots.' },
  ],
};

export const team = {
  index: '12',
  label: 'The team',
  title: 'Meet Team Krenoviantz.',
  lead: 'Engineers, developers and designers building practical robotics for Indian industry.',
  // Add `photo: '/team/angel.jpg'` to show a photo instead of initials.
  // linkedin / github: paste profile URLs; an empty string hides that icon.
  members: [
    { name: 'Angel George', role: 'Team Leader · R&D', line: 'Leads the project, from the problem study and literature review to the final prototype.', linkedin: '', github: '' },
    { name: 'Kirubhashini', role: 'Marketing Head', line: 'Shapes the pitch, the presentation and how the robot’s story reaches judges and industry.', linkedin: '', github: '' },
    { name: 'Sri Prenesh', role: 'Embedded Systems', line: 'Builds the Arduino firmware, motor-driver control and sensor wiring on the robot.', linkedin: '', github: '' },
    { name: 'Navith Sanjay Nagendran', role: 'Integration Engineer', line: 'Brings ROS 2, Nav2, SLAM and the hardware together into one working system.', linkedin: '', github: '' },
    { name: 'Kishore N', role: 'Design Engineer · CAD', line: 'Designed the chassis, tote deck and inspection arm in CAD and ran the design calculations.', linkedin: '', github: '' },
    { name: 'Sanjay Krishna', role: 'Full-Stack Developer', line: 'Built the web console and this site, linking the browser to ROS 2 through rosbridge.', linkedin: '', github: '' },
  ],
};

export const footer = {
  blurb: 'A multipurpose autonomous mobile robot for material handling and industrial inspection.',
  bottom: 'Smart India Hackathon 2026 · Problem Statement 26112 · Organization: Autodesk · Theme: Robotics and Drones · Category: Hardware',
};
