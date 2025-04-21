import { useEffect, useState } from 'react';
import { useStudentStore } from './store/useStudentStore';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SectionType } from './types';
import AllSections from './components/AllSections';
import SingleSection from './components/SingleSection';
import CombinedSections from './components/CombinedSections';
import RegistrationForm from './components/RegistrationForm';
import { SectionProvider } from './context/SectionContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { sections, addStudent, fetchStudents, startAutoRefresh, stopAutoRefresh } = useStudentStore();
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminKeyPressed, setAdminKeyPressed] = useState(0);

  useEffect(() => {
    // بدء التحديث التلقائي عند تحميل التطبيق
    startAutoRefresh();

    // إيقاف التحديث التلقائي عند إغلاق التطبيق
    return () => stopAutoRefresh();
  }, [startAutoRefresh, stopAutoRefresh]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        e.preventDefault(); // منع السلوك الافتراضي
        setAdminKeyPressed(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setShowAdmin(true);
            return 0;
          }
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddStudent = async (name: string, section: SectionType) => {
    const result = await addStudent(name, section);
    return result;
  };

  return (
    <SectionProvider>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<AllSections sections={sections} />} />
          <Route path="/section/:sectionId" element={<SingleSection sections={sections} />} />
        </Routes>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              direction: 'rtl'
            },
          }}
        />
      </div>
    </SectionProvider>
  );
}

export default App;
