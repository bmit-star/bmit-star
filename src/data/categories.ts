export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredFields: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'time' | 'schedule' | 'dresscode' | 'map' | 'gallery' | 'music' | 'toggle' | 'customFields';
    placeholder?: string;
    required: boolean;
  }>;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'wedding',
    name: 'Хурим',
    icon: '💍',
    description: 'Гал голомтоо бадрааж буй хуримын баярын тансаг урилга',
    requiredFields: [
      { key: 'brideName', label: 'Сүйт бүсгүйн нэр', type: 'text', placeholder: 'Б.Анужин', required: true },
      { key: 'groomName', label: 'Сүйт залуугийн нэр', type: 'text', placeholder: 'Э.Бат-Эрдэнэ', required: true },
      { key: 'brideParents', label: 'Сүйт бүсгүйн эцэг эхийн нэр', type: 'text', placeholder: 'Ээж Б.Оюунчимэг, Аав Ч.Батбаяр', required: true },
      { key: 'groomParents', label: 'Сүйт залуугийн эцэг эхийн нэр', type: 'text', placeholder: 'Ээж Д.Туяа, Аав Э.Эрдэнэбат', required: true },
      { key: 'eventTitle', label: 'Урилгын гарчиг', type: 'text', placeholder: 'Анужин & Бат-Эрдэнэ нарын Хуримын Баяр', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Эцэг эхийн дээд ерөөлөөр гал голомтоо засаж буй хуримын баярт маань хүрэлцэн ирж ерөөлийн үгээ хайрлана уу.', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 8 сарын 15 (Бямба гараг)', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '16:00 цагт', required: true },
      { key: 'locationName', label: 'Хүлээн авалтын газар', type: 'text', placeholder: 'Шангри-Ла Улаанбаатар, Их Танхим', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Сүхбаатар дүүрэг, Олимпийн гудамж 19', required: true },
      { key: 'googleMapsEmbedUrl', label: 'Google Map линк/байршил', type: 'map', placeholder: 'https://maps.google.com/...', required: false },
      { key: 'schedule', label: 'Хуримын хөтөлбөр', type: 'schedule', required: true },
      { key: 'dressCode', label: 'Dress Code (Дресс код)', type: 'dresscode', required: false },
      { key: 'showRsvp', label: 'RSVP (Ирц баталгаажуулах)', type: 'toggle', required: true },
      { key: 'showQrCode', label: 'QR Code', type: 'toggle', required: true },
      { key: 'showCountdown', label: 'Countdown (Цаг тоологч)', type: 'toggle', required: true },
      { key: 'couplePhotos', label: 'Галерей (Зургууд)', type: 'gallery', required: false },
      { key: 'backgroundMusicUrl', label: 'Хөгжим (Арын аялгуу)', type: 'music', required: false }
    ]
  },
  {
    id: 'birthday',
    name: 'Төрсөн өдөр',
    icon: '🎂',
    description: 'Насны баяр, төрсөн өдрийн урилга',
    requiredFields: [
      { key: 'birthdayPersonName', label: 'Төрсөн өдрийн эзний нэр', type: 'text', placeholder: 'Н.Билгүүн', required: true },
      { key: 'age', label: 'Нас', type: 'text', placeholder: '25 нас / 30 нас', required: true },
      { key: 'eventTitle', label: 'Урилгын гарчиг', type: 'text', placeholder: 'Билгүүний 30 насны ойн баяр', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 9 сарын 10', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '18:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Lounge & Restaurant "Sky Lounge"', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Хан-Уул дүүрэг, Зайсан гудамж 15', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Миний 30 насны ой тохиож байгаа тул дотны найзууд, ах дүү та бүхнийг нэгэн үдшийг дурсамжтай өнгөрүүлэхийг урьж байна.', required: true },
      { key: 'showRsvp', label: 'RSVP (Ирц баталгаажуулах)', type: 'toggle', required: true },
      { key: 'showCountdown', label: 'Countdown (Тоологч)', type: 'toggle', required: true },
      { key: 'backgroundMusicUrl', label: 'Music (Хөгжим)', type: 'music', required: false }
    ]
  },
  {
    id: 'kids_party',
    name: 'Хүүхдийн баяр',
    icon: '👶',
    description: 'Хүүхдийн насны ой, хүүхдийн баярын урилга',
    requiredFields: [
      { key: 'childName', label: 'Хүүхдийн нэр', type: 'text', placeholder: 'Б.Амин-Эрдэнэ', required: true },
      { key: 'age', label: 'Нас', type: 'text', placeholder: '1 нас (Мөнгөн хонхны баяр)', required: true },
      { key: 'parentsNames', label: 'Эцэг эх', type: 'text', placeholder: 'Аав Т.Баттулга, Ээж С.Ариунаа', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 6 сарын 01', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '13:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Kids Park & Entertainment Hall', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Баянгол дүүрэг, Энхтайваны өргөн чөлөө', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Амин-Эрдэнэ охины маань 1 насны ой тохиож байгаа тул ах дүү, нагац, танил та бүхнээ баярт маань урьж байна.', required: true },
      { key: 'showRsvp', label: 'RSVP (Ирц баталгаажуулах)', type: 'toggle', required: true }
    ]
  },
  {
    id: 'hair_cut',
    name: 'Сэвлэг үргээх ёслол',
    icon: '👶',
    description: 'Хүүхдийн даахь угаах, сэвлэг үргээх уламжлалт баяр',
    requiredFields: [
      { key: 'childName', label: 'Хүүхдийн нэр', type: 'text', placeholder: 'Э.Бат-Ирээдүй', required: true },
      { key: 'birthDate', label: 'Төрсөн огноо', type: 'text', placeholder: '2023 оны 5 сарын 10', required: true },
      { key: 'fatherName', label: 'Аавын нэр', type: 'text', placeholder: 'Г.Эрдэнэбаатар', required: true },
      { key: 'motherName', label: 'Ээжийн нэр', type: 'text', placeholder: 'Д.Алтанцэцэг', required: true },
      { key: 'date', label: 'Сэвлэг үргээх өдөр', type: 'text', placeholder: '2026 оны 10 сарын 05 (Наран ургах нартай өдөр)', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '11:00 цагт', required: true },
      { key: 'locationName', label: 'Ёслолын газар', type: 'text', placeholder: 'Гэр ресторан "Монгол Өргөө"', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Хан-Уул дүүрэг, Богд уулын бэл', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Хүү Бат-Ирээдүйн маань сэвлэг үргээх хүндэтгэлийн ёслол тохиож байгаа тул та бүхнийг морилон ирэхийг урьж байна.', required: true },
      { key: 'blessingText', label: 'Ерөөл', type: 'textarea', placeholder: 'Хүү маань урт насалж, уудаг ус шиг тунгалаг, ургах наран шиг гэрэлтэй явах болтугай.', required: false },
      { key: 'showRsvp', label: 'RSVP (Ирц баталгаажуулах)', type: 'toggle', required: true }
    ]
  },
  {
    id: 'clan_reunion',
    name: 'Ургийн баяр',
    icon: '👨‍👩‍👧‍👦',
    description: 'Овог аймаг, ургийн уулзалт, уламжлалт баяр',
    requiredFields: [
      { key: 'clanName', label: 'Ургийн нэр', type: 'text', placeholder: 'Боржигон Ураг', required: true },
      { key: 'familySurname', label: 'Овгийн нэр', type: 'text', placeholder: 'Алтан Овог', required: true },
      { key: 'clanLeader', label: 'Ургийн ахлагч', type: 'text', placeholder: 'Ахлагч Б.Дамдинсүрэн', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 7 сарын 25', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '10:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Аялал жуулчлалын цогцолбор "Тэрэлж"', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Горхи Тэрэлжийн байгалийн цогцолбор газар', required: true },
      { key: 'schedule', label: 'Хөтөлбөр', type: 'schedule', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Боржигон ургийн залгамж халаа, ах дүү, үе удмаараа цугларан ураг төрлөө бэхжүүлэх баярт хүрэлцэн ирнэ үү.', required: true }
    ]
  },
  {
    id: 'graduation',
    name: 'Төгсөлт',
    icon: '🎓',
    description: 'Сургууль, анги хамт олны төгсөлтийн баяр',
    requiredFields: [
      { key: 'graduateName', label: 'Төгсөгчийн нэр', type: 'text', placeholder: 'М.Тэмүүлэн', required: true },
      { key: 'schoolName', label: 'Сургууль', type: 'text', placeholder: 'МУИС - Мэдээллийн Технологийн Сургууль', required: true },
      { key: 'className', label: 'Анги', type: 'text', placeholder: 'Программ Хангамж 4-р анги', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 6 сарын 20', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '15:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'МУИС-ийн Эрдмийн Танхим ба Баярын Эвент Холл', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Сүхбаатар дүүрэг, Их Сургуулийн гудамж 1', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: '4 жилийн эрдмийн аяллаа амжилттай дүүргэж бакалаврын зэрэг хамгаалсан баяраа та бүхэнтэйгээ хуваалцахад бэлэн байна.', required: true }
    ]
  },
  {
    id: 'corporate',
    name: 'Байгууллагын арга хэмжээ',
    icon: '🏢',
    description: 'Компани, байгууллагын ойн баяр, гала эвент',
    requiredFields: [
      { key: 'companyName', label: 'Байгууллагын нэр', type: 'text', placeholder: '"Говь" ХК', required: true },
      { key: 'eventTitle', label: 'Арга хэмжээний нэр', type: 'text', placeholder: 'Үүсэн байгуулагдсаны 40 жилийн ойн Гала үдэшлэг', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 11 сарын 15', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '18:30 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Corporate Hotel & Convention Centre', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Хан-Уул дүүрэг, Махатма Гандийн гудамж', required: true },
      { key: 'schedule', label: 'Хөтөлбөр', type: 'schedule', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Манай байгууллагын амжилтын түүхийг хамтдаа бүтээлцсэн эрхэм харилцагч, хамтран ажиллагч таныг ойн хүндэтгэлийн арга хэмжээнд урьж байна.', required: true },
      { key: 'showRsvp', label: 'RSVP (Ирц баталгаажуулах)', type: 'toggle', required: true }
    ]
  },
  {
    id: 'grand_opening',
    name: 'Нээлт',
    icon: '🏠',
    description: 'Шинэ салбар, дэлгүүр, оффис, рестораны нээлтийн урилга',
    requiredFields: [
      { key: 'companyName', label: 'Байгууллагын нэр', type: 'text', placeholder: '"Аура" Ресторан & Lounge', required: true },
      { key: 'eventTitle', label: 'Нээлтийн нэр', type: 'text', placeholder: 'Аура Тансаг Рестораны Албан Ёсны Нээлт', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 10 сарын 01', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '17:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Аура Цогцолбор 1-р давхар', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө 42', required: true },
      { key: 'googleMapsEmbedUrl', label: 'Google Map', type: 'map', required: false },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Тансаг орчин, амтат хоолны шинэ ертөнцийг нээж буй манай нээлтийн тууз хайчлах ёслолд морилон ирнэ үү.', required: true }
    ]
  },
  {
    id: 'party',
    name: 'Үдэшлэг',
    icon: '🎉',
    description: 'Найз нөхдийн үдэшлэг, шинэ жил, коктейль парти',
    requiredFields: [
      { key: 'eventTitle', label: 'Арга хэмжээний нэр', type: 'text', placeholder: 'Golden Gatsby Cocktail Party', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 12 сарын 31', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '20:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Rooftop Bar "The View"', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Сүхбаатар талбайн баруун тал', required: true },
      { key: 'dressCode', label: 'Dress Code', type: 'dresscode', required: false },
      { key: 'showRsvp', label: 'RSVP (Ирц баталгаажуулах)', type: 'toggle', required: true }
    ]
  },
  {
    id: 'award_ceremony',
    name: 'Шагнал гардуулах',
    icon: '🏆',
    description: 'Оны ширдгүүдийг тодруулах, шагнал гардуулах ёслол',
    requiredFields: [
      { key: 'companyName', label: 'Байгууллагын нэр', type: 'text', placeholder: 'Монголын Бизнес Холбоо', required: true },
      { key: 'eventTitle', label: 'Арга хэмжээ', type: 'text', placeholder: 'Оны Шидэг Аж Ахуйн Нэгж Шагнал Гардуулах Ёслол', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 12 сарын 20', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '18:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Соёлын Төв Өргөө', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Сүхбаатар дүүрэг, Амар гудамж 2', required: true },
      { key: 'schedule', label: 'Хөтөлбөр', type: 'schedule', required: true }
    ]
  },
  {
    id: 'traditional',
    name: 'Уламжлалт ёслол',
    icon: '🕌',
    description: 'Цагаан сар, наадам, уламжлалт хүндэтгэлийн ёслол',
    requiredFields: [
      { key: 'eventTitle', label: 'Ёслолын нэр', type: 'text', placeholder: 'Сар шинийн золголт & Хүндэтгэлийн Зоог', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 2 сарын 18', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '12:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Нүүдэлчдийн Өв Соёлын Төв', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Төв аймаг, Зуунмод сум', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Эртний уламжлалт наран сартай золгох баяраар ах дүүс, эрдэмт мэргэд та бүхнийг морилон ирэхийг урьж байна.', required: true }
    ]
  },
  {
    id: 'memorial',
    name: 'Дурсгалын арга хэмжээ',
    icon: '🌸',
    description: 'Талийгаачийн дурсгалыг хүндэтгэх, буян үйлдэх ёслол',
    requiredFields: [
      { key: 'deceasedName', label: 'Талийгаачийн нэр', type: 'text', placeholder: 'Эрхэм Б.Баатар', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 9 сарын 05', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '11:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Буяны Төв ба Хүндэтгэлийн Өргөө', required: true },
      { key: 'address', label: 'Хаяг', type: 'text', placeholder: 'Баянзүрх дүүрэг, Энхтайваны өргөн чөлөө', required: true },
      { key: 'invitationMessage', label: 'Дурсамжийн үг', type: 'textarea', placeholder: 'Эрхэм хүмүүний нандин чанар, гэгээн дурсгалыг хүндэтгэн буян үйлдэх баярт хүрэлцэн ирнэ үү.', required: true }
    ]
  },
  {
    id: 'custom',
    name: 'Бусад',
    icon: '✨',
    description: 'АДМИН ӨӨРӨӨ ТАЛБАРУУДЫГ ҮҮСГЭХ ДИНАМИК ЗАГВАР',
    requiredFields: [
      { key: 'eventTitle', label: 'Урилгын гарчиг', type: 'text', placeholder: 'Тусгай Арга Хэмжээний Урилга', required: true },
      { key: 'date', label: 'Огноо', type: 'text', placeholder: '2026 оны 10 сарын 20', required: true },
      { key: 'time', label: 'Цаг', type: 'text', placeholder: '17:00 цагт', required: true },
      { key: 'locationName', label: 'Байршил', type: 'text', placeholder: 'Event Hall', required: true },
      { key: 'invitationMessage', label: 'Урилгын текст', type: 'textarea', placeholder: 'Урилгын дэлгэрэнгүй тайлбар...', required: true },
      { key: 'customFields', label: 'Админы Дурын Нэмэлт Талбарууд', type: 'customFields', required: false }
    ]
  }
];

export function getCategoryConfig(categoryName: string): CategoryConfig {
  const found = CATEGORIES.find(
    c => c.name.toLowerCase() === categoryName.toLowerCase() || c.id === categoryName.toLowerCase()
  );
  return found || CATEGORIES[0];
}
