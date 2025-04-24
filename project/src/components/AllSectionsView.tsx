import React from 'react';
import { SectionData } from '../types';

interface AllSectionsViewProps {
  sections: SectionData[];
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-10 px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">جميع الطلاب حسب الأقسام</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white/5 rounded-2xl shadow-xl border border-white/10 overflow-hidden backdrop-blur-md transition-transform hover:scale-105"
            >
              <div
                className="p-5"
                style={{ backgroundColor: section.color }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  <span className="bg-black/30 text-white text-xs px-3 py-1 rounded-full">
                    {section.students.filter(Boolean).length} طالب
                  </span>
                </div>
              </div>

              <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar space-y-3">
                {section.students
                  .filter(Boolean)
                  .map((student, index) => (
                    <div
                      key={student?.id || index}
                      className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-2 backdrop-blur-sm hover:bg-black/30 transition"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: section.color, color: '#fff' }}
                      >
                        {index + 1}
                      </div>
                      <span className="text-white text-sm">{student?.name}</span>
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
