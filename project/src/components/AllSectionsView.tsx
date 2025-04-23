import React from 'react';
import { SectionData } from '../types';
import { ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AllSectionsViewProps {
  sections: SectionData[];
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900" dir="rtl">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-sm py-6 sticky top-0 z-10 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7 text-white" />
              <h2 className="text-2xl font-bold text-white">عرض الأسماء</h2>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
            >
              {/* Section Header */}
              <div 
                className="py-4 px-6"
                style={{ 
                  backgroundColor: section.color,
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                  <span className="text-white/90 text-sm bg-black/20 px-3 py-1 rounded-full">
                    {section.students.filter(s => s).length} طالب
                  </span>
                </div>
              </div>
              
              {/* Students List */}
              <div className="p-4">
                <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                  {section.students
                    .filter(student => student)
                    .map((student, index) => (
                      <div 
                        key={student?.id || index}
                        className="bg-gray-900/95 p-3 rounded-lg flex items-center gap-3 group hover:bg-gray-900/90"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ 
                            backgroundColor: `${section.color}33`,
                            color: section.color
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-white font-medium text-sm truncate">
                          {student?.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSectionsView;

// Add this CSS to your global styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`;
document.head.appendChild(styleSheet);
