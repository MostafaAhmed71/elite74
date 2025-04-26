// صفحة خاصة بعرض جميع الطلاب
import React from 'react';
import { SectionData } from '../types';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AllSectionsViewProps {
  sections: SectionData[];
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black/50">
      <div className="container mx-auto py-24 px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
          <span>العودة للرئيسية</span>
        </button>
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="backdrop-blur-sm bg-white/5 rounded-lg overflow-hidden border border-white/10"
            >
              <div 
                className="p-4 sticky top-0 z-10"
                style={{ 
                  backgroundColor: section.color,
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{section.title}</h3>
                  <span className="text-white text-sm bg-black/20 px-2 py-1 rounded-full">
                    {section.students.filter(s => s).length}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {section.students
                    .filter(student => student)
                    .map((student, index) => (
                      <div 
                        key={student?.id || index}
                        className="bg-black/40 backdrop-blur-sm p-3 rounded-lg flex flex-row-reverse items-center gap-3 hover:bg-black/50 transition-colors"
                      >
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: section.color,
                            color: '#fff'
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-white text-sm font-bold text-right">
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
