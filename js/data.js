// ════════════════════════════════════
// PROJECT DATA — add new projects here
// ════════════════════════════════════
const projects = [
  {
    name: "Rocket Gravity",
    description: "A 2D action shooter game.",
    longDescription: "A 2D action shooter game where you control a rocket. You shoot enemies, gain powerups, and defeat bosses. It's very movement based and has a lot of potential for future updates.",
    tags: ["Unity", "Game Dev"],
    date: "2025-09",
    featured: true,
    links: {
      live: "https://willofcoding.itch.io/rocket-gravity"
    },
    folder: "projects/Rocket Gravity",
    thumbnail: "projects/Rocket Gravity/screenshots/thumbnail.png",
    screenshots: [
      "projects/Rocket Gravity/screenshots/image 1.png",
      "projects/Rocket Gravity/screenshots/image 2.png",
      "projects/Rocket Gravity/screenshots/image 3.png"
    ],
    videos: [
      "projects/Rocket Gravity/videos/Rocket Gravity Preview Video.mp4"
    ]
  },
  {
    name: "Box Business",
    description: "A factory simulation game.",
    longDescription: "A factory simulation game where you manage a box business. You create conveyor belts, automated machines, and more to produce boxes. Gain money, upgrade your factory, and expand your business. It's a very simple game with a lot of potential for future updates.",
    tags: ["HTML/CSS", "JavaScript", "Game Dev"],
    date: "2025-10",
    featured: true,
    links: {
      live: "https://www.crazygames.com/preview/e998d4ec-a316-4c96-9b0d-94d338907f45?gameBuildId=db4233ce-8c9d-476a-a6f1-26c37fac6d1d&qaTool=true&disableSubmitQA=true&role=developer"
    },
    folder: "projects/Box Business",
    thumbnail: "projects/Box Business/screenshots/Box Business 16 9.png",
    screenshots: [
      "projects/Box Business/screenshots/image 1.png"
    ],
    videos: [
      "projects/Box Business/videos/Box Business Video.mp4"
    ]
  },
  {
    name: "Messaging App",
    description: "A messaging app website made for desktop and mobile.",
    longDescription: "A messaging app website made for desktop and mobile. It's a simple app that allows you to send and receive messages. It was made as a personal project to learn more about web development. The service runs off a free tier of Render and was built into an Android app later.",
    tags: ["React", "JavaScript", "HTML/CSS", "Web Dev"],
    date: "2026-03",
    featured: false,
    links: {
      live: "https://messaging-app-2lzh.onrender.com/"
    },
    folder: "projects/Messaging App",
    thumbnail: "projects/Messaging App/screenshots/image 1.png",
    screenshots: [
      "projects/Messaging App/screenshots/image 2.png",
      "projects/Messaging App/screenshots/image 3.png",
      "projects/Messaging App/screenshots/image 4.png"
    ],
    videos: [
      "projects/Messaging App/videos/Messaging App Video.mp4"
    ]
  }
];

const bannerConfig = {
  title: 'William Culver',
  subtitle: "Developer & Maker — games, tools, and experiments."
};

const aboutConfig = {
  heading: 'About Me',
  paragraphs: [
    { text: "I'm William Culver — a developer and maker who loves building things from the ground up. From games and 3D engines to websites and hardware projects, I enjoy the challenge of turning ideas into something real and interactive.", dim: false },
    { text: "I work across Python, JavaScript, C#, and C++, and I'm always picking up new tools. When I'm not coding, I'm usually designing 3D prints or experimenting with electronics.", dim: true }
  ],
  heroImage: '',
  avatarImage: '',
  skills: ['Python', 'JavaScript', 'C#', 'C++', 'Unity', 'HTML/CSS', '3D Printing', 'Game Dev']
};

const contactConfig = {
  name: 'William Culver',
  subtitle: 'Available for freelance work and collaborations',
  avatarImage: '',
  buttons: [
    { label: 'Email', href: 'mailto:your@email.com', isEmail: true },
    { label: 'Fiverr', href: '#', isEmail: false }
  ]
};

// ── Restore any dev mode edits saved in localStorage ──
(function restoreDevEdits() {
  try {
    const sp = localStorage.getItem('portfolio_projects');
    if (sp) projects.splice(0, projects.length, ...JSON.parse(sp));
    const sb = localStorage.getItem('portfolio_bannerConfig');
    if (sb) Object.assign(bannerConfig, JSON.parse(sb));
    const sa = localStorage.getItem('portfolio_aboutConfig');
    if (sa) Object.assign(aboutConfig, JSON.parse(sa));
    const sc = localStorage.getItem('portfolio_contactConfig');
    if (sc) Object.assign(contactConfig, JSON.parse(sc));
  } catch(e) {}
})();
