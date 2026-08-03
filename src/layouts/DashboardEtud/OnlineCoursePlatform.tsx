import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  PlayCircle,
  Video,
} from 'lucide-react';

type ActivityStatus = 'A faire' | 'En cours' | 'Termine';
type LessonStatus = 'Termine' | 'En cours' | 'Bloque';
type StudentFormationType = 'initiale' | 'continue' | 'enligne';

type Activity = {
  id: string;
  type: 'devoir' | 'quiz';
  title: string;
  dueDate: string;
  status: ActivityStatus;
  description: string;
};

type Lesson = {
  id: string;
  title: string;
  duration: string;
  status: LessonStatus;
};

type Resource = {
  name: string;
  size: string;
};

type OnlineCourse = {
  id: string;
  code: string;
  title: string;
  teacher: string;
  progress: number;
  currentLesson: string;
  lessons: Lesson[];
  activities: Activity[];
  resources: Resource[];
};

const DEMO_COURSES: OnlineCourse[] = [
  {
    id: 'm-3',
    code: 'INF303',
    title: 'Bases de Donnees Relationnelles',
    teacher: 'Mme. RAKOTOMALALA Feno',
    progress: 90,
    currentLesson: 'Normalisation 3NF / BCNF',
    lessons: [
      { id: 'l1', title: 'Introduction aux modeles relationnels', duration: '18 min', status: 'Termine' },
      { id: 'l2', title: 'Dependances fonctionnelles', duration: '24 min', status: 'Termine' },
      { id: 'l3', title: 'Normalisation 3NF / BCNF', duration: '31 min', status: 'En cours' },
      { id: 'l4', title: 'Transactions et indexation', duration: '28 min', status: 'Bloque' },
    ],
    activities: [
      {
        id: 'a1',
        type: 'devoir',
        title: 'Projet BDD - schema relationnel',
        dueDate: '12 juillet 2026',
        status: 'Termine',
        description: 'Deposer le modele relationnel, les contraintes et le script SQL.',
      },
      {
        id: 'a2',
        type: 'quiz',
        title: 'Quiz normalisation 3NF / BCNF',
        dueDate: 'Disponible',
        status: 'A faire',
        description: '10 questions pour verifier les formes normales et les dependances.',
      },
    ],
    resources: [
      { name: 'Ch02_Normalisation_3NF_BCNF.pdf', size: '1.2 MB' },
      { name: 'Projet_BDD_Sujet_2026.pdf', size: '620 KB' },
      { name: 'Dataset_exercice_sql.zip', size: '940 KB' },
    ],
  },
  {
    id: 'm-4',
    code: 'INF304',
    title: 'Developpement Web Full-Stack (React / Node)',
    teacher: 'M. RANDRIANARISOA Mamy',
    progress: 45,
    currentLesson: 'Hooks React et consommation API',
    lessons: [
      { id: 'l1', title: 'Architecture Vite et React', duration: '22 min', status: 'Termine' },
      { id: 'l2', title: 'Hooks React et consommation API', duration: '36 min', status: 'En cours' },
      { id: 'l3', title: 'Routes protegees et dashboard', duration: '41 min', status: 'Bloque' },
      { id: 'l4', title: 'Integration Node et Express', duration: '34 min', status: 'Bloque' },
    ],
    activities: [
      {
        id: 'a1',
        type: 'devoir',
        title: 'Mini-projet dashboard React',
        dueDate: '18 juillet 2026',
        status: 'En cours',
        description: 'Construire une interface dashboard avec composants reutilisables.',
      },
      {
        id: 'a2',
        type: 'quiz',
        title: 'Quiz hooks React et API REST',
        dueDate: 'Disponible',
        status: 'A faire',
        description: 'Questions rapides sur useState, useMemo, fetch et methodes HTTP.',
      },
    ],
    resources: [
      { name: 'Syllabus_Vite_TypeScript.pdf', size: '950 KB' },
      { name: 'Boilerplate_React_Tailwind.zip', size: '1.1 MB' },
      { name: 'Correction_fetch_hooks.pdf', size: '730 KB' },
    ],
  },
];

const isStudentFormationType = (value: string | null): value is StudentFormationType =>
  value === 'initiale' || value === 'continue' || value === 'enligne';

const getConnectedFormationType = (): StudentFormationType | null => {
  if (typeof window === 'undefined') return null;
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;
    const value = window.localStorage.getItem(key);
    if (isStudentFormationType(value)) return value;
  }
  return null;
};

export default function OnlineCoursePlatform() {
  const { courseId } = useParams();
  const [connectedFormationType] = useState<StudentFormationType | null>(() => getConnectedFormationType());
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<OnlineCourse | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (connectedFormationType !== 'enligne') {
          setCourse(null);
          return;
        }

        const fallback = DEMO_COURSES.find((item) => item.id === courseId) ?? DEMO_COURSES[0];
        setCourse(fallback);
        setSelectedLessonId(fallback.lessons.find((lesson) => lesson.status === 'En cours')?.id ?? fallback.lessons[0]?.id ?? '');
      } catch (error) {
        console.error('Erreur lors du chargement du cours en ligne :', error);
        const fallback = DEMO_COURSES.find((item) => item.id === courseId) ?? DEMO_COURSES[0];
        setCourse(fallback);
        setSelectedLessonId(fallback.lessons.find((lesson) => lesson.status === 'En cours')?.id ?? fallback.lessons[0]?.id ?? '');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [connectedFormationType, courseId]);

  const activeLesson = useMemo(() => {
    if (!course) return null;
    return course.lessons.find((lesson) => lesson.id === selectedLessonId) ?? course.lessons[0] ?? null;
  }, [course, selectedLessonId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 opacity-60 text-xs">
        <Loader2 size={28} className="animate-spin text-emerald-600" />
        <p className="font-bold">Chargement de votre espace e-learning...</p>
      </div>
    );
  }

  if (connectedFormationType !== 'enligne' || !course) {
    return (
      <div className="max-w-3xl space-y-4 pb-12">
        <Link to="/etudiants/cours" className="inline-flex items-center gap-2 text-xs font-black opacity-70 hover:opacity-100">
          <ArrowLeft size={14} /> Retour aux formations
        </Link>
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <BookOpen className="mx-auto text-emerald-600" size={32} />
          <h1 className="mt-4 text-lg font-black">Cours en ligne indisponible</h1>
          <p className="mt-2 text-xs opacity-55">
            Les quiz et la plateforme e-learning sont reserves aux formations en ligne.
          </p>
        </div>
      </div>
    );
  }

  const typeColor = (status: string) => {
    if (status === 'Termine') return '#22c55e';
    if (status === 'En cours') return '#3b82f6';
    return '#f59e0b';
  };

  return (
    <div className="max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="text-[var(--primary)]" size={24} />
            {course.title}
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            {course.code} · {course.teacher}
          </p>
        </div>

        <Link
          to="/etudiants/cours"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold"
          style={{ borderColor: 'var(--border)' }}
        >
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-5">
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-black tracking-wider opacity-45">Progression</div>
                <div className="mt-1 text-sm font-black">{course.progress}% acheve</div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                <CheckCircle2 size={12} /> {activeLesson?.status ?? 'En cours'}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${course.progress}%` }} />
            </div>
            <div className="mt-3 text-xs opacity-55">
              Lecon actuelle: <span className="font-bold">{course.currentLesson}</span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={`https://example.com/course/${course.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold"
                style={{ borderColor: 'var(--border)' }}
              >
                <ExternalLink size={14} /> Ouvrir la plateforme
              </a>
              <button
                type="button"
                onClick={() => alert(`Telechargement des ressources du cours ${course.code}`)}
                className="flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold"
                style={{ borderColor: 'var(--border)' }}
              >
                <Download size={14} /> Télécharger les ressources
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-black mb-3">
                <PlayCircle size={14} className="text-[var(--primary)]" />
                Lecons
              </div>
              <div className="space-y-2">
                {course.lessons.map((lesson) => {
                  const active = lesson.id === activeLesson?.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className="w-full rounded-xl border p-4 text-left flex items-center justify-between gap-4"
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: active ? 'rgba(34,197,94,0.06)' : 'transparent',
                      }}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{lesson.title}</div>
                        <div className="text-[11px] opacity-50 mt-0.5">{lesson.duration}</div>
                      </div>
                      <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ backgroundColor: `${typeColor(lesson.status)}18`, color: typeColor(lesson.status) }}>
                        {lesson.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 text-sm font-black tracking-tight">
                <FileText size={14} className="text-[var(--primary)]" />
                Activites
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {course.activities.map((activity) => (
                <div key={activity.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-bold">{activity.title}</div>
                    <div className="text-[11px] opacity-55 mt-1">{activity.description}</div>
                    <div className="text-[10px] opacity-45 mt-1">{activity.dueDate}</div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ backgroundColor: `${typeColor(activity.status)}18`, color: typeColor(activity.status) }}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 text-sm font-black tracking-tight">
                <Video size={14} className="text-[var(--primary)]" />
                Ressources
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {course.resources.map((resource, index) => (
                <div key={index} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{resource.name}</div>
                    <div className="text-[11px] opacity-55 mt-1">{resource.size}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Telechargement: ${resource.name}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Download size={12} />
                    Telecharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
