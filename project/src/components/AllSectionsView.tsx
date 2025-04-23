import React from 'react';
import { SectionData } from '../types';
import { ArrowRight, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AllSectionsViewProps {
  sections: SectionData[];
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

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
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        <div className="grid gap-8">
          {sections.map((section) => {
            const filteredStudents = section.students.filter(student => 
              student && student.name.includes(searchTerm)
            );
            
            if (filteredStudents.length === 0) return null;
            
            return (
              <div key={section.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                {/* Section Header */}
                <div 
                  className="py-4 px-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${section.color}22, ${section.color}11)`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: section.color }}
                      />
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {filteredStudents.length} طالب
                    </span>
                  </div>
                </div>
                
                {/* Students Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredStudents.map((student, index) => (
                      <div 
                        key={student?.id || index}
                        className="group bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-all duration-300"
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{ 
                                backgroundColor: `${section.color}22`,
                                color: section.color
                              }}
                            >
                              {student?.name?.[0]}
                            </div>
                            <span className="text-white font-medium truncate">
                              {student?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
