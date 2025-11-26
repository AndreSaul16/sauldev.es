import { Linkedin, Mail, Phone, Globe, Github } from 'lucide-react';

export const profile = {
    name: "Saúl Briceño",
    role: "Desarrollador de Software",
    subRole: "Inteligencia Artificial & Cloud Computing",
    description: "Desarrollo Soluciones Cloud Escalables e Inteligentes. Diseño arquitecturas robustas en la nube que integran la potencia de la programación moderna con la eficiencia de la Inteligencia Artificial. Creo aplicaciones accesibles, seguras y preparadas para crecer globalmente sin que tengas que preocuparte por la infraestructura.",
    contact: {
        phone: "+34 642 90 11 92",
        email: "andresaul16s@gmail.com",
        linkedin: "https://www.linkedin.com/in/sbriceño/",
        website: "https://SaulDev.es",
        github: "https://github.com/" // Assuming github based on icons, URL not explicit in text but standard
    },
    socials: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/sbriceño/", icon: Linkedin },
        { name: "Email", url: "mailto:andresaul16s@gmail.com", icon: Mail },
        { name: "Github", url: "https://github.com/", icon: Github },
    ]
};

export const skills = [
    { category: "Lenguajes", items: ["Java", "Python", "JavaScript", "React", "SQL"] },
    { category: "Cloud", items: ["Azure", "AWS", "GCP", "Git", "GitHub", "Linux"] },
    { category: "IA", items: ["OpenAI", "Gemini", "HuggingFace", "Fine-Tuning"] }
];

export const certifications = [
    {
        name: "AWS Cloud Quest - Cloud Practitioner",
        image: "/Badges/aws-cloud-quest-cloud-practitioner-training-badge.png",
        issuer: "Amazon Web Services",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/cd6ad50b-3d20-4d34-867f-9f7430dc9587"
    },
    {
        name: "Microsoft Certified: Azure AI Fundamentals",
        image: "/Badges/microsoft-certified-azure-ai-fundamentals.png",
        issuer: "Microsoft",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/c3329da0-ed08-4e71-b66e-81e86795539c"
    },
    {
        name: "Microsoft Certified: Azure Data Fundamentals",
        image: "/Badges/microsoft-certified-azure-data-fundamentals.png",
        issuer: "Microsoft",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/feaf3379-09dc-4a62-9b42-0b6c22b5e5d3"
    },
    {
        name: "Microsoft Certified: Azure Fundamentals",
        image: "/Badges/microsoft-certified-azure-fundamentals.png",
        issuer: "Microsoft",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/fc0c2713-06a6-4d46-ac60-155112ab1665"
    },
    {
        name: "IT Specialist - Artificial Intelligence",
        image: "/Badges/it-specialist-artificial-intelligence.png",
        issuer: "Certiport",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/b0faa581-fe21-4893-83ea-70c09b18366e"
    },
    {
        name: "IT Specialist - Data Analytics",
        image: "/Badges/it-specialist-data-analytics.png",
        issuer: "Certiport",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/5790e10c-637d-446c-b422-bb012d325525"
    },
    {
        name: "IT Specialist - Java",
        image: "/Badges/it-specialist-java.png",
        issuer: "Certiport",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/4b14add7-6e0f-43a8-b111-f0ac3b8c2e5c"
    },
    {
        name: "IT Specialist - Python",
        image: "/Badges/it-specialist-python.png",
        issuer: "Certiport",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/93101f6b-48f5-4bd2-b0f4-dff46b5f1219"
    },
    {
        name: "PMI Project Management Ready",
        image: "/Badges/pmi-project-management-ready.png",
        issuer: "Project Management Institute",
        year: "2024",
        credlyUrl: "https://www.credly.com/badges/09ccc335-5ffe-4074-96b6-0bff452776ea"
    },
    {
        name: "Microsoft Technology Associate - JavaScript",
        image: "/Badges/MTA Javascript.png",
        issuer: "Microsoft",
        year: "2021",
        credlyUrl: "https://www.credly.com/users/saul-briceno/badges" // MTA no visible en perfil, enlaza a perfil general
    },
    {
        name: "Microsoft Technology Associate - Programming",
        image: "/Badges/MTA Java.png",
        issuer: "Microsoft",
        year: "2021",
        credlyUrl: "https://www.credly.com/users/saul-briceno/badges" // MTA no visible en perfil, enlaza a perfil general
    }
];

export const achievements = [
    {
        title: "1er Lugar | Hackathon The Wave",
        year: "2025",
        description: "Nuestro equipo 'Debbuging masters' creo un sistema autonomo de busqueda y rescate de personas desaparecidas con UAVs. Implementamos IA, Edge Computing y Azure.",
        techStack: ["Python", "OpenCV", "Edge Computing", "Azure"]
    },
    {
        title: "Best Use of Data | NASA Space Apps",
        year: "2025",
        description: "Nuestro equipo realizó el procesamiento de más de +1400 objetos satelitales para su visualizacion y analisis en tiempo real con un agente de IA integrado.",
        techStack: ["Python", "OpenAI", "NASA API", "JavaScript"]
    },
    {
        title: "3er Puesto | AWS DeepRacer",
        year: "2025",
        description: "Nuestro equipo realizó la optimización de función de recompensa (Reward Function) para modelo de Reinforcement Learning en circuito virtual.",
        techStack: ["AWS DeepRacer", "Python", "Reinforcement Learning"]
    },
    {
        title: "Participante Destacado | Hackathon Movilidad",
        year: "2025",
        description: "Premio votado por otros participantes al compañerismo durante el evento.",
        techStack: ["Soft Skills", "Liderazgo", "Mentoring"]
    }

];

export const experience = [
    {
        role: "Programador Java (Prácticas)",
        company: "Golive Service",
        period: "Abr 2021 - Oct 2021",
        description: [
            "Desarrollo y mantenimiento del ERP JD Edwards.",
            "Creación de Web Services en Java para integración de sistemas móviles y backend.",
            "Refactorización de código para mejorar rendimiento y escalabilidad.",
            "Soporte en despliegues a producción."
        ]
    },
    {
        role: "Operario de Mantenimiento",
        company: "CLECE S.A.",
        period: "Mar 2023 - Feb 2024",
        description: [
            "Gestión de incidencias para el mantenimiento preventivo y correctivo en entornos de servicio críticos."
        ]
    }
];

export const education = [
    {
        degree: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
        school: "THE HUB FP (Zaragoza)",
        period: "2024 - 2026 (En curso)",
        description: "Formación de alto nivel técnico basada en metodología STEAM y aprendizaje basado en proyectos (learn by doing). El programa prioriza el desarrollo Full Stack bajo metodologías ágiles (Scrum/Kanban) y cultura DevOps integrando ciclos de CI/CD. Enfoque práctico en arquitectura de software, gestión de bases de datos y despliegue de soluciones multiplataforma.",
        highlights: [
            "Desarrollo de Software: Programación de sistemas backend distribuidos y escalables utilizando Java y Python, orientados a microservicios.",
            "DevOps & Automation: Implementación de cultura CI/CD en contenedores (Docker) para la orquestación y despliegue automatizado",
            "Ingeniería de Datos: Modelado avanzado y persistencia políglota con SQL (PostgreSQL) y NoSQL (MongoDB/Firebase) para sistemas de alta concurrencia.",
            "Ecosistema Cloud: Desarrollo de soluciones multiplataforma integradas nativamente con servicios AWS/Azure/GCP.",
            "Metodología Ágil: Gestión de proyectos bajo marco Scrum/Kanban, utilizando herramientas de industria (Trello) y control de versiones colaborativo(GitHub)."
        ],
        technologies: ["Java", "GitHub", "Python", "Docker", "AWS", "Azure", "GCP", "SQL", "NoSQL", "React Native"]
    },
    {
        degree: "Certificación Full Stack Developer",
        school: "Tecnara (Clúster TIC de Aragón)",
        period: "2020 - 2021",
        description: "Programa intensivo de +900 horas enfocado en programación full stack.",
        highlights: [
            "Desarrollo Backend Versátil: Fundamentos sólidos de programación orientada a objetos con Java y scripting con JavaScript.",
            "Frontend con React: Creación de interfaces web dinámicas y modernas utilizando React, HTML5 y CSS3.",
            "Bases de Datos y Sistemas: Gestión de bases de datos relacionales (SQL) y administración básica de servidores Linux.",
            "Introducción al Cloud: Primer contacto con servicios en la nube (AWS).",
            "Control de Versiones: Gestión de código fuente y trabajo colaborativo utilizando Git."
        ],
        technologies: ["Java", "JavaScript", "React", "SQL", "Linux", "AWS", "HTML5/CSS3", "Git"]
    }
];

export const projects = [
    {
        name: "H.E.L.E.N",
        fullName: "Recepcionista Virtual con IA",
        description: "Asistente virtual que atiende llamadas, agenda citas y responde preguntas frecuentes usando IA conversacional.",
        icon: "Phone",
        category: "IA Conversacional",
        year: "2024",
        technologies: ["Retell AI", "n8n", "Google Calendar", "Voice AI"],
        githubUrl: "https://github.com/AndreSaul16/H.E.L.E.N",
        highlights: [
            "Interacción por voz natural",
            "Agendamiento automático de citas",
            "Integración con Google Calendar",
            "Workflow automatizado con n8n"
        ]
    },
    {
        name: "H.O.M.E",
        fullName: "Hybrid Orchestrator for Modular Environments",
        description: "Sistema IoT distribuido que conecta sensores físicos a Azure Cloud con análisis de IA.",
        icon: "Home",
        category: "IoT & Cloud",
        year: "2024",
        technologies: ["Azure IoT Hub", "Azure Functions", "Cosmos DB", "Azure OpenAI"],
        githubUrl: "https://github.com/AndreSaul16/H.O.M.E",
        highlights: [
            "Arquitectura serverless en Azure",
            "Procesamiento en tiempo real",
            "Integración con Azure OpenAI",
            "Automatización inteligente"
        ]
    },
    {
        name: "InnolandGame",
        fullName: "Juego Interactivo Multiplataforma",
        description: "App móvil multiplataforma con desafíos validados por IA, modo multijugador y sistema de roles.",
        icon: "Gamepad2",
        category: "Gaming & Mobile",
        year: "2024",
        technologies: ["React Native", "Expo", "Firebase", "OpenAI", "TypeScript"],
        githubUrl: "https://github.com/AndreSaul16/InnolandGame",
        highlights: [
            "Multiplataforma (iOS/Android/Web)",
            "Validación de respuestas con IA",
            "Sistema multijugador en tiempo real",
            "10 roles especializados"
        ]
    },
    {
        name: "Project Sentinel",
        fullName: "Sistema Edge de Detección para Drones",
        description: "Sistema de detección con YOLOv8 para drones de búsqueda y rescate, con clasificación de posturas y eventos.",
        icon: "Plane",
        category: "Computer Vision & Edge AI",
        year: "2025",
        technologies: ["Python", "YOLOv8", "OpenCV", "Edge Computing", "Azure"],
        githubUrl: "https://github.com/AndreSaul16/Project-Sentinel",
        highlights: [
            "Detección de personas >95% precisión",
            "Detección de incendios e inundaciones",
            "Edge Computing para tiempo real",
            "Ganador Hackathon The Wave 2025"
        ]
    },
    {
        name: "SpaceGuards",
        fullName: "Visualizador de Desechos Espaciales",
        description: "Aplicación web 3D para visualizar +1400 objetos orbitales con análisis de IA y simulación de misiones.",
        icon: "Satellite",
        category: "Space Tech & Data Viz",
        year: "2025",
        technologies: ["JavaScript", "Three.js", "Firebase", "OpenAI", "NASA API"],
        githubUrl: "https://github.com/AndreSaul16/SpaceGuards",
        highlights: [
            "Visualización 3D interactiva",
            "Datos orbitales TLE reales",
            "Asistente IA para análisis",
            "Best Use of Data - NASA Space Apps 2025"
        ]
    }
];