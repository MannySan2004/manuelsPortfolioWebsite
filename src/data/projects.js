// ─────────────────────────────────────────────────────────────────────────────
// Featured projects — only the highest-impact work from GitHub & LinkedIn.
// Leave `demo` empty ('') to hide the demo link; leave `github` empty to hide it.
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS = [
  {
    title: 'Private Enterprise Network',
    description:
      'Architected a secure, end-to-end global enterprise network on AWS — multi-region VPCs connected privately via Transit Gateway and VPC peering for low-latency links, with Active Directory and Amazon WorkSpaces giving employees secure virtual desktops across 6 isolated accounts (no physical hardware). VPC flow logs feed automated dashboards that surface traffic trends and suspicious activity.',
    tech: ['AWS', 'VPC & Transit Gateway', 'WorkSpaces', 'Active Directory'],
    github: '',
    demo: '',
  },
  {
    title: 'Resume Architect',
    description:
      "An AI-powered platform that uses the OpenAI API to give job seekers detailed feedback and a match percentage against a target role — multilingual, with a sample built around a candidate applying from South Korea. Backed by an AWS architecture (S3, RDS, IAM) with least-privilege access.",
    tech: ['OpenAI API', 'Python', 'Flask', 'AWS'],
    github: 'https://github.com/MannySan2004',
    demo: '',
  },
  {
    title: 'Stock Trading Platform',
    description:
      'A web platform that helps young adults start investing — built with TradingView widgets for live market and economic data on top of a Node.js backend. Developed alongside Sound Credit Union for their fintech competition.',
    tech: ['Node.js', 'JavaScript', 'TradingView'],
    github: 'https://github.com/MannySan2004/Stock-Trading-Website-3.0',
    demo: '',
  },
  {
    title: 'Deep Learning with TensorFlow',
    description:
      'Hands-on deep-learning models built with TensorFlow during AI & big-data coursework at Yonsei University — neural networks applied across multiple datasets to derive data-driven insights.',
    tech: ['TensorFlow', 'Deep Learning', 'Python'],
    github: 'https://github.com/MannySan2004/Deep-Learning-utilizing-tensor-flow',
    demo: '',
  },
  {
    title: 'Terrain Wind-Field Analysis',
    description:
      'Large-scale terrain wind-field analysis using PySpark to process big datasets at scale and surface engineering insights.',
    tech: ['PySpark', 'Big Data', 'Python'],
    github: 'https://github.com/MannySan2004/Terrain-Wind-Field-Analysis-with-PySpark',
    demo: '',
  },
  {
    title: 'Data Science for Performance-Driven Design',
    description:
      'A linear-regression model that predicts family-home energy costs, turning raw data into performance-driven design decisions.',
    tech: ['scikit-learn', 'Linear Regression', 'Pandas'],
    github: 'https://github.com/MannySan2004/Data-Science-for-Performance-Driven-Design',
    demo: '',
  },
]
