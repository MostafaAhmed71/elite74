import React, { useState, useEffect } from 'react';
import { SectionType } from '../types';
import { ClipboardList, Pencil, Trash2, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStudentStore } from '../store/useStudentStore';

interface RegistrationFormProps {
  onAddStudent: (name: string, section: SectionType) => Promise<{
    success: boolean;
    message?: string;
  }>;
  className?: string;
}

interface StudentListItem {
  id: string;
  name: string;
  section: string;
  position: number;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [section, setSection] = useState<SectionType>('elementary');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteStudent = useStudentStore(state => state.deleteStudent);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setStudents(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await onAddStudent(name, section);
    
    if (result.success) {
      setName('');
      fetchStudents();
      
      if (result.message) {
        setAlert({ type: 'error', message: result.message });
      } else {
        setAlert({ type: 'success', message: 'تم الحفظ بنجاح' });
      }
    } else if (result.message) {
      setAlert({ type: 'error', message: result.message });
    }
    
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEdit = async (id: string) => {
    if (editingId === id) {
      const { error } = await supabase
        .from('students')
        .update({ name: editName })
        .eq('id', id);

      if (!error) {
        setAlert({ type: 'success', message: 'تم التعديل بنجاح' });
        fetchStudents();
      } else {
        setAlert({ type: 'error', message: 'حدث خطأ أثناء التعديل' });
      }
      setEditingId(null);
      setEditName('');
    } else {
      const student = students.find(s => s.id === id);
      if (student) {
        setEditingId(id);
        setEditName(student.name);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      // Get the student's details
      const studentToDelete = students.find(s => s.id === id);
      if (!studentToDelete) {
        setAlert({ type: 'error', message: 'لم يتم العثور على الطالب' });
        return;
      }

      // Delete using the store function
      const result = await deleteStudent(
        id,
        studentToDelete.section as SectionType,
        studentToDelete.position
      );

      if (result.success) {
        setAlert({ type: 'success', message: 'تم الحذف بنجاح' });
        await fetchStudents();
      } else {
        setAlert({ type: 'error', message: result.message || 'حدث خطأ أثناء الحذف' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'حدث خطأ غير متوقع أثناء الحذف' });
      console.error('خطأ في حذف الطالب:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getSectionName = (sectionId: string) => {
    const sections = {
      elementary: 'الابتدائي',
      middle: 'المتوسط',
      secondary: 'الثانوي',
      universal: 'العالمي'
    };
    return sections[sectionId as keyof typeof sections];
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-5">
          <ClipboardList className="h-8 w-8 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">شاشة التسجيل</h2>
        </div>
        
        {alert && (
          <div 
            className={`mb-4 p-3 rounded-md text-center text-white ${
              alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            role="alert"
          >
            {alert.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder="أدخل الاسم هنا"
              required
            />
          </div>
          
          <div>
            <label htmlFor="section" className="block text-gray-700 font-medium mb-1">
              القسم
            </label>
            <select
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value as SectionType)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white"
            >
              <option value="elementary">الابتدائي</option>
              <option value="middle">المتوسط</option>
              <option value="secondary">الثانوي</option>
              <option value="universal">العالمي</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            حفظ
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">قائمة الطلاب</h3>
        <div className="space-y-2">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex-1">
                {editingId === student.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <div>
                    <span className="font-medium">{student.name}</span>
                    <span className="text-sm text-gray-500 mr-2">
                      ({getSectionName(student.section)} - {student.position})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(student.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  disabled={isDeleting}
                >
                  {editingId === student.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Pencil className="h-5 w-5" />
                  )}
                </button>
                {editingId === student.id && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditName('');
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    disabled={isDeleting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(student.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;