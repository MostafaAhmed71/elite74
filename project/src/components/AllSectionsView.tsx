import React from 'react';
import { SectionData } from '../types';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AllSectionsViewProps {
  sections: SectionData[];
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections }) => {
  const navigate = useNavigate();

  // تحويل اللون إلى صيغة HSL وتعديل السطوع
  const adjustColor = (color: string) => {
    // إزالة الـ #
    const hex = color.replace('#', '');
    // تحويل اللون إلى RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // إرجاع اللون بتعتيم 40%
    return `rgba(${r}, ${g}, ${b}, 0.9)`;
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">عرض الأسماء</h2>
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
        <div className="grid grid-cols-5 gap-4">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div 
                className="text-lg font-bold p-3 rounded-lg text-white text-center"
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
                      className="p-2.5 rounded-lg text-white text-sm font-bold relative overflow-hidden"
                      style={{ 
                        background: `linear-gradient(45deg, ${adjustColor(section.color)} 0%, ${section.color} 100%)`,
                        border: `1px solid ${section.color}`
                      }}
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
