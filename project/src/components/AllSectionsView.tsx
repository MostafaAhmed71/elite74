import React from 'react';
import { SectionData } from '../types';
import { X } from 'lucide-react';

interface AllSectionsViewProps {
  sections: SectionData[];
  onClose: () => void;
}

const AllSectionsView: React.FC<AllSectionsViewProps> = ({ sections, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-auto mx-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">جميع الطلاب</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-md p-6">
                <div 
                  className="text-xl font-bold mb-4 p-3 rounded-lg text-white text-center"
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
                        className="p-2 bg-gray-50 rounded-md text-gray-800"
                      >
                        {student?.name}
                      </div>
                    ))}
                  {section.students.filter(student => student).length === 0 && (
                    <div className="text-gray-500 text-center p-4">
                      لا يوجد طلاب في هذا القسم
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSectionsView; 