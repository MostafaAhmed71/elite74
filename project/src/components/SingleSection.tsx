//صفحة خاصة بعرض الطلاب فى قسم معين
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SectionData, Student, SectionType } from '../types';
import { ArrowRight, Users, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import CelebrationView from './CelebrationView';
import { useSectionContext } from '../context/SectionContext';
import { useStudentStore } from '../store/useStudentStore';
import toast from 'react-hot-toast';

interface SingleSectionProps {
  sections: SectionData[];
}

const SingleSection: React.FC<SingleSectionProps> = ({ sections }) => {
  const { sectionId } = useParams();
  const section = sections.find(s => s.id === sectionId);
  const { showCelebration, celebrationStudents, triggerCelebration, endCelebration } = useSectionContext();
  const deleteStudent = useStudentStore(state => state.deleteStudent);
  
  // العثور على القسم السابق والتالي
  const currentIndex = sections.findIndex(s => s.id === sectionId);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  // تتبع التغييرات في القسم
  useEffect(() => {
    if (section) {
      const currentStudents = section.students.filter((s): s is Student => s !== null);
      const storedKey = `section-${section.id}-count`;
      const storedCount = parseInt(localStorage.getItem(storedKey) || '0');
      
      if (currentStudents.length > storedCount) {
        // تم إضافة طلاب جدد
        const newStudents = currentStudents.slice(storedCount);
        const startNumber = storedCount + 1; // رقم بداية المتأهلين الجدد
        console.log('New students detected:', newStudents, 'Starting from number:', startNumber);
        triggerCelebration(newStudents.map((student, index) => ({
          ...student,
          number: startNumber + index // إضافة رقم المتأهل لكل طالب
        })));
      }
      
      localStorage.setItem(storedKey, currentStudents.length.toString());
    }
  }, [section?.students, section?.id, triggerCelebration]);

  const handleDelete = async (student: Student, position: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      const result = await deleteStudent(student.id, sectionId as SectionType, position + 1);
      if (result.success) {
        toast.success('تم حذف الطالب بنجاح');
      } else {
        toast.error(result.message || 'حدث خطأ أثناء الحذف');
      }
    }
  };

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-6">القسم غير موجود</h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300"
          >
            <ArrowRight className="ml-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const filledSeats = section.students.filter(s => s).length;
  const totalSeats = section.students.length;
  const progress = (filledSeats / totalSeats) * 100;

  return (
    <>
      <div className={`min-h-screen flex items-center transition-opacity duration-1000 ${showCelebration ? 'opacity-30' : 'opacity-100'}`} dir="rtl">
        <div className="w-full max-w-6xl mx-auto p-8">
          {/* رأس القسم */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="text-white/80 hover:text-white flex items-center transition-colors"
            >
              <ArrowRight className="ml-2 w-5 h-5" />
              <span>الرئيسية</span>
            </Link>
            <div className="flex items-center gap-4">
              {prevSection && (
                <Link
                  to={`/section/${prevSection.id}`}
                  className="text-white/80 hover:text-white flex items-center transition-colors"
                >
                  <ChevronRight className="ml-1 w-5 h-5" />
                  <span>القسم السابق</span>
                </Link>
              )}
              {nextSection && (
                <Link
                  to={`/section/${nextSection.id}`}
                  className="text-white/80 hover:text-white flex items-center transition-colors"
                >
                  <span>القسم التالي</span>
                  <ChevronLeft className="mr-1 w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* معلومات القسم */}
          <div 
            className="relative rounded-2xl overflow-hidden mb-8 p-8"
            style={{ backgroundColor: section.color }}
          >
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                {section.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-black/20 rounded-lg px-4 py-2">
                  <Users className="w-5 h-5 text-white ml-2" />
                  <span className="text-white font-medium">
                    {filledSeats}
                  </span>
                </div>
                <div className="flex-1 bg-black/20 rounded-lg p-2">
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          </div>

          {/* قائمة الطلاب */}
          <div className="grid grid-cols-5 gap-4">
            {section.students.map((student, index) => (
              <div
                key={`${section.id}-slot-${index}`}
                className={`
                  relative p-6 rounded-xl min-h-[120px]
                  ${student
                    ? 'bg-gray-900/95 shadow-lg hover:bg-gray-900/90'
                    : 'bg-white/5 border-2 border-dashed border-white/20'
                  }
                  transition-all duration-300 group
                `}
              >
                {student ? (
                  <>
                    <div className="flex flex-col h-full">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3"
                        style={{ 
                          backgroundColor: `${section.color}33`,
                          color: section.color
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-base mb-1 break-words">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: section.color }}
                          />
                          <span className="text-white/70 text-sm">
                            متأهل
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(student, index)}
                      className="absolute top-3 left-3 p-1.5 rounded-lg bg-white/5 text-white/40 
                               opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 
                               transition-all duration-300"
                      title="حذف الطالب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white/40 text-sm">مقعد شاغر</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCelebration && celebrationStudents.length > 0 && (
        <CelebrationView
          students={celebrationStudents}
          onComplete={endCelebration}
          sectionColor={section.color}
        />
      )}
    </>
  );
};

export default SingleSection;