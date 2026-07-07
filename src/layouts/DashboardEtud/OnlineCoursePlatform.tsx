import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  HelpCircle,
  PlayCircle,
  Send,
  Video,
} from 'lucide-react';

type ActivityStatus = 'A faire' | 'En cours' | 'Termine';

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
  status: 'Termine' | 'En cours' | 'Bloque';
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

type StudentFormationType = 'initiale' | 'continue' | 'enligne';

const ONLINE_COURSES: OnlineCourse[] = [
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

const statusStyles: Record<ActivityStatus, string> = {
  'A faire': 'bg-amber-500/10 text-amber-600',
  'En cours': 'bg-blue-500/10 text-blue-600',
  Termine: 'bg-emerald-500/10 text-emerald-600',
};

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
  const foundCourse = ONLINE_COURSES.find((item) => item.id === courseId);
  const course = foundCourse ?? ONLINE_COURSES[0];
  const [selectedLessonId, setSelectedLessonId] = useState(course.lessons.find((lesson) => lesson.status === 'En cours')?.id ?? course.lessons[0].id);

  const selectedLesson = useMemo(
    () => course.lessons.find((lesson) => lesson.id === selectedLessonId) ?? course.lessons[0],
    [course.lessons, selectedLessonId],
  );

  const devoirs = course.activities.filter((activity) => activity.type === 'devoir');
  const quiz = course.activities.filter((activity) => activity.type === 'quiz');

  if (!foundCourse || connectedFormationType !== 'enligne') {
    return (
      <div className="max-w-3xl space-y-4 pb-12">
        <Link
          to="/etudiants/cours"
          className="inline-flex items-center gap-2 text-xs font-black opacity-70 transition hover:opacity-100"
        >
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

  return (
    <div className="max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link
            to="/etudiants/cours"
            className="inline-flex items-center gap-2 text-xs font-black opacity-70 transition hover:opacity-100"
          >
            <ArrowLeft size={14} /> Retour aux formations
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">{course.code}</p>
            <h1 className="mt-1 text-xl font-black tracking-tight md:text-2xl">{course.title}</h1>
            <p className="mt-1 text-xs opacity-55">Plateforme e-learning creee pour cette formation en ligne.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <p className="font-black">{course.progress}%</p>
            <p className="text-[10px] opacity-50">Progression</p>
          </div>
          <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <p className="font-black">{devoirs.length}</p>
            <p className="text-[10px] opacity-50">Devoirs</p>
          </div>
          <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <p className="font-black">{quiz.length}</p>
            <p className="text-[10px] opacity-50">Quiz</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="flex aspect-video min-h-[260px] items-center justify-center bg-neutral-950 text-white">
              <div className="text-center">
                <PlayCircle className="mx-auto text-emerald-500" size={56} />
                <p className="mt-4 text-lg font-black">{selectedLesson.title}</p>
                <p className="mt-1 text-xs opacity-60">Cours video - {selectedLesson.duration}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-black">Lecon actuelle</p>
                <p className="text-xs opacity-55">{course.currentLesson} - {course.teacher}</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                Continuer <Video size={14} />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-600" />
              <h2 className="text-sm font-black">Programme du cours</h2>
            </div>
            <div className="grid gap-2">
              {course.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  disabled={lesson.status === 'Bloque'}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-45"
                  style={{
                    borderColor: selectedLesson.id === lesson.id ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedLesson.id === lesson.id ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                  }}
                >
                  <span className="font-bold">{lesson.title}</span>
                  <span className="opacity-55">{lesson.duration} - {lesson.status}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-emerald-600" />
              <h2 className="text-sm font-black">Devoirs</h2>
            </div>
            <div className="space-y-3">
              {devoirs.map((activity) => (
                <div key={activity.id} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black">{activity.title}</p>
                      <p className="mt-1 text-[10px] opacity-55">{activity.description}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${statusStyles[activity.status]}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold opacity-50">Echeance : {activity.dueDate}</p>
                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2 text-[10px] font-black hover:border-emerald-500">
                    <Send size={12} /> Deposer un fichier
                    <input type="file" className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle size={16} className="text-indigo-500" />
              <h2 className="text-sm font-black">Quiz</h2>
            </div>
            <div className="space-y-3">
              {quiz.map((activity) => (
                <div key={activity.id} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-black">{activity.title}</p>
                  <p className="mt-1 text-[10px] opacity-55">{activity.description}</p>
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black text-white">
                    Commencer le quiz <CheckCircle2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              <h2 className="text-sm font-black">Ressources</h2>
            </div>
            <div className="space-y-2">
              {course.resources.map((resource) => (
                <button
                  key={resource.name}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="truncate font-bold">{resource.name}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] opacity-55">
                    {resource.size} <Download size={12} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
