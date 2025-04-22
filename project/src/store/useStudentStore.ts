import { create, StateCreator } from 'zustand';
import { SectionData, Student, SectionType } from '../types';
import { supabase } from '../lib/supabase';

interface StudentStore {
  sections: SectionData[];
  addStudent: (name: string, sectionId: SectionType) => Promise<{ success: boolean; message?: string }>;
  fetchStudents: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  deleteStudent: (studentId: string, sectionId: SectionType, position: number) => Promise<{ success: boolean; message?: string }>;
  autoGitUpdate: () => Promise<void>;
}

const initialSections: SectionData[] = [
  {
    id: 'universal',
    title: 'القسم العالمي',
    color: '#2196F3', // أزرق
    students: Array(15).fill(null),
  },
  {
    id: 'elementary',
    title: 'القسم الابتدائي',
    color: '#4CAF50', // أخضر
    students: Array(15).fill(null),
  },
  {
    id: 'middle',
    title: 'القسم المتوسط',
    color: '#FF9800', // برتقالي
    students: Array(15).fill(null),
  },
  {
    id: 'secondary',
    title: 'القسم الثانوي',
    color: '#2196F3', // أزرق
    students: Array(15).fill(null),
  },
];

// تنفيذ أمر Git
const executeGitCommand = async (command: string): Promise<void> => {
  try {
    const process = await fetch(`/api/git?command=${encodeURIComponent(command)}`);
    if (!process.ok) {
      throw new Error(`فشل تنفيذ الأمر: ${command}`);
    }
  } catch (error) {
    console.error('خطأ في تنفيذ أمر Git:', error);
    throw error;
  }
};

const createStudentStore: StateCreator<StudentStore> = (set, get) => {
  let subscription: ReturnType<typeof supabase.channel> | null = null;

  const setupRealtimeSubscription = () => {
    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = supabase
      .channel('students-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        () => {
          console.log('تم استلام تحديث من Supabase');
          get().fetchStudents();
        }
      )
      .subscribe((status) => {
        console.log('حالة الاتصال:', status);
      });
  };

  return {
    sections: initialSections,

    autoGitUpdate: async () => {
      try {
        console.log('جاري تحديث Git...');
        await executeGitCommand('add .');
        await executeGitCommand('commit -m "تحديث تلقائي: تغييرات في بيانات الطلاب"');
        await executeGitCommand('push origin main');
        console.log('تم تحديث Git بنجاح');
      } catch (error) {
        console.error('خطأ في تحديث Git:', error);
      }
    },

    fetchStudents: async () => {
      try {
        console.log('جاري جلب الطلاب من Supabase...');
        const { data: students, error } = await supabase
          .from('students')
          .select('*')
          .order('position');

        if (error) {
          console.error('خطأ في جلب الطلاب:', error);
          throw error;
        }

        console.log('تم جلب الطلاب:', students);

        // نسخة جديدة من الأقسام مع الطلاب المحدثين
        const updatedSections = initialSections.map(section => ({
          ...section,
          students: Array(15).fill(null),
        }));

        console.log('الأقسام قبل التحديث:', updatedSections);

        // تحديث مواقع الطلاب
        students?.forEach(student => {
          const sectionIndex = updatedSections.findIndex(s => s.id === student.section);
          if (sectionIndex !== -1 && student.position > 0 && student.position <= 15) {
            updatedSections[sectionIndex].students[student.position - 1] = {
              id: student.id,
              name: student.name,
            };
          }
        });

        console.log('الأقسام بعد التحديث:', updatedSections);

        // تحديث الحالة
        set({ sections: updatedSections });
      } catch (error) {
        console.error('خطأ في جلب الطلاب:', error);
      }
    },

    startAutoRefresh: () => {
      console.log('بدء التحديث التلقائي...');
      setupRealtimeSubscription();
      get().fetchStudents(); // جلب البيانات الأولية
    },

    stopAutoRefresh: () => {
      console.log('إيقاف التحديث التلقائي...');
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    },

    deleteStudent: async (studentId: string, sectionId: SectionType, position: number) => {
      try {
        console.log('جاري حذف الطالب...', { studentId, sectionId, position });

        // حذف الطالب من Supabase
        const { error: deleteError } = await supabase
          .from('students')
          .delete()
          .eq('id', studentId);

        if (deleteError) {
          console.error('خطأ في حذف الطالب:', deleteError);
          return { success: false, message: 'حدث خطأ أثناء حذف الطالب' };
        }

        // الحصول على جميع الطلاب في نفس القسم
        const { data: sectionStudents, error: fetchError } = await supabase
          .from('students')
          .select('*')
          .eq('section', sectionId)
          .order('position');

        if (fetchError) {
          console.error('خطأ في جلب طلاب القسم:', fetchError);
          return { success: false, message: 'حدث خطأ أثناء تحديث المواقع' };
        }

        // تحديث مواقع الطلاب الباقين
        if (sectionStudents) {
          for (const student of sectionStudents) {
            if (student.position > position) {
              const { error: updateError } = await supabase
                .from('students')
                .update({ position: student.position - 1 })
                .eq('id', student.id);

              if (updateError) {
                console.error('خطأ في تحديث موقع الطالب:', updateError);
                return { success: false, message: 'حدث خطأ أثناء تحديث المواقع' };
              }
            }
          }
        }

        // تحديث واجهة المستخدم فوراً
        await get().fetchStudents();
        
        // تحديث Git في الخلفية
        get().autoGitUpdate().catch(error => {
          console.error('خطأ في تحديث Git:', error);
        });
        
        return { success: true, message: 'تم حذف الطالب بنجاح' };
      } catch (error) {
        console.error('خطأ غير متوقع في حذف الطالب:', error);
        return { success: false, message: 'حدث خطأ غير متوقع أثناء الحذف' };
      }
    },

    addStudent: async (name: string, sectionId: SectionType) => {
      try {
        console.log('جاري إضافة طالب جديد...', { name, sectionId });

        // التحقق من صحة البيانات
        if (!name.trim()) {
          return { success: false, message: 'الرجاء إدخال اسم الطالب' };
        }

        // التحقق من وجود الاسم في نفس القسم
        const { data: existingStudents, error: checkError } = await supabase
          .from('students')
          .select('*')
          .eq('section', sectionId)
          .eq('name', name.trim());

        if (checkError) {
          console.error('خطأ في التحقق من وجود الاسم:', checkError);
          return { success: false, message: 'حدث خطأ أثناء التحقق من الاسم' };
        }

        if (existingStudents && existingStudents.length > 0) {
          return { success: false, message: 'الاسم موجود بالفعل في هذا القسم' };
        }

        // حساب الموقع الجديد
        const { data: currentStudents, error: countError } = await supabase
          .from('students')
          .select('position')
          .eq('section', sectionId)
          .order('position', { ascending: false });

        if (countError) {
          console.error('خطأ في حساب الموقع:', countError);
          return { success: false, message: 'حدث خطأ أثناء تحديد موقع الطالب' };
        }

        const maxPosition = currentStudents && currentStudents.length > 0 ? currentStudents[0].position : 0;
        const newPosition = maxPosition + 1;

        if (newPosition > 15) {
          return { success: false, message: 'القسم ممتلئ' };
        }

        // إضافة الطالب
        const { data: newStudent, error: insertError } = await supabase
          .from('students')
          .insert([
            {
              name: name.trim(),
              section: sectionId,
              position: newPosition
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('خطأ في إضافة الطالب:', insertError);
          return { success: false, message: 'حدث خطأ أثناء إضافة الطالب' };
        }

        // تحديث واجهة المستخدم فوراً
        await get().fetchStudents();
        
        // تحديث Git في الخلفية
        get().autoGitUpdate().catch(error => {
          console.error('خطأ في تحديث Git:', error);
        });
        
        return { success: true, message: 'تم إضافة الطالب بنجاح' };
      } catch (error) {
        console.error('خطأ غير متوقع في إضافة الطالب:', error);
        return { success: false, message: 'حدث خطأ غير متوقع أثناء الإضافة' };
      }
    },
  };
};

export const useStudentStore = create(createStudentStore);