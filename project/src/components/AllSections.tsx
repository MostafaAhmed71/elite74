import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionData } from '../types';
import { Users, ArrowRight, Grid } from 'lucide-react';

interface AllSectionsProps {
  sections: SectionData[];
}

const AllSections: React.FC<AllSectionsProps> = ({ sections }) => {
  const navigate = useNavigate();

  console.log('Sections in AllSections:', sections);

  // تقسيم الأقسام إلى مجموعتين: الأقسام العادية والأقسام المجمعة
  const regularSections = sections.slice(0, -4);
  const combinedSections = sections.slice(-4);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            مدارس نخبة الشمال الأهلية
          </h1>
          <p className="text-xl text-white/80 mb-8">
            المتأهلون للسحب النهائي 2024
          </p>
          <button
            onClick={() => navigate('/all-students')}
            className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center mx-auto space-x-2 space-x-reverse"
          >
            <Grid className="w-5 h-5 ml-2" />
            <span>عرض جميع الطلاب</span>
          </button>
        </div>

        {/* الأقسام */}
        {sections && sections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {sections.map((section) => (
              <Link
                to={`/section/${section.id}`}
                key={section.id}
                className="group block rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm"
              >
                <div
                  className="p-6 text-white font-bold text-center text-2xl relative"
                  style={{ backgroundColor: section.color }}
                >
                  <div className="relative z-10 drop-shadow-lg">{section.title}</div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-white ml-3" />
                    <div>
                      <div className="text-white font-bold text-lg">
                        {section.students.filter(s => s).length} طالب
                      </div>
                      <div className="text-white/90">
                        {section.students.filter(s => !s).length} مقعد متاح
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-white/90 group-hover:text-white flex items-center justify-center transition-colors">
                    <span className="font-medium">عرض التفاصيل</span>
                    <ArrowRight className="w-5 h-5 mr-2 transition-transform duration-300 transform group-hover:translate-x-1" />
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
          <p className="text-white/60 text-lg">
            النخبة .. ليست مجرد مدرسة
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllSections; 