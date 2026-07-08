import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApiService from '../../services/ApiService';
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
  Loader2,
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
  
  // ─── États Dynamiques ───────────────────────────────────
  const [course, setCourse] = useState<OnlineCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  // ─── Récupération du Cours ──────────────────────────────
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId || connectedFormationType !== 'enligne') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      };

      try {
        if (ApiService.etudiant?.getCourseDetails) {
          const res = await ApiService.etudiant.getCourseDetails(courseId, config);
          if (res && res.data) {
            setCourse(res.data);
            // Définir la leçon active par défaut
            const activeLesson = res.data.lessons.find((l: Lesson) => l.status === 'En cours') ?? res.data.lessons[0];
            if (activeLesson) {
              setSelectedLessonId(activeLesson.id);
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails du cours en ligne :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, connectedFormationType]);

  // Leçon sélectionnée via useMemo
  const selectedLesson = useMemo(() => {
    if (!course) return null;
    return course.lessons.find((lesson) => lesson.id === selectedLessonId) ?? course.lessons[0];
  }, [course, selectedLessonId]);

  // Listes d'activités filtrées
  const devoirs = useMemo(() => course?.activities.filter((act) => act.type === 'devoir') ?? [], [course]);
  const quiz = useMemo(() => course?.activities.filter((act) => act.type === 'quiz') ?? [], [course]);

  // Écran de chargement principal
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 opacity-60 text-xs">
        <Loader2 size={28} className="animate-spin text-emerald-600" />
        <p className="font-bold">Chargement de votre espace e-learning...</p>
      </div>
    );
  }

  // Vérification d'accès ou cours introuvable
  if (connectedFormationType !== 'enligne' || !course) {
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
            Les quiz et la plateforme e-learning sont réservés exclusivement aux formations en ligne.
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
            <h1 className="mt-1 textxl font-black tracking-tight md:text-2xl">{course.title}</h1>
            <p className="mt-1 text-xs opacity-55">Plateforme e-learning créée pour cette formation en ligne.</p>
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
              {selectedLesson && (
                <div className="text-center">
                  <PlayCircle className="mx-auto text-emerald-500" size={56} />
                  <p className="mt-4 text-lg font-black">{selectedLesson.title}</p>
                  <p className="mt-1 text-xs opacity-60">Cours vidéo - {selectedLesson.duration}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-black">Leçon actuelle</p>
                <p className="text-xs opacity-55">{course.currentLesson} - {course.teacher}</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white cursor-pointer">
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
                  className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                  style={{
                    borderColor: selectedLessonId === lesson.id ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedLessonId === lesson.id ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
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
                  <p className="mt-3 text-[10px] font-bold opacity-50">Échéance : {activity.dueDate}</p>
                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2 text-[10px] font-black hover:border-emerald-500">
                    <Send size={12} /> Déposer un fichier
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
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black text-white cursor-pointer">
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
                  className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs cursor-pointer"
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