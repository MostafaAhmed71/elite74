import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionData } from '../types';
import { Users, ArrowRight, Grid } from 'lucide-react';

interface AllSectionsProps {
  sections: SectionData[];
}

const AllSections: React.FC<AllSectionsProps> = ({ sections }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-6xl mx-auto p-8">
        {/* الأقسام */}
        {sections && sections.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 mb-8">
            {sections.map((section) => (
              <Link
                to={`/section/${section.id}`}
                key={section.id}
                className="group block rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-white/5 backdrop-blur-sm"
              >
                <div
                  className="p-8 text-white font-bold text-center text-3xl relative"
                  style={{ backgroundColor: section.color }}
                >
                  <div className="relative z-10 drop-shadow-lg">{section.title}</div>
                </div>
                <div 
                  className="p-8 bg-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-white ml-3" />
                    <div className="text-white font-bold text-xl">
                      {section.students.filter(s => s).length} طالب
                    </div>
                  </div>
                  <div className="mt-4 text-white/90 group-hover:text-white flex items-center justify-center transition-colors">
                    <span className="font-medium text-lg">عرض التفاصيل</span>
                    <ArrowRight className="w-6 h-6 mr-2 transition-transform duration-300 transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-xl">
            جاري تحميل البيانات...
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/all-students')}
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-colors flex items-center mx-auto space-x-2 space-x-reverse text-lg"
          >
            <Grid className="w-6 h-6 ml-2" />
            <span>عرض جميع الطلاب</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllSections; 