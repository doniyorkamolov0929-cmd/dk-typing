/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. Standard Sentences (Muntazam gaplar)
export const UZ_SENTENCES: string[] = [
  "Insonning tili uning ma'naviy qiyofasini, madaniyati va ichki dunyosini aks ettiruvchi ko'zgudir.",
  "Kompyuter texnologiyalari va dasturlash tillari hozirgi zamon talablarining eng yuqori cho'qqisida turibdi.",
  "Klaviatura orqali tez va aniq yozish ko'nikmasi ish samaradorligini o'n barobargacha oshirishi ilmiy isbotlangan.",
  "Har bir narsaning o'z vaqt-soati bor, qunt bilan o'rganilgan hunar hech qachon egasini yarim yo'lda qoldirmaydi.",
  "O'zbekiston zaminida buyuk allomalar, matematiklar va astronomlar yetishib chiqqanini butun dunyo e'tirof etadi.",
  "Dasturchi bo'lish uchun nafaqat kod yozishni, balki murakkab muammo va darslarga kreativ yechimlar topishni ham bilish lozim.",
  "Vaqt g'oyatda tez o'tuvchi qimmatbaho resursdir, uni bekorchi ishlarga sarflash kelajakda afsuslanishga olib keladi.",
  "Ona tili millatning ruhini, uning tarixiy merosi va milliy o'zligini saqlab qoluvchi buyuk kuchdir.",
  "Bilim yulduzlar kabi zulmat yo'llarni yoritadi va insonni ezgu maqsadlar sari yetaklashda davom etadi.",
  "Doimiy mashg'ulotlar orqali barmoqlar mushak xotirasi mustahkamlanadi va klaviaturaga qaramasdan yozish osonlashadi.",
  "Kelajak innovatsiyalar va sun'iy intellekt davridir, buni tushungan har bir yosh bugundan boshlab harakat qilmoqda.",
  "O'z oldingizga aniq maqsad qo'ying va har kuni shu maqsad sari kichik bo'lsa ham qadam tashlashni kanda qilmang."
];

export const EN_SENTENCES: string[] = [
  "The quick brown fox jumps over the lazy dog which has been a traditional typing test sentence for decades.",
  "Developing robust software architectures requires continuous practice, strong focus, and elegant logical designs.",
  "Mastering touch typing can significantly boost your coding productivity and reduce your everyday working fatigue.",
  "JavaScript is an extremely versatile programming language that powers modern reactive web applications worldwide.",
  "Beautiful visual themes combined with perfect typography compose highly engaging user interfaces that users love.",
  "Artificial intelligence and deep machine learning algorithms are completely transforming industries and technologies.",
  "Consistency is the true bridge between setting high ambitious goals and actually accomplishing major milestones."
];

// 2. Beautiful Quotes (Mashhur Iqtiboslar) with Author Attributions
export interface Quote {
  text: string;
  author: string;
}

export const UZ_QUOTES: Quote[] = [
  { text: "Ilm o'rganing, chunki u zulmatda chiroq, g'urbatda yo'ldosh, yolg'izlikda sirdoshdir.", author: "Al-Xorazmiy" },
  { text: "Kuch adolatda bo'lmasa, adolat kuchsiz bo'ladi. Har qanday ishning poydevori adolatda yashiringandir.", author: "Amir Temur" },
  { text: "Baxtli bo'lishni istasang, o'zing bilan birga boshqalarni ham xursand qilishga urin.", author: "Abu Rayhon Beruniy" },
  { text: "Kelajakka poydevor qo'yishni bugundagi intizom va tinimsiz ilmiy izlanishdan boshlash zarur.", author: "Al-Farobiy" },
  { text: "Asl dasturchi, xuddi mohir kitobxon kabi, murakkab masalalar ichidan eng sodda va nafis mantiqni qidiradi.", author: "Doniyor Kamolov" }, // Creator tribute in quotes
  { text: "O'z vaqtida bajarilgan mehnat kelajakda buyuk darajalar va oltin muvaffaqiyatlar poydevoriga aylanadi.", author: "Ibn Sino" },
  { text: "G'oya narsalarni o'zgartiradi, biroq uni hayotga tatbiq etish faqat sabr va qat'iyat bilan amalga oshadi.", author: "Mirzo Ulug'bek" }
];

export const EN_QUOTES: Quote[] = [
  { text: "Talk is cheap. Show me the code. Clean structure always triumphs over unmanaged designs.", author: "Linus Torvalds" },
  { text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.", author: "Steve Jobs" },
  { text: "First, solve the problem. Then, write the code. Complexity is your enemy.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency. Keep your functions pure and write robust software layers.", author: "Austin Freeman" },
  { text: "DK-Typing provides clean interactive spaces where typists perfect their speed and developers train syntax.", author: "Doniyor Kamolov" },
  { text: "Code is like humor. When you have to explain it, it is bad. Aim for maximum clarity.", author: "Cory House" }
];

// 3. Programmer Syntax Templates (Dasturchilar rejimi)
// Heavy in curly braces, quotes, brackets, semicolons and keywords to train programming muscles
export const CODE_TEMPLATES: Record<string, string[]> = {
  javascript: [
    "const [data, setData] = useState({ user: 'Doniyor', speed: 120, ready: true });",
    "export function calculateWpm(chars, minutes) { return Math.round((chars / 5) / minutes); }",
    "app.get('/api/v1/typing/stats', async (req, res) => { return res.status(200).json({ status: 'active' }); });",
    "const filtered = history.filter(item => item.accuracy >= 95).map(item => item.wpm);",
    "useEffect(() => { const timer = setInterval(() => tick(), 1000); return () => clearInterval(timer); }, []);"
  ],
  python: [
    "def calculate_user_metrics(profile: dict, history_list: list) -> dict:\n    return {'fullName': profile['fullName'], 'wpm_average': sum(history_list) / len(history_list)}",
    "class TypingTracker:\n    def __init__(self, username: str):\n        self.username = username\n        self.history = []",
    "if __name__ == '__main__':\n    app.run(host='0.0.0.0', port=3000, debug=False, ssl_context='adhoc')",
    "results = [r for r in raw_data if r.get('accuracy', 0) > 90 and r.get('wpm') >= 60]"
  ],
  html_css: [
    "<div className='flex items-center justify-between p-6 bg-slate-900/40 rounded-3xl border border-cyan-500/20 shadow-lg text-cyan-400'>",
    "<button id='update-pwa-button' onClick={handleReload} className='px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-all'>",
    "@media (min-width: 1024px) { .sidebar-rail { display: flex; width: 20rem; border-right: 1px solid rgba(255,255,255,0.1); } }",
    "<meta name='description' content='DK-Typing - Doniyor Kamolov tomonidan yaratilgan yozish tezligi platformasi' />"
  ],
  cpp: [
    "#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::cout << \"DK-Typing System online!\" << std::endl;\n    return 0;\n}",
    "template <typename T>\nclass TypingNode {\nprivate:\n    T value;\n    TypingNode* next;\npublic:\n    TypingNode(T val) : value(val), next(nullptr) {}\n};",
    "for (int i = 0; i < lessons.size(); ++i) {\n    if (lessons[i].stars >= 2) {\n        unlocked[i + 1] = true;\n    }\n}"
  ]
};

// Unified selection helper
export function getRandomTestText(
  lang: 'uz' | 'en',
  mode: 'time' | 'words' | 'quote' | 'zen' | 'code',
  codeLang: string = 'javascript',
  sentenceCount: number = 3
): string {
  if (mode === 'code') {
    const list = CODE_TEMPLATES[codeLang] || CODE_TEMPLATES['javascript'];
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(shuffled.length, 3)).join("\n\n");
  }

  if (mode === 'quote') {
    const list = lang === 'uz' ? UZ_QUOTES : EN_QUOTES;
    const selected = list[Math.floor(Math.random() * list.length)];
    return `"${selected.text}"\n\n— ${selected.author}`;
  }

  // Standard generator for zen, sentences, or word modes
  const list = lang === 'uz' ? UZ_SENTENCES : EN_SENTENCES;
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(shuffled.length, sentenceCount)).join(" ");
}

export function getRandomParagraph(lang: 'uz' | 'en', count: number = 3): string {
  const sentences = lang === 'uz' ? UZ_SENTENCES : EN_SENTENCES;
  const shuffled = [...sentences].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}
