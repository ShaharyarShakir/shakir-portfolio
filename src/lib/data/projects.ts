export type Tech = { icon: string; label: string };

export type Project = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  techs: Tech[];
  href?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    image: '/images/projects/sql-agent.png',
    imageAlt: 'Sql Agent screenshot',
    title: "Sql Agent",
    description: 'An interactive AI chatbot designed to help non-technical users query SQL databases using natural language. The system dynamically retrieves database schema definitions and translates user inquiries into precise SQL queries, executing them securely and formatting the results.',
    techs: [
      {icon: 'https://cdn.simpleicons.org/nextdotjs', label: 'Nextjs'},
      {icon: 'https://cdn.simpleicons.org/mistralai', label: 'Mistral AI'},
      {icon: 'https://cdn.simpleicons.org/vercel', label: 'AI Agent SDK'}
    ],
    href: 'https://sql-agent-orpin.vercel.app',
    github: 'https://gitlab.com/ShaharyarShakir/sql-agent',
  },
  {
    image: '/images/projects/document-copilot.png',
    imageAlt: 'Document Copilot screenshot',
    title: 'Document Copilot',
    description: 'RAG-powered document Q&A with FastAPI, pgvector, Supabase, and OpenAI. Upload any PDF and chat with it instantly.',
    techs: [
      { icon: 'https://cdn.simpleicons.org/fastapi', label: 'FastAPI' },
      { icon: 'https://cdn.simpleicons.org/postgresql', label: 'PostgreSQL' },
      { icon: 'https://cdn.simpleicons.org/supabase', label: 'Supabase' },
      { icon: 'https://cdn.simpleicons.org/react', label: 'React' },
      { icon: 'https://cdn.simpleicons.org/typescript', label: 'TypeScript' },
    ],
    href: 'https://frontend.shaharyarshakir.workers.dev/login',
    github: 'https://gitlab.com/ShaharyarShakir/document_copilot',
  },
  {
    image: '/images/projects/vprofile.png',
    imageAlt: 'VProfile DevOps pipeline screenshot',
    title: 'VProfile',
    description: 'End-to-end DevOps pipeline with Jenkins CI/CD, Docker, Kubernetes on AWS EKS, RDS, and Route 53.',
    techs: [
      { icon: 'https://cdn.simpleicons.org/jenkins', label: 'Jenkins' },
      { icon: 'https://cdn.simpleicons.org/docker', label: 'Docker' },
      { icon: 'https://cdn.simpleicons.org/kubernetes', label: 'Kubernetes' },
      { icon: 'https://cdn.simpleicons.org/amazonaws', label: 'AWS' },
    ],
    href: 'https://github.com/ShaharyarShakir/vprofile-action',
    github: 'https://github.com/ShaharyarShakir/vprofile-action',
  },
  {
    image: '/images/projects/youtube-sentiment.png',
    imageAlt: 'YouTube Sentiment Analysis screenshot',
    title: 'YouTube Sentiment Analysis',
    description: 'ML pipeline with DVC, MLflow, LightGBM, and FastAPI backend. Chrome extension surfaces sentiment scores on any YouTube video.',
    techs: [
      { icon: 'https://cdn.simpleicons.org/dvc', label: 'DVC' },
      { icon: 'https://cdn.simpleicons.org/mlflow', label: 'MLflow' },
      { icon: 'https://cdn.simpleicons.org/fastapi', label: 'FastAPI' },
      { icon: 'https://cdn.simpleicons.org/googlechrome', label: 'Chrome Extension' },
    ],
    href: 'https://github.com/ShaharyarShakir/youtube-sentiment-analysis',
    github: 'https://github.com/ShaharyarShakir/youtube-sentiment-analysis',
  },
  {
    image: '/images/projects/gym-planner.png',
    imageAlt: 'AI Gym Planner screenshot',
    title: 'Full-Stack AI Gym Planner',
    description: 'AI-generated workout plans via Groq Cloud. React + TypeScript frontend, Express backend, NeonDB/PostgreSQL.',
    techs: [
      { icon: 'https://cdn.simpleicons.org/react', label: 'React' },
      { icon: 'https://cdn.simpleicons.org/typescript', label: 'TypeScript' },
      { icon: 'https://cdn.simpleicons.org/express', label: 'Express' },
      { icon: 'https://cdn.simpleicons.org/postgresql', label: 'PostgreSQL' },
    ],
    href: "https://gym-ai-planner-ten.vercel.app",
    github: 'https://gitlab.com/ShaharyarShakir/gym-ai-planner',
  },
  {
    image: '/images/projects/gossip.png',
    imageAlt: 'Gossip chat app screenshot',
    title: 'Gossip',
    description: 'Real-time chat with Socket.io, Clerk auth, and MongoDB. Web and backend only.',
    techs: [
      { icon: 'https://cdn.simpleicons.org/socketdotio/000000', label: 'Socket.io' },
      { icon: 'https://cdn.simpleicons.org/mongodb', label: 'MongoDB' },
      { icon: 'https://cdn.simpleicons.org/clerk', label: 'Clerk' },
    ],
    github: 'https://github.com/ShaharyarShakir/gossip',
  }
];