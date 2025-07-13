import React, { useState } from 'react';
import {
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Scenarios = ({ title = "Sample Scenarios", showTitle = true }) => {
  const [expandedScenario, setExpandedScenario] = useState(null);

  const scenarios = [
    {
      id: 1,
      title: "International Student Journey",
      subtitle: "Maria's Path to Financial Independence",
      icon: GlobeAltIcon,
      color: "primary",
      student: {
        name: "Maria Rodriguez",
        background: "International student from Colombia",
        university: "MIT",
        degree: "Computer Science",
        year: "Junior",
        challenges: [
          "High international tuition fees",
          "Limited access to traditional banking",
          "Currency exchange costs",
          "No credit history in the US"
        ]
      },
      solutions: [
        {
          title: "Identity Verification",
          description: "Verified her identity using Worldcoin/Gitcoin Passport",
          icon: ShieldCheckIcon,
          status: "completed"
        },
        {
          title: "Expense Pool Creation",
          description: "Created a $2,000 expense pool with 5 roommates for rent and utilities",
          icon: UserGroupIcon,
          status: "active"
        },
        {
          title: "Micro-Loan Application",
          description: "Secured a $1,500 loan for textbooks and supplies",
          icon: CurrencyDollarIcon,
          status: "completed"
        },
        {
          title: "International Remittance",
          description: "Sent $300 to family in Colombia with 80% lower fees",
          icon: GlobeAltIcon,
          status: "completed"
        },
        {
          title: "Scholarship DAO Participation",
          description: "Applied for and received $2,000 scholarship through community voting",
          icon: AcademicCapIcon,
          status: "completed"
        }
      ],
      outcomes: {
        creditScore: "+150 points",
        savings: "$1,200 annually",
        timeSaved: "3 hours/week",
        communityImpact: "Helped 3 other international students"
      }
    },
    {
      id: 2,
      title: "Domestic Engineering Student",
      subtitle: "Alex's Scholarship & Credit Building Journey",
      icon: AcademicCapIcon,
      color: "secondary",
      student: {
        name: "Alex Chen",
        background: "Domestic student with multiple scholarships",
        university: "Stanford University",
        degree: "Electrical Engineering",
        year: "Senior",
        challenges: [
          "Managing multiple scholarship payments",
          "Building credit history",
          "Coordinating with scholarship providers",
          "Tracking academic performance requirements"
        ]
      },
      solutions: [
        {
          title: "Scholarship Management",
          description: "Consolidated 3 scholarships totaling $15,000 through DAO governance",
          icon: AcademicCapIcon,
          status: "completed"
        },
        {
          title: "Credit Score Building",
          description: "Built credit score from 650 to 780 through responsible loan usage",
          icon: ChartBarIcon,
          status: "active"
        },
        {
          title: "Expense Pool Leadership",
          description: "Led a $3,000 expense pool for lab equipment and materials",
          icon: UserGroupIcon,
          status: "completed"
        },
        {
          title: "Peer Lending",
          description: "Provided $500 loan to fellow student, earning 5% interest",
          icon: CurrencyDollarIcon,
          status: "active"
        },
        {
          title: "Academic Performance Tracking",
          description: "Maintained 3.9 GPA with transparent academic records",
          icon: BookOpenIcon,
          status: "completed"
        }
      ],
      outcomes: {
        creditScore: "+130 points",
        savings: "$800 annually",
        timeSaved: "2 hours/week",
        communityImpact: "Mentored 5 junior students"
      }
    },
    {
      id: 3,
      title: "Graduate Student Complex Needs",
      subtitle: "Sarah's Multi-Faceted Financial Strategy",
      icon: UserGroupIcon,
      color: "accent",
      student: {
        name: "Sarah Johnson",
        background: "Graduate student with research funding and teaching",
        university: "UC Berkeley",
        degree: "PhD in Data Science",
        year: "3rd Year",
        challenges: [
          "Complex income streams (research + teaching)",
          "International collaboration expenses",
          "Conference travel funding",
          "Research equipment costs"
        ]
      },
      solutions: [
        {
          title: "Multi-Source Income Management",
          description: "Integrated research stipend, teaching salary, and conference funding",
          icon: CurrencyDollarIcon,
          status: "active"
        },
        {
          title: "International Collaboration Pool",
          description: "Created $5,000 pool for joint research with international partners",
          icon: GlobeAltIcon,
          status: "active"
        },
        {
          title: "Conference Funding DAO",
          description: "Secured $2,500 for international conference through community voting",
          icon: AcademicCapIcon,
          status: "completed"
        },
        {
          title: "Equipment Lending Network",
          description: "Shared expensive lab equipment with 8 other researchers",
          icon: UserGroupIcon,
          status: "active"
        },
        {
          title: "Credit Line Establishment",
          description: "Established $10,000 credit line for research emergencies",
          icon: ChartBarIcon,
          status: "completed"
        }
      ],
      outcomes: {
        creditScore: "+200 points",
        savings: "$3,500 annually",
        timeSaved: "5 hours/week",
        communityImpact: "Established research collaboration network"
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'active': return 'text-blue-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-dark-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'active': return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />;
      case 'pending': return <div className="w-4 h-4 bg-yellow-500 rounded-full" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-dark-400">
            Explore real-world scenarios showing how students use UniFi to solve financial challenges
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="card">
            <div className="flex items-start space-x-3 mb-4">
              <div className={`w-12 h-12 bg-${scenario.color}-100 rounded-lg flex items-center justify-center`}>
                <scenario.icon className={`w-6 h-6 text-${scenario.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{scenario.title}</h3>
                <p className="text-sm text-dark-400">{scenario.subtitle}</p>
              </div>
            </div>

            {/* Student Info */}
            <div className="bg-dark-800 rounded-lg p-3 mb-4">
              <h4 className="font-medium mb-2">{scenario.student.name}</h4>
              <p className="text-sm text-dark-400 mb-2">{scenario.student.background}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-dark-400">University:</span>
                  <p className="font-medium">{scenario.student.university}</p>
                </div>
                <div>
                  <span className="text-dark-400">Degree:</span>
                  <p className="font-medium">{scenario.student.degree}</p>
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-sm">Key Challenges</h4>
              <ul className="space-y-1">
                {scenario.student.challenges.map((challenge, index) => (
                  <li key={index} className="text-xs text-dark-400 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-sm">UniFi Solutions</h4>
              <div className="space-y-2">
                {scenario.solutions.slice(0, expandedScenario === scenario.id ? undefined : 3).map((solution, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`flex items-center space-x-1 ${getStatusColor(solution.status)} mt-1`}>
                      {getStatusIcon(solution.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{solution.title}</p>
                      <p className="text-xs text-dark-400">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {scenario.solutions?.length > 3 && (
                <button
                  onClick={() => setExpandedScenario(
                    expandedScenario === scenario.id ? null : scenario.id
                  )}
                  className="text-xs text-primary-500 hover:text-primary-400 mt-2 flex items-center space-x-1"
                >
                  <span>
                    {expandedScenario === scenario.id ? 'Show less' : `Show ${(scenario.solutions?.length || 0) - 3} more`}
                  </span>
                  <ArrowRightIcon className={`w-3 h-3 transition-transform ${
                    expandedScenario === scenario.id ? 'rotate-90' : ''
                  }`} />
                </button>
              )}
            </div>

            {/* Outcomes */}
            <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-3">
              <h4 className="font-medium mb-2 text-sm">Outcomes</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-dark-400">Credit Score:</span>
                  <p className="font-medium text-green-500">{scenario.outcomes.creditScore}</p>
                </div>
                <div>
                  <span className="text-dark-400">Annual Savings:</span>
                  <p className="font-medium text-green-500">{scenario.outcomes.savings}</p>
                </div>
                <div>
                  <span className="text-dark-400">Time Saved:</span>
                  <p className="font-medium text-blue-500">{scenario.outcomes.timeSaved}</p>
                </div>
                <div>
                  <span className="text-dark-400">Community Impact:</span>
                  <p className="font-medium text-purple-500">{scenario.outcomes.communityImpact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scenarios; 