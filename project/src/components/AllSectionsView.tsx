//صفحة خاصة بعرض جميع الطلاب
import React from 'react';
import { SectionData } from '../types';

interface AllSectionsViewProps {
  sections: SectionData[];
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections }) => {
  return (
    <div className="min-h-screen bg-black/50">
      <div className="container mx-auto py-24 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="backdrop-blur-sm bg-white/5 rounded-lg overflow-hidden border border-white/10"
            >
              <div 
                className="p-4"
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
                <div className="space-y-2">
                  {section.students
                    .filter(student => student)
                    .map((student, index) => (
                      <div 
                        key={student?.id || index}
                        className="bg-black/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3"
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
                        <span className="text-white text-sm">
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
