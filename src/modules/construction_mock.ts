export interface ConstructionResponseDto {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  area: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  likesCount: number;
  creator_id: number;
  isCreator: number; 
  status: string; 
  isLiked: number;
  createdAt: Date;
  formationDate: Date;
}

export const CONSTRUCTION_MOCK: ConstructionResponseDto[] = [
  {
    id: 1,
    title: 'Жилой дом панельный',
    description: 'Панельный жилой дом, 12 этажей, 4 подъезда. Базовые строительно-монтажные работы. Включает устройство фундаментов, возведение коробки здания, а также черновую отделку мест общего пользования.',
    price: 45000,
    area: 5000,
    imageUrl: 'house1.jpg',
    videoUrl: 'house1.mp4',
    likesCount: 2,
    creator_id: 1,
    isCreator: 0,
    status: 'published',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  },
  {
    id: 2,
    title: 'Жилой дом монолитный',
    description: 'Монолитный жилой дом, 25 этажей, подземный паркинг. Базовые строительно-монтажные работы. Предусматривает использование высококачественного бетона, установку скоростных лифтов и благоустройство.',
    price: 68000,
    area: 12000,
    imageUrl: 'house2.jpg',
    videoUrl: 'house2.mp4',
    likesCount: 1,
    creator_id: 1,
    isCreator: 0,
    status: 'published',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  },
  {
    id: 3,
    title: 'Офисный центр',
    description: 'Бизнес-центр класса А, 20 этажей, 5 подъездов. Базовые строительно-монтажные работы. Современные архитектурные решения, системы центрального кондиционирования, вентиляции и умного управления зданием.',
    price: 65000,
    area: 15000,
    imageUrl: 'office.jpg',
    videoUrl: 'office.mp4',
    likesCount: 2,
    creator_id: 1,
    isCreator: 0,
    status: 'published',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  },
  {
    id: 4,
    title: 'Производственный цех',
    description: 'Одноэтажный производственный цех с мостовым краном. Базовые строительно-монтажные работы. Монтаж металлоконструкций, устройство промышленных полов и прокладка усиленных электрических сетей.',
    price: 28000,
    area: 8000,
    imageUrl: 'industry.jpg',
    videoUrl: 'industry.mp4',
    likesCount: 3,
    creator_id: 1,
    isCreator: 0,
    status: 'published',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  },
  {
    id: 5,
    title: 'Школа на 800 мест',
    description: 'Типовой проект школы с бассейном и спортивным залом. Базовые строительно-монтажные работы. Возведение учебных корпусов, спортивного комплекса и столовой в соответствии с государственными стандартами.',
    price: 38000,
    area: 12000,
    imageUrl: 'school.jpg',
    videoUrl: 'school.mp4',
    likesCount: 1,
    creator_id: 1,
    isCreator: 0,
    status: 'published',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  },
  {
    id: 6,
    title: 'Поликлиника',
    description: 'Проект поликлиники (черновик). Комплексное строительство медицинского учреждения с учетом требований к рентген-кабинетам и операционным блокам.',
    price: null,
    area: null,
    imageUrl: 'clinic.jpg',
    videoUrl: 'clinic.mp4',
    likesCount: 0,
    creator_id: 1,
    isCreator: 0,
    status: 'draft',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  },
  {
    id: 7,
    title: 'Офисный центр (старый проект)',
    description: 'Устаревший проект. Базовые строительно-монтажные работы. Устаревший проект, который был выведен из эксплуатации и более не предлагается к реализации.',
    price: 55000,
    area: 10000,
    imageUrl: 'office_old.jpg',
    videoUrl: 'office_old.mp4',
    likesCount: 0,
    creator_id: 1,
    isCreator: 0,
    status: 'deleted',
    isLiked: 0,
    createdAt: new Date(),
    formationDate: new Date()
  }
];