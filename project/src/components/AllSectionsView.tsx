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
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">جميع الطلاب</h2>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-white/80 transition-colors"
            >
              <ArrowRight className="h-5 w-5 ml-2" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div 
                className="text-xl font-bold p-4 rounded-lg text-white text-center"
                style={{ backgroundColor: section.color }}
              >
                {section.title}
              </div>
              <div className="space-y-2">
                {section.students
                  .filter(student => student)
                  .map((student, index) => (
                    <div 
                      key={student?.id || index} 
                      className="p-3 rounded-lg text-white hover:bg-white/20 transition-colors"
                      style={{ backgroundColor: `${section.color}99` }}
                    >
                      {student?.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSectionsView; 