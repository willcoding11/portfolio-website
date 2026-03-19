// ════════════════════════════════════
// PROJECT DATA — add new projects here
// ════════════════════════════════════
const projects = [
  {
    "name": "Coffee Website",
    "description": "Website for a small coffee bussiness.",
    "longDescription": "Lets users order items online and pick either to pick up or have their food be delivered. Shows the history of the company and a little bit about them.",
    "tags": [
      "WEB-DESIGN",
      "HTML",
      "CSS",
      "JAVASCRIPT"
    ],
    "date": "2026-03",
    "featured": false,
    "links": {
      "live": "https://willcoding11.github.io/coffee-website/"
    },
    "folder": "projects/Coffee Website",
    "thumbnail": "projects/Coffee Website/screenshots/Screenshot 2.png",
    "screenshots": [
      "projects/Coffee Website/screenshots/Screenshot 2.png",
      "projects/Coffee Website/screenshots/screencapture-willcoding11-github-io-coffee-website-2026-03-17-21_50_27.png",
      "projects/Coffee Website/screenshots/Screenshot.png"
    ],
    "videos": [
      "projects/Coffee Website/videos/Recording 2026-03-18 165025.mp4"
    ]
  },
  {
    "name": "Messaging App",
    "description": "A messaging app website made for desktop and mobile.",
    "longDescription": "A messaging app website made for desktop and mobile. It's a simple app that allows you to send and receive messages. It was made as a personal project to learn more about web development. The service runs off a free tier of Render and was built into an Android app later.Made as a test project to learn more about web services and online communication between sites. I made it as an HTML project to run on desktop first, and then added a mobile mode for the website. I also made an app for it in Android Studio that still ran off of the Render Service I had set up.",
    "tags": [
      "React",
      "JavaScript",
      "HTML/CSS",
      "Web Dev"
    ],
    "date": "2026-03",
    "featured": false,
    "links": {
      "live": "https://messaging-app-2lzh.onrender.com/"
    },
    "folder": "projects/Messaging App",
    "thumbnail": "projects/Messaging App/screenshots/simple_messages_logo.png",
    "screenshots": [
      "projects/Messaging App/screenshots/image 2.png",
      "projects/Messaging App/screenshots/image 3.png",
      "projects/Messaging App/screenshots/image 4.png"
    ],
    "videos": [
      "projects/Messaging App/videos/Messaging App Video.mp4"
    ]
  },
  {
    "name": "Rocket Gravity",
    "description": "A 2D action shooter game.",
    "longDescription": "A 2D action shooter game where you control a rocket. You shoot enemies, gain powerups, and defeat bosses. It's very and physics based. I made this game over the span of a few month, starting from having almost no experience in game design and Unity. This project taught me a lot, like UI design, graphic skills, polish, particles effects, and more. I submitted the game to Crazy Games, which gave me some great feedback on the game. I am happy I decided to work on this project as it helped me learn a lot and push through times when I didn't feel motivated.",
    "tags": [
      "Unity",
      "Game Dev"
    ],
    "date": "2025-09",
    "featured": true,
    "links": {
      "live": "https://willofcoding.itch.io/rocket-gravity"
    },
    "folder": "projects/Rocket Gravity",
    "thumbnail": "projects/Rocket Gravity/screenshots/thumbnail.png",
    "screenshots": [
      "projects/Rocket Gravity/screenshots/image 1.png",
      "projects/Rocket Gravity/screenshots/image 2.png",
      "projects/Rocket Gravity/screenshots/image 3.png"
    ],
    "videos": [
      "projects/Rocket Gravity/videos/Rocket Gravity Preview Video.mp4"
    ]
  },
  {
    "name": "Box Business",
    "description": "A factory simulation game.",
    "longDescription": "A factory simulation game where you manage a box business. You create conveyor belts, automated machines, and more to produce boxes. Gain money, upgrade your factory, and expand your business. I submitted this game to Crazy Games too, providing me with real user feedback. I have been making progress on the game, readying it for a second submission by giving lots of new content and UI updates. I hope to soon be able to resubmit the game to Crazy Games and pass into full launch. I may also try to submit the game to Poki as well.",
    "tags": [
      "HTML/CSS",
      "JavaScript",
      "Game Dev"
    ],
    "date": "2025-10",
    "featured": true,
    "links": {
      "live": "https://www.crazygames.com/preview/e998d4ec-a316-4c96-9b0d-94d338907f45?gameBuildId=db4233ce-8c9d-476a-a6f1-26c37fac6d1d&qaTool=true&disableSubmitQA=true&role=developer"
    },
    "folder": "projects/Box Business",
    "thumbnail": "projects/Box Business/screenshots/Box Business 16 9.png",
    "screenshots": [
      "projects/Box Business/screenshots/image 1.png"
    ],
    "videos": [
      "projects/Box Business/videos/Box Business Video.mp4"
    ]
  }
];

// Projects to show on the home page (by name, in order)
const homeProjects = ["Rocket Gravity", "Coffee Website", "Messaging App"];

// Content sections shown below the project grid on the home page
const homeSections = [
  {
    "heading": "Always Learning, Always Shipping",
    "text": "Whether it's picking up a new tool, learning 3D printing, or diving into UX design — I'm driven by curiosity and the satisfaction of shipping something complete. Every finished project teaches me something new.",
    "image": "about me.JPG",
    "imageLeft": false,
    "bgColor": "#f5f3f0"
  },
  {
    "heading": "UX/UI Design",
    "text": "UX Design is an important part of every website. It is what makes users have an enjoyable time on your site, looking at your services and projects. That's why I use UX design in my website development by focusing on a clean yet professional look and colors the audience loves.",
    "image": "drawing-5.png",
    "imageLeft": true,
    "bgColor": "#e3ddd6"
  }
];

const bannerConfig = {
  "title": "William Culver",
  "subtitle": "Turning ideas into fully launchable polished products."
};

const aboutConfig = {
  "heading": "About Me",
  "paragraphs": [
    {
      "text": "I'm William Culver — a developer and maker who loves building things from the ground up. From games and interactive websites to 3D printing and hardware projects, I enjoy the challenge of turning ideas into fully interactive and polished products.",
      "dim": false
    },
    {
      "text": "I work across HTML, CSS, JavaScript, Java, Python, C#, and C++, and I'm always picking up new tools. When I'm not coding, I'm usually designing 3D prints or experimenting with electronics.",
      "dim": true
    }
  ],
  "heroImage": "about me.JPG",
  "avatarImage": "pfp.jpg",
  "skills": [
    "Python",
    "JavaScript",
    "C#",
    "C++",
    "Unity",
    "HTML/CSS",
    "3D Printing",
    "Game Dev",
    "React"
  ]
};

const contactConfig = {
  "name": "William Culver",
  "subtitle": "Creating polished websites for small businesses",
  "email": "will.coding11@gmail.com",
  "cta": "Let's talk about making something great for your business.",
  "avatarImage": "pfp.jpg",
  "buttons": [
    {
      "label": "Email",
      "href": "mailto:will.coding11@gmail.com",
      "isEmail": true
    },
    {
      "label": "Fiverr",
      "href": "#",
      "isEmail": false
    }
  ]
};