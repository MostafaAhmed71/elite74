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
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm py-6 sticky top-0 z-10 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7 text-white" />
              <h2 className="text-2xl font-bold text-white">عرض الأسماء</h2>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
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
              className="backdrop-blur-sm bg-white/5 rounded-xl overflow-hidden border border-white/10"
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
                        className="bg-white/5 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3 group hover:bg-white/10 transition-all duration-300"
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
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
document.head.appendChild(styleSheet);
