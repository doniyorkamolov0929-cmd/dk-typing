/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number; // 1 to 250
  stage: 'boshlangich' | 'orta' | 'mukammal' | 'murakkab_sozlar' | 'oddiy_matnlar' | 'professional_matnlar' | 'frontend' | 'backend' | 'database' | 'ai_integration' | 'data_structures' | 'system_design';
  number: number; // 1 to 30
  titleUz: string;
  titleEn: string;
  targetKeys: string;
  textUz: string;
  textEn: string;
  altTextUz: string;
  altTextEn: string;
  descriptionUz: string;
  descriptionEn: string;
}

// Generate the 60 progressive lessons
const rawLessons: any[] = [];

// Helper to construct lesson configurations
// 1 to 20: Boshlang'ich
// 21 to 40: O'rta
// 41 to 60: Mukammal

// 1. Home row basics
rawLessons.push({
  id: 1, number: 1,
  titleUz: "Asosiy qator: F va J", titleEn: "Home Row: F and J",
  targetKeys: "f, j, space",
  textUz: "fff jjj fjf jfj ff jj f j f j ff jj ffff jjjj fjfj jfjf",
  textEn: "fff jjj fjf jfj ff jj f j f j ff jj ffff jjjj fjfj jfjf",
  altTextUz: "jjj fff jfj fjf jj ff j f j f jj ff jjjj ffff jfjf fjfj",
  altTextEn: "jjj fff jfj fjf jj ff j f j f jj ff jjjj ffff jfjf fjfj",
  descriptionUz: "Ko'rsatkich barmoqlaringizni F va J tugmalariga qo'ying va mashq qiling. Joy (probel) tugmasini bosh barmog'ingiz bilan bosing.",
  descriptionEn: "Place your index fingers on the F and J keys. Use your thumb to press the Space key."
});

rawLessons.push({
  id: 2, number: 2,
  titleUz: "Asosiy qator: D va K", titleEn: "Home Row: D and K",
  targetKeys: "d, k",
  textUz: "ddd kkk dkd kdk dk kd dd kk d k d k dddd kkkk dkdk kdkd",
  textEn: "ddd kkk dkd kdk dk kd dd kk d k d k dddd kkkk dkdk kdkd",
  altTextUz: "kkk ddd kdk dkd kd dk kk dd k d k d kkkk dddd kdkd dkdk",
  altTextEn: "kkk ddd kdk dkd kd dk kk dd k d k d kkkk dddd kdkd dkdk",
  descriptionUz: "O'rta barmoqlaringizni D va K tugmalariga qo'ying. Joy tugmasini unutmang.",
  descriptionEn: "Place your middle fingers on the D and K keys. Do not forget the Space key."
});

rawLessons.push({
  id: 3, number: 3,
  titleUz: "Asosiy qator: S va L", titleEn: "Home Row: S and L",
  targetKeys: "s, l",
  textUz: "sss lll sls lsl sl ls ss ll s l s l ssss llll slsl lsls",
  textEn: "sss lll sls lsl sl ls ss ll s l s l ssss llll slsl lsls",
  altTextUz: "lll sss lsl sls ls sl ll ss l s l s llll ssss lsls slsl",
  altTextEn: "lll sss lsl sls ls sl ll ss l s l s llll ssss lsls slsl",
  descriptionUz: "Nomisiz barmoqlaringizni S va L tugmalari ustiga joylashtiring.",
  descriptionEn: "Place your ring fingers over the S and L keys."
});

rawLessons.push({
  id: 4, number: 4,
  titleUz: "Asosiy qator: A va Yarim nuqta", titleEn: "Home Row: A and Semicolon",
  targetKeys: "a, ;",
  textUz: "aaa ;;; a;a ;a; a; ;a aa ;; a ; a ; aaaa ;;;; a;a; ;a;a",
  textEn: "aaa ;;; a;a ;a; a; ;a aa ;; a ; a ; aaaa ;;;; a;a; ;a;a",
  altTextUz: ";;; aaa ;a; a;a ;a a; ;; aa ; a ; a ;;;; aaaa ;a;a a;a;",
  altTextEn: ";;; aaa ;a; a;a ;a a; ;; aa ; a ; a ;;;; aaaa ;a;a a;a;",
  descriptionUz: "Jimjiloq barmoqlaringizni A va yarim nuqta (;) tugmalariga joylashtiring.",
  descriptionEn: "Place your pinky fingers on the A and semicolon (;) keys."
});

rawLessons.push({
  id: 5, number: 5,
  titleUz: "Asosiy qatordagi barcha harflar", titleEn: "All Home Row Letters",
  targetKeys: "a, s, d, f, j, k, l, ;",
  textUz: "asdf jkl; fdsa ;lkj asdfjkl; lkjasdf a; sldk f j fdsa ;lkj",
  textEn: "asdf jkl; fdsa ;lkj asdfjkl; lkjasdf a; sldk f j fdsa ;lkj",
  altTextUz: ";lkj asdf lkja sdf; jkl;asdf fdsa;lkj l; kjd s a jkl; jkl;",
  altTextEn: ";lkj asdf lkja sdf; jkl;asdf fdsa;lkj l; kjd s a jkl; jkl;",
  descriptionUz: "Asosiy qatordagi barcha harflarni birgalikda mashq qilamiz.",
  descriptionEn: "Practice all home row keys together to solidify positions."
});

rawLessons.push({
  id: 6, number: 6,
  titleUz: "Asosiy qator: G va H", titleEn: "Home Row: G and H",
  targetKeys: "g, h",
  textUz: "asdfg hjkl; fgf jhj ggg hhh gh hg g h ghgh hghg fghj jhgf",
  textEn: "asdfg hjkl; fgf jhj ggg hhh gh hg g h ghgh hghg fghj jhgf",
  altTextUz: ";lkhg fdsa jhj fgf hhh ggg hg gh h g hghg ghgh jhgf fghj",
  altTextEn: ";lkhg fdsa jhj fgf hhh ggg hg gh h g hghg ghgh jhgf fghj",
  descriptionUz: "Asosiy qatordagi ko'rsatkich barmoqlaringizni yon tomonga (G va H) cho'zing.",
  descriptionEn: "Stretch your index fingers inwards to reach G and H keys."
});

rawLessons.push({
  id: 7, number: 7,
  titleUz: "Asosiy qatordagi birinchi so'zlar", titleEn: "First Home Row Words",
  targetKeys: "Home row words",
  textUz: "sal dars gala asad safar daka salla farash lak salasa asad",
  textEn: "sad lad fad glass salad ask dad all fall flask glad shall gas",
  altTextUz: "asad safar dars sal gala daka farash asad dars sal salla salla",
  altTextEn: "ask dad glad fall salad flask glass all shall sad gas lad ask",
  descriptionUz: "Faqat asosiy o'rta qatordagi harflardan iborat o'zbekcha so'zlarni yozing.",
  descriptionEn: "Type simple English words using only the home row keys."
});

// 8. Upper row
rawLessons.push({
  id: 8, number: 8,
  titleUz: "Yuqori qator: Q va P", titleEn: "Upper Row: Q and P",
  targetKeys: "q, p",
  textUz: "qaqp qaqp qqq ppp qpq pqp q p q p qa pq qqp ppp qqp ppp",
  textEn: "qaqp qaqp qqq ppp qpq pqp q p q p qa pq qqp ppp qqp ppp",
  altTextUz: "pqaq pqaq ppp qqq pqp qpq p q p q pa qp ppq qqq ppq qqq",
  altTextEn: "pqaq pqaq ppp qqq pqp qpq p q p q pa qp ppq qqq ppq qqq",
  descriptionUz: "Jimjiloq barmoqlaringizni tepaga, Q va P tugmalariga cho'zing.",
  descriptionEn: "Stretch your pinky fingers upwards to reach Q and P keys."
});

rawLessons.push({
  id: 9, number: 9,
  titleUz: "Yuqori qator: W va O", titleEn: "Upper Row: W and O",
  targetKeys: "w, o",
  textUz: "swlo swlo www ooo wow owo w o w o wo ow ws lo ow ow wow",
  textEn: "swlo swlo www ooo wow owo w o w o wo ow ws lo ow ow wow",
  altTextUz: "lows lows ooo www owo wow o w o w ow wo sl ol wo wo owo",
  altTextEn: "lows lows ooo www owo wow o w o w ow wo sl ol wo wo owo",
  descriptionUz: "Nomisiz barmoqlaringizni yuqoriga, W va O tugmalariga yo'naltiring.",
  descriptionEn: "Stretch your ring fingers upwards to reach W and O keys."
});

rawLessons.push({
  id: 10, number: 10,
  titleUz: "Yuqori qator: E va I", titleEn: "Upper Row: E and I",
  targetKeys: "e, i",
  textUz: "dedk kikd eee iii eie iei e i e i ei ie ed ki ee ii eie",
  textEn: "dedk kikd eee iii eie iei e i e i ei ie ed ki ee ii eie",
  altTextUz: "kded kiki iii eee iei eie i e i e ie ei de ik ii ee iei",
  altTextEn: "kded kiki iii eee iei eie i e i e ie ei de ik ii ee iei",
  descriptionUz: "O'rta barmoqlaringiz bilan E va I tugmalarini bosing.",
  descriptionEn: "Use your middle fingers to press the E and I keys."
});

rawLessons.push({
  id: 11, number: 11,
  titleUz: "Yuqori qator: R va U", titleEn: "Upper Row: R and U",
  targetKeys: "r, u",
  textUz: "frju frju rrr uuu rur uru r u r u ru ur fr ju rr uu rur",
  textEn: "frju frju rrr uuu rur uru r u r u ru ur fr ju rr uu rur",
  altTextUz: "ujrf ujrf uuu rrr uru rur u r u r ur ru jf ur uu rr uru",
  altTextEn: "ujrf ujrf uuu rrr uru rur u r u r ur ru jf ur uu rr uru",
  descriptionUz: "Ko'rsatkich barmoqlaringizni tepaga, R va U tugmalariga yo'naltiring.",
  descriptionEn: "Use your index fingers to press the R and U keys."
});

rawLessons.push({
  id: 12, number: 12,
  titleUz: "Yuqori qator: T va Y", titleEn: "Upper Row: T and Y",
  targetKeys: "t, y",
  textUz: "ftjy ftjy ttt yyy tyt yty t y t y ty yt ft jy tt yy tyt",
  textEn: "ftjy ftjy ttt yyy tyt yty t y t y ty yt ft jy tt yy tyt",
  altTextUz: "yjtf yjtf yyy ttt yty tyt y t y t yt ty jf yt yy tt yty",
  altTextEn: "yjtf yjtf yyy ttt yty tyt y t y t yt ty jf yt yy tt yty",
  descriptionUz: "Ko'rsatkich barmoqlaringiz bilan yana bitta ichki tugma T va Y ni mashq qiling.",
  descriptionEn: "Practice stretching your index fingers to the center top keys T and Y."
});

rawLessons.push({
  id: 13, number: 13,
  titleUz: "Asosiy va Yuqori qator aralash", titleEn: "Home and Upper Row Mix",
  targetKeys: "Home + Upper keys",
  textUz: "olma rasm idor yigit rita sitor usta osiy oson qor ota",
  textEn: "quiet write polar route tower power story yellow standard user",
  altTextUz: "rasm olma yigit idor sitor rita osiy usta qor oson ota ota",
  altTextEn: "tower power quiet write story route polar yellow user standard",
  descriptionUz: "Asosiy qator va yuqori xonalarni birlashtirib, birinchi haqiqiy so'zlarni yozing.",
  descriptionEn: "Combine home row and top row keys to write full English words."
});

// 14. Bottom row
rawLessons.push({
  id: 14, number: 14,
  titleUz: "Pastki qator: Z va Nuqta", titleEn: "Bottom Row: Z and Period",
  targetKeys: "z, .",
  textUz: "az.; az.; zzz ... z.z .z. z . z . z. .z az .; zz .. z.z",
  textEn: "az.; az.; zzz ... z.z .z. z . z . z. .z az .; zz .. z.z",
  altTextUz: ".;za .;za ... zzz .z. z.z . z . z .z z. ;a .z .. zz .z.",
  altTextEn: ".;za .;za ... zzz .z. z.z . z . z .z z. ;a .z .. zz .z.",
  descriptionUz: "Jimjiloq barmoqlaringizni pastga, Z va Nuqta (.) tushiring.",
  descriptionEn: "Stretch your pinky fingers downward to reach Z and Period (.) keys."
});

rawLessons.push({
  id: 15, number: 15,
  titleUz: "Pastki qator: X va L", titleEn: "Bottom Row: X and Comma",
  targetKeys: "x, ,",
  textUz: "sxd, sxd, xxx ,,, x,x ,x, x , x , x, ,x sx d, xx ,, x,x",
  textEn: "sxd, sxd, xxx ,,, x,x ,x, x , x , x, ,x sx d, xx ,, x,x",
  altTextUz: ",dxs ,dxs ,,, xxx ,x, x,x , x , x ,x x, ,d x, ,, xx ,x,",
  altTextEn: ",dxs ,dxs ,,, xxx ,x, x,x , x , x ,x x, ,d x, ,, xx ,x,",
  descriptionUz: "Nomisiz barmoqlaringizni pastki X va vergul (,) tugmalariga tushiring.",
  descriptionEn: "Stretch your ring fingers downward to reach X and Comma (,) keys."
});

rawLessons.push({
  id: 16, number: 16,
  titleUz: "Pastki qator: C va M", titleEn: "Bottom Row: C and M",
  targetKeys: "c, m",
  textUz: "dckm dckm ccc mmm cmc mcm c m c m cm mc dc km cc mm cmc",
  textEn: "dckm dckm ccc mmm cmc mcm c m c m cm mc dc km cc mm cmc",
  altTextUz: "mkcd mkcd mmm ccc mcm cmc m c m c mc cm cd km mm cc mcm",
  altTextEn: "mkcd mkcd mmm ccc mcm cmc m c m c mc cm cd km mm cc mcm",
  descriptionUz: "O'rta barmoqlaringiz bilan pastdagi C va M tugmalarini yuklang.",
  descriptionEn: "Stretch your middle fingers downward to press C and M keys."
});

rawLessons.push({
  id: 17, number: 17,
  titleUz: "Pastki qator: V va B", titleEn: "Bottom Row: V and B",
  targetKeys: "v, b",
  textUz: "fvgj fvgj vvv bbb vbv bvb v b v b vb bv fv jg vv bb vbv",
  textEn: "fvgj fvgj vvv bbb vbv bvb v b v b vb bv fv jg vv bb vbv",
  altTextUz: "jgvf jgvf bbb vvv bvb vbv b v b v bv vb jf jf bb vv bvb",
  altTextEn: "jgvf jgvf bbb vvv bvb vbv b v b v bv vb jf jf bb vv bvb",
  descriptionUz: "Ko'rsatkich barmog'ingiz asosi bilan pastki V va B qatorini o'rganing.",
  descriptionEn: "Place your index fingers on the bottom V and B keys."
});

rawLessons.push({
  id: 18, number: 18,
  titleUz: "Pastki qator: N", titleEn: "Bottom Row: N",
  targetKeys: "n",
  textUz: "jnjn jnjn nnn nnn njnj n j n j nn rr nn jj njnj jnjn",
  textEn: "jnjn jnjn nnn nnn njnj n j n j nn rr nn jj njnj jnjn",
  altTextUz: "njnj njnj nnn nnn jnjn j n j n nn jj nn rr jnjn njnj",
  altTextEn: "njnj njnj nnn nnn jnjn j n j n nn jj nn rr jnjn njnj",
  descriptionUz: "O'ng ko'rsatkich barmoq yordamida N harfini o'rganing.",
  descriptionEn: "Use your right index finger to practice the N key."
});

rawLessons.push({
  id: 19, number: 19,
  titleUz: "Barcha klaviatura harflari", titleEn: "All Alphabet Letters",
  targetKeys: "a to z",
  textUz: "akaxon rasm burchak daryo eshik fil gilos hayot ilon jala",
  textEn: "pack my box with five dozen vibrant purple liquor jugs quickly",
  altTextUz: "daryo akaxon burchak rasm eshik fil gilos jala ilon hayot",
  altTextEn: "vibrant dozen five box pack my with purple liquor jugs quickly",
  descriptionUz: "Klaviaturadagi barcha harflarni to'liq ishtirok etgan matnlarda sinang.",
  descriptionEn: "Practice a custom pan-gram that uses every single letter from A to Z."
});

rawLessons.push({
  id: 20, number: 20,
  titleUz: "Boshlang'ich imtihoni", titleEn: "Beginner Examination",
  targetKeys: "Beginner level review",
  textUz: "Vatan tinchligi, osoyishtaligi va gullab-yashnashi har bir insonning oliy maqsadidir.",
  textEn: "Consistency and daily focus are more critical than writing code for long intervals.",
  altTextUz: "Inson go'zalligi uning ma'naviy dunyosida, go'zal tilida va oliymaqsad xulqidadir.",
  altTextEn: "Type fast, build daily habits, and watch your skills accelerate after every test.",
  descriptionUz: "Boshlang'ich darajaning oxirgi sinovi. Kamida 1 ta yulduz olib O'rta darajaga chinakamiga yo'l oching.",
  descriptionEn: "Solidify your beginner training. Get at least 1 star to secure your progression."
});

// 21 to 40: O'rta bosqich (Uzbek specific letters, shift operations, capitalization, longer sentences)
for (let i = 21; i <= 40; i++) {
  const num = i - 20;
  rawLessons.push({
    id: i, number: num,
    stage: 'orta',
    titleUz: `O'rtacha daraja: ${num}-dars`,
    titleEn: `Intermediate: Lesson ${num}`,
    targetKeys: "O'rta ko'nikmalar",
    textUz: `Bu darsda biz katta harflar va o'zbekcha o' va g' tovushlarini yaxshilab mashq qilamiz, dars raqami ${num}.`,
    textEn: `With lesson ${num}, we integrate proper uppercase shifts and punctuation into beautiful flowing sentences.`,
    altTextUz: `Katta harflarni Shiftdan foydalanib yozish mas'uliyati juda muhim, mashq raqami ${num} muvaffaqiyatli dars.`,
    altTextEn: `Shift keys and capitalization require relaxed fingers. This alternate drill ${num} reinforces typing flow.`,
    descriptionUz: "Katta harf va murakkab so'z birikmalariga e'tibor qarating.",
    descriptionEn: "Focus on capital letters using the Left/Right Shift keys appropriately."
  });
}

// Adjust some specific O'rta lessons to make them completely unique and beautiful!
rawLessons[20] = { // lesson 21
  id: 21, number: 1,
  stage: 'orta',
  titleUz: "O'zbekcha Harflar: O' va G'", titleEn: "Intermediate Shift Operations",
  targetKeys: "o', g', shift",
  textUz: "o'g'il o'rdak o'g'ri o'rmon g'ildirak g'isht g'alaba jo'ra ko'r",
  textEn: "The Earth, Jupiter, Mars, Venus, Mercury and Saturn orbit the Sun.",
  altTextUz: "g'isht o'rmon jo'ra ko'r o'g'il o'rdak g'alaba o'g'ri g'ildirak",
  altTextEn: "Sun, Saturn, Mercury, Venus, Mars, Jupiter and Earth orbit together.",
  descriptionUz: "O'zbek tiliga xos bo'lgan o' (o + apostrof) va g' (g + apostrof) harflarini birgalikda yozishni o'rganamiz.",
  descriptionEn: "Practice uppercase characters by coordinating Left and Right Shift keys properly."
};

rawLessons[21] = { // lesson 22
  id: 22, number: 2,
  stage: 'orta',
  titleUz: "Katta va Kichik Shift mashqi", titleEn: "Proper Nouns & Capitals",
  targetKeys: "uppercase letters",
  textUz: "Toshkent Samarqand Buxoro Xiva Andijon Farg'ona Namangan Jizzax",
  textEn: "London, Paris, Berlin, Washington, Tokyo, Tashkent and Beijing.",
  altTextUz: "Andijon Toshkent Jizzax Namangan Samarqand Buxoro Xiva Farg'ona",
  altTextEn: "Tashkent, London, Tokyo, Washington, Berlin, Paris and Beijing.",
  descriptionUz: "Viloyat va shahar nomlarini katta harflar bilan yozib, Shift ko'nikmalarini kuchaytiring.",
  descriptionEn: "Type famous capital cities using fast Shift key configurations."
};

rawLessons[39] = { // lesson 40
  id: 40, number: 20,
  stage: 'orta',
  titleUz: "O'rta daraja imtihoni", titleEn: "Intermediate Examination",
  targetKeys: "Intermediate graduation review",
  textUz: "Inson bilim olishdan aslo to'xtamasligi lozim, xususan, yangi asr texnologiyalari va raqamli ko'nikmalarni o'rganish hayotiy zaruriyatdir.",
  textEn: "Professional typing skills open infinite virtual pathways for students, tech specialists, and active remote developers.",
  altTextUz: "Muvaffaqiyatga erishish qiyin tuyulishi mumkin, lekin har kungi qunt, sabr va intizom har qanday yopiq eshikni osonlikcha ocha oladi.",
  altTextEn: "The absolute best way to level up your typing capability is to stay accurate and avoid looking at your keyboard entirely.",
  descriptionUz: "O'rta darajaning yakuniy o'quv imtihoni. Barcha 20 darsni tugatib, chop etiladigan sertifikatni oching!",
  descriptionEn: "Graduate from the Intermediate level. Completing this activates your customized printable PDF Stage certificate!"
};


// 41 to 60: Mukammal bosqich (Developer symbols, numbers, complex text, inline code snippets HTML/CSS/JS)
for (let i = 41; i <= 60; i++) {
  const num = i - 40;
  rawLessons.push({
    id: i, number: num,
    stage: 'mukammal',
    titleUz: `Mukammal daraja: ${num}-dars`,
    titleEn: `Advanced Developer: Lesson ${num}`,
    targetKeys: "Belgilar va Kodlar",
    textUz: `const isChecked = true; if (isChecked) { console.log("O'zbekiston - ${num}"); }`,
    textEn: `const isReady = true; if (isReady) { console.log("Success: ${num}"); }`,
    altTextUz: `let value = ${num * 10}; for (let x = 0; x < value; x++) { adjust(x); }`,
    altTextEn: `let index = ${num * 5}; while (index > 0) { execute(index); index--; }`,
    descriptionUz: "Dasturchilar va professionallar uchun belgilar, qavslar va raqamlar bilan dars.",
    descriptionEn: "Dasturchilar va professionallar uchun belgilar, qavslar va raqamlar bilan dars."
  });
}

// Adjust specific advanced classes for developers
rawLessons[40] = { // lesson 41
  id: 41, number: 1,
  stage: 'mukammal',
  titleUz: "Raqamlar Qatori", titleEn: "Numbers Row Training",
  targetKeys: "numbers",
  textUz: "12345 67890 10293 84756 93847 101293 4758 9201 3847 4839 29",
  textEn: "12345 67890 10293 84756 93847 101293 4758 9201 3847 4839 29",
  altTextUz: "09876 54321 39482 71625 10293 584930 2819 1290 8472 8392 39",
  altTextEn: "09876 54321 39482 71625 10293 584930 2819 1290 8472 8392 39",
  descriptionUz: "Klaviaturaning yuqori qismidagi raqamlarni qaramasdan terish mushaklarni o'rgatadi.",
  descriptionEn: "Master the top number row to type telephone numbers, codes, and numerical data."
};

rawLessons[41] = { // lesson 42
  id: 42, number: 2,
  stage: 'mukammal',
  titleUz: "Dasturlash Qavslari", titleEn: "Coding Parentheses",
  targetKeys: "( ), [ ], { }",
  textUz: "() [] {} (uzbek) [massiv] {obyekt} () [] {} (test) [kod] {xato}",
  textEn: "() [] {} (array) [index] {object} () [] {} (code) [test] {debug}",
  altTextUz: "{} [] () {obyekt} [massiv] (uzbek) {} [] () {xato} [kod] (test)",
  altTextEn: "{} [] () {object} [index] (array) {} [] () {debug} [test] (code)",
  descriptionUz: "Dasturlashda ko'p ishlatiladigan yumaloq, to'rtburchak va jingalak qavslarni terish.",
  descriptionEn: "Practice brackets widely used in software, mathematical formulation, and scripting."
};

rawLessons[42] = { // lesson 43
  id: 43, number: 3,
  stage: 'mukammal',
  titleUz: "Matematik Belgilar va Tenglik", titleEn: "Math & Logical Operators",
  targetKeys: "=, +, -, *, /, %",
  textUz: "a + b = c; x - y = 10; c * d / e; tax = cost - (total % 5);",
  textEn: "a + b = c; x - y = 10; c * d / e; tax = cost - (total % 5);",
  altTextUz: "x * y = z; a + b = 25; total - discount / rate; tax = delta * 12;",
  altTextEn: "x * y = z; a + b = 25; total - discount / rate; tax = delta * 12;",
  descriptionUz: "Arifmetik va mantiqiy amallarni tezkor yozish mashg'uloti.",
  descriptionEn: "Practice fundamental mathematical operations and assignment characters."
};

rawLessons[43] = { // lesson 44
  id: 44, number: 4,
  stage: 'mukammal',
  titleUz: "HTML va CSS Teglari", titleEn: "HTML & CSS Snippets",
  targetKeys: "<, >, /, #, .",
  textUz: "<div class=\"element\"> <p id=\"sarlavha\"> Salom </p> </div>",
  textEn: "<div class=\"container\"> <h1 id=\"title\"> Hello World </h1> </div>",
  altTextUz: "<section id=\"app\"> <span class=\"text\"> DK-Typing </span> </section>",
  altTextEn: "<section id=\"app\"> <span class=\"text\"> DK-Typing </span> </section>",
  descriptionUz: "Veb-sahifa yaratishdagi HTML teglari va klass selektorlarini mashq qiling.",
  descriptionEn: "Type clean markup tags, quotes, classes and unique element identifiers."
};

rawLessons[44] = { // lesson 45
  id: 45, number: 5,
  stage: 'mukammal',
  titleUz: "TypeScript funktsiyasi", titleEn: "Modern JavaScript Functions",
  targetKeys: "=>, function, return",
  textUz: "const hisobla = (x, y) => { return x + y; }; console.log(hisobla(5, 10));",
  textEn: "const calculate = (a, b) => { return a + b; }; console.log(calculate(5, 10));",
  altTextUz: "const chopEt = (ism) => { return `Aziz ${ism}`; }; console.log(chopEt(\"DK\"));",
  altTextEn: "const greetUser = (name) => { return `Dear ${name}`; }; console.log(greetUser(\"DK\"));",
  descriptionUz: "O'q nishonli funksiyalar va return deklaratsiyasini tezkor yozish.",
  descriptionEn: "Practice typing ES6 arrow syntax, template literals, and logs."
};

rawLessons[59] = { // lesson 60
  id: 60, number: 20,
  stage: 'mukammal',
  titleUz: "Mukammal IT Mutaxassis Imtihon", titleEn: "Supreme Master Core Review",
  targetKeys: "Grand Masters Finale",
  textUz: "export default async function startServer() { const port = 3000; app.listen(port, () => { console.log(`Server is running!`); }); }",
  textEn: "export default async function startServer() { const port = 3000; app.listen(port, () => { console.log(`Server is running!`); }); }",
  altTextUz: "import { GoogleGenAI } from \"@google/genai\"; const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });",
  altTextEn: "import { GoogleGenAI } from \"@google/genai\"; const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });",
  descriptionUz: "Tabriklaymiz! Ushbu 60-imtihonni a'lo darajaga topshiring va 'Global Mukammal Sertifikat' egasiga aylaning!",
  descriptionEn: "Ultimate typing examination. Perfect this full script to unlock the prestigious Global Masters Certificate!"
};


// --- DYNAMIC GENERATOR FOR EXTRA STAGES (61-150) ---
const complexWordsUz = [
  "konstruksiyalash", "transformatsiya", "mukammallashtirish", "elektromagnit", "respublikasi", "sivilizatsiyalar", "baynalmilalchi", "boshqaruvchilik", "dasturlashtirish", "tadqiqotchilik", "tajribasizligimiz", "axborotlashtirish", "samaradorlik", "shaxsiylashtirish", "umuminsoniy", "rivojlantirish", "investitsiyalash", "kooperatsiyalash", "tizimlashtirish", "sinonimlashtirish", "xavfsizlantirish", "qiziquvchanlik", "hayrixohlik", "shijoatlanmoq", "shafqatsizlarcha", "shovqin-suron", "ijtimoiy-siyosiy", "tashkilotlararo", "foydalanuvchilar", "tarbiyalanuvchi"
];
const complexWordsEn = [
  "institutionalized", "characterization", "accomplishments", "supercalifragilistic", "procrastination", "unbelievable", "multidimensional", "misunderstandings", "photosynthesis", "extraordinary", "differentiation", "unconstitutionally", "entrepreneurship", "biodegradability", "hyperventilation", "industrialization", "cryptography", "synchronization", "vulnerability", "interoperability", "unpredictability", "infrastructure", "modularization", "object-oriented", "asynchronous", "representation", "implementation", "orchestration", "collaboration", "confidentiality"
];

const simpleTextsUz = [
  "Yaxshi xulq - insonning eng guzal ziynatidir va uning odobini kursatadi.",
  "Har qanday urinish o'rganish va izlanish orqali yuqori maqsadga yetaklaydi.",
  "Dunyoda muvaffaqiyatga erishish uchun tinimsiz mehnat qilish va sabr kerak.",
  "Bilim yulduz kabi qorong'u yo'llarni yorituvchi yuksak mayoq hisoblanadi.",
  "Vaqt boylikdir, uni faqat foydali va yaxshi ishlarga sarflash lozimdir.",
  "Do'stlik samimiy ishonch va uzaro hurmat asosida quriladigan muqaddas tuyg'u.",
  "Dasturlash dunyoni yaxshi tomonga o'zgartirish uchun eng kuchli vosita.",
  "Kitob mutolaasi fikrlash doirasini kengaytirib, yangi ufqlarni ochadi.",
  "Ozoda va tartibli hayot insonning salomatligi va xotirjamligi kalitidir.",
  "Kechagi xatolar bugungi donolikni shakllantiruvchi qimmatli saboqlardir.",
  "Orzu qilishdan hech qachon to'xtamang, chunki orzular haqiqatga aylanadi.",
  "Sog'lom tanda sog'lom aql va tiniq fikrlar doimo hamroh bo'lib yuradi.",
  "Bizning kelajagimiz bugun qilayotgan ishlarimiz va qarorlarimizga bog'liq.",
  "Har bir yangi kun bizga o'z ustimizda ishlash uchun imkoniyat yaratadi.",
  "Oila - muqaddas maskan, undagi tinchlik eng katta baxtdir.",
  "Inson qalbining go'zalligi uning gapi va qilgan yaxshi amallarida.",
  "O'z oldiga ulkan maqsadlarni qo'ygan insonlardan aslo chekinmaslik talab etiladi.",
  "Saxovatli bo'lish qalbdagi g'uborlarni tozalaydi va quvonch bag'ishlaydi.",
  "Tabiatni asrash har bir insonning burchi va kelajak oldidagi mas'uliyatidir.",
  "Ijodkorlik va yangilikka intilish hayotni yanada go'zal va qiziqarli qiladi.",
  "Haqiqiy kuch jismoniy quvvatda emas, balki ruhan kuchli va sabrli bo'lishda.",
  "Tezkor yozish barmoqlarning eng ajoyib raqsi va aqlimizning aksidir.",
  "Biz birgalikda buyuk ishlarni amalga oshirishga doimo qodirmiz.",
  "Har qanday qiyinchilik ortida bir yengillik va keng eshiklar doimo bor.",
  "Yoshlikda o'rganilgan bilim toshga o'yilgan naqsh kabi umrbod qoladi.",
  "Kamtarlik insonni ulug'laydi, mutakabbirlik esa uni tubanlikka tortadi.",
  "Dasturlashni o'rganish qiyin bo'lishi mumkin, ammo natijasi shirin va porloq.",
  "Oz-ozdan o'rganib borish pirovardida ulkan yutuqlarga poydevor yaratadi.",
  "Xushmuomalalik barcha insonlar qalbidan joy olishning eng oson yo'lidir.",
  "Bugun boshlang va ertaga siz o'zingizga rahmat aytishingiz aniqdir."
];

const simpleTextsEn = [
  "A journey of a thousand miles begins with a single, small and simple step.",
  "Success is not final, failure is not fatal: it is the courage to continue.",
  "Believe you can and you are already halfway there to your ultimate goal.",
  "The only way to do great work is to love what you do every single day.",
  "Consistency is the secret key that unlocks the door to ultimate master skills.",
  "Learning to type fast builds a deep connection between the mind and keyboard.",
  "Your time of practice will pay off in incredible speed and total confidence.",
  "Stay foolish, stay hungry, and never stop exploring new fields of science.",
  "Positive thinking attracts beautiful energy and wonderful opportunities.",
  "Focus on progress, not perfection; every small victory is worth celebrating.",
  "Kindness is a language which the deaf can hear and the blind can see clearly.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Great things are done by a series of small things brought together over time.",
  "Education is the most powerful weapon which you can use to change the world.",
  "In the middle of every difficulty lies a beautiful and hidden opportunity.",
  "The best way to predict your future is to create it with your own hands.",
  "Happiness is not something ready made; it comes from your own kind actions.",
  "Write code as if the person maintaining it is a violent psychopath.",
  "Simplicity is the ultimate sophistication in both life and software design.",
  "Every expert was once a beginner who refused to give up on their goals.",
  "Do not count the days, make the days count towards your dream life.",
  "A warm smile is the universal language of kindness across all nations.",
  "Your potential is endless, the only limits are the ones you set in mind.",
  "Gratitude turns what we have into more than enough and brings instant peace.",
  "Make today so wonderful that yesterday gets jealous of your active life.",
  "Intelligence is the ability to adapt to change quickly and effectively.",
  "Continuous learning keeps your mind young, sharp, and ready to fly.",
  "Good things come to those who work hard and never lose their golden spark.",
  "Every master key starts as a raw block of metal waiting to be shaped.",
  "You are doing amazing things today, keep pushing forward into the light."
];

const profTextsUz = [
  "Axborot texnologiyalari hayotimizning har bir jabhasida chuqur ildiz otmoqda. Dasturchi sifatida biz yozayotgan har bir kod dunyoning intellektual salohiyatini oshirishga va muammolarni bartaraf etishga xizmat qiladi.",
  "Zamonaviy veb-ilovalarni ishlab chiqish nafaqat qulay interfeys yaratish, balki foydalanuvchi ma'lumotlarining xavfsizligini ta'minlashni ham talab etadi. Shifrlash va xavfsiz protokollar barqarorlik kafolatidir.",
  "Tizimlar arxitekturasi va ma'lumotlar omborining to'g'ri loyihalashtirilishi kelajakda dasturning millionlab foydalanuvchilarga xizmat ko'rsata olish qobiliyatini belgilaydi. Optimizatsiya muhim maqsad.",
  "Sun'iy intellekt va neyron tarmoqlari insoniyat imkoniyatlarini yangi bosqichga olib chiqdi. Endilikda biz mashinalarga nafaqat buyruq berishni, balki ularni mantiqiy fikrlashga o'rgata olyapmiz.",
  "Algoritmlarni chuqur o'rganish sizga har qanday qiyin masalani minimal xotira va maksimal tezlik yordamida hal qilish imkonini beradi. Har doim kodning ishlash murakkabligini tahlil qiling.",
  "Jamoaviy hamkorlik va kodning tushunarli yozilishi yirik loyihalar hayotiyligini belgilaydi. Clean Code tamoyillari dasturchilar o'rtasidagi o'zaro ishonchni va rivojlanishni mustahkamlaydi.",
  "Bulutli texnologiyalar va konteynerlashtirish global miqyosda serverlarni bir necha daqiqa ichida ishga tushirish va boshqarish imkonini yaratdi. Bu tezkorlik va moslashuvchanlik asridir.",
  "Dasturiy mahsulot yaratishda sifatni nazorat qilish va doimiy testlash jarayoni xatolar sonini sezilarli darajada kamaytiradi. Testlar siz yozgan kodning ishonchli asosi va qalqonidir.",
  "Doimiy izlanish, darslar va yangi texnologiyalarni o'zlashtirish dasturchini bozorda raqobatbardosh qiladi. O'rganishdan to'xtagan kun taraqqiyot to'xtagan kundir.",
  "Muvaffaqiyatli startaplar faollik va tezkor qarorlar qabul qilish orqali bozorlarni zabt etadi. G'oyaning o'zi hech narsa emas, uni amalga oshirish va tajriba esa haqiqiy boylikdir."
];

const profTextsEn = [
  "Information technology is deeply rooting itself in every single aspect of our lives. As software engineers, every line of code we write serves to increase the intellectual potential of our world.",
  "Modern web application development requires not only creating elegant interfaces but also ensuring the absolute security of user data. Encryptions and secure protocols guarantee stability.",
  "Proper system architecture and database design determine whether an application can successfully scale to serve millions of active users in the future. Optimization remains our core target.",
  "Artificial intelligence and neural networks have pushed human capabilities to a completely new boundary. We are now training machines to reason logically, rather than just execute commands.",
  "Direct dive into algorithms gives you the power to solve complex problems with minimal memory footprints and maximum execution speed. Always analyze the time complexity of your algorithms.",
  "Team collaboration and self-documenting code determine the long-term viability of enterprise projects. Clean Code principles strengthen mutual trust and double the pace of development.",
  "Cloud computing and containerization have enabled the global deployment and orchestrations of complex servers within minutes. We are living in an era of pure speed and high agility.",
  "Rigorous quality assurance and continuous testing pipelines significantly decrease the rate of runtime crashes. Tests are the absolute shield and structural foundation of your package.",
  "Continuous research and active technical learning keep software developers competitive in the global market. The day we stop learning is the very day our technological growth terminates.",
  "Successful startups conquer competitive markets through rapid iterations and decisive moves. An idea alone is nothing; supreme execution and rigorous testing are the true golden treasure."
];

// 4. `murakkab_sozlar` (61 - 90, 30 exercises)
for (let i = 1; i <= 30; i++) {
  const w1 = complexWordsUz[(i - 1) % complexWordsUz.length];
  const w2 = complexWordsUz[i % complexWordsUz.length];
  const w3 = complexWordsUz[(i + 1) % complexWordsUz.length];
  const we1 = complexWordsEn[(i - 1) % complexWordsEn.length];
  const we2 = complexWordsEn[i % complexWordsEn.length];
  const we3 = complexWordsEn[(i + 1) % complexWordsEn.length];

  rawLessons.push({
    id: 60 + i,
    number: i,
    stage: 'murakkab_sozlar',
    titleUz: `Murakkab so'zlar: Mashq ${i}`,
    titleEn: `Complex Words: Lesson ${i}`,
    targetKeys: "Complex combinations",
    textUz: `${w1} ${w2} ${w3} ${w1} ${w2} ${w3}`,
    textEn: `${we1} ${we2} ${we3} ${we1} ${we2} ${we3}`,
    altTextUz: `${w3} ${w2} ${w1} ${w3} ${w2} ${w1}`,
    altTextEn: `${we3} ${we2} ${we1} ${we3} ${we2} ${we1}`,
    descriptionUz: "Klaviatura mahoratingizni oshirish uchun murakkab so'zlar va harf birikmalarini tinimsiz mashq qiling.",
    descriptionEn: "Type complex multisyllabic words to improve your coordination and typing accuracy."
  });
}

// 5. `oddiy_matnlar` (91 - 120, 30 exercises)
for (let i = 1; i <= 30; i++) {
  rawLessons.push({
    id: 90 + i,
    number: i,
    stage: 'oddiy_matnlar',
    titleUz: `Uzbekcha hikmatli gap: Mashq ${i}`,
    titleEn: `Inspiring Quote: Lesson ${i}`,
    targetKeys: "Complete Sentences",
    textUz: simpleTextsUz[i - 1],
    textEn: simpleTextsEn[i - 1],
    altTextUz: simpleTextsUz[30 - i],
    altTextEn: simpleTextsEn[30 - i],
    descriptionUz: "To'liqligicha haqiqiy va motivatsion o'zbekcha gaplarni yozish orqali tezligingizni sinab ko'ring.",
    descriptionEn: "Test your pacing by typing beautiful full-prose motivational sentences without mistakes."
  });
}

// 6. `professional_matnlar` (121 - 150, 30 exercises)
for (let i = 1; i <= 30; i++) {
  rawLessons.push({
    id: 120 + i,
    number: i,
    stage: 'professional_matnlar',
    titleUz: `Kasbiy matnlar: Mashq ${i}`,
    titleEn: `Professional Passage: Lesson ${i}`,
    targetKeys: "Professional Paragraphs",
    textUz: profTextsUz[(i - 1) % 10],
    textEn: profTextsEn[(i - 1) % 10],
    altTextUz: profTextsUz[(30 - i) % 10],
    altTextEn: profTextsEn[(30 - i) % 10],
    descriptionUz: "Yuqori darajadagi kasbiy va ilmiy matnlar ustida ishlab, to'liq mahoratli mutaxassisga aylaning.",
    descriptionEn: "Practice with academic and software project descriptions to cement your high-tier output."
  });
}

// Map stages
export const LESSONS: Lesson[] = rawLessons.map(lesson => {
  let stage: 'boshlangich' | 'orta' | 'mukammal' | 'murakkab_sozlar' | 'oddiy_matnlar' | 'professional_matnlar' | 'frontend' | 'backend' | 'database' | 'ai_integration' | 'data_structures' | 'system_design' = 'boshlangich';
  if (lesson.id >= 121 && lesson.id <= 150) {
    stage = 'professional_matnlar';
  } else if (lesson.id >= 91 && lesson.id <= 120) {
    stage = 'oddiy_matnlar';
  } else if (lesson.id >= 61 && lesson.id <= 90) {
    stage = 'murakkab_sozlar';
  } else if (lesson.id > 40) {
    stage = 'mukammal';
  } else if (lesson.id > 20) {
    stage = 'orta';
  }
  return {
    ...lesson,
    stage
  };
});

export function getLessonsByStage(stage: string): Lesson[] {
  const all = [...LESSONS, ...PROGRAMMING_LESSONS];
  return all.filter(l => l.stage === stage);
}

/// 3. Programming Academy Lessons definitions
export const PROGRAMMING_LESSONS: Lesson[] = [
  // --- FRONTEND DEVELOPER (101 - 120) ---
  {
    id: 101, number: 1, stage: 'frontend',
    titleUz: "HTML5 Semantik Teglar", titleEn: "HTML5 Semantic Elements",
    targetKeys: "<, >, /, div, main",
    textUz: "<div> <header> <main> <section> <article> <footer> </div>",
    textEn: "<div> <header> <main> <section> <article> <footer> </div>",
    altTextUz: "<h1> <p> <nav> <ul> <li> <aside> <figure> </nav> </h1>",
    altTextEn: "<h1> <p> <nav> <ul> <li> <aside> <figure> </nav> </h1>",
    descriptionUz: "HTML5 arxitekturasida eng mashhur semantik tugunlar va kapsulalarni terish.",
    descriptionEn: "Practice typing foundational semantic container tags in HTML5 wireframing."
  },
  {
    id: 102, number: 2, stage: 'frontend',
    titleUz: "Tugma va Tailwind Klaslar", titleEn: "Button UI with Tailwind CSS",
    targetKeys: "class, cName, className",
    textUz: "<button className=\"px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600\"> Click </button>",
    textEn: "<button className=\"px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600\"> Click </button>",
    altTextUz: "<span className=\"text-xs font-bold font-mono text-slate-500 animate-pulse\"> Active </span>",
    altTextEn: "<span className=\"text-xs font-bold font-mono text-slate-500 animate-pulse\"> Active </span>",
    descriptionUz: "Klassik Tailwind CSS foydalanuvchi interfeyslari uchun foydali xossalarni mashq qilish.",
    descriptionEn: "Master custom utility styles configuration and UI buttons typing quickly."
  },
  {
    id: 103, number: 3, stage: 'frontend',
    titleUz: "React Holat Hook (useState)", titleEn: "React State Hook Setup",
    targetKeys: "=, const, [, ], set",
    textUz: "const [count, setCount] = useState(0); const increment = () => setCount((prev) => prev + 1);",
    textEn: "const [count, setCount] = useState(0); const increment = () => setCount((prev) => prev + 1);",
    altTextUz: "const [profile, setProfile] = useState({ name: \"\", age: 24, loggedIn: true });",
    altTextEn: "const [profile, setProfile] = useState({ name: \"\", age: 24, loggedIn: true });",
    descriptionUz: "React funksional komponentlaridagi mustahkam boshqaruv va holat o'zgaruvchilari zanjiri.",
    descriptionEn: "Master state tracking, setter utilities, and inline hook definitions code styling."
  },
  {
    id: 104, number: 4, stage: 'frontend',
    titleUz: "Foydalanuvchi Kiritish Hodisasi", titleEn: "User Input Event Target",
    targetKeys: "target, value, change",
    textUz: "const handleChange = (e) => { const { name, value } = e.target; setValue(value); };",
    textEn: "const handleChange = (e) => { const { name, value } = e.target; setValue(value); };",
    altTextUz: "const handleSubmit = (e) => { e.preventDefault(); console.log(\"Form submitted!\"); };",
    altTextEn: "const handleSubmit = (e) => { e.preventDefault(); console.log(\"Form submitted!\"); };",
    descriptionUz: "Kiritish maydonlaridagi klaviatura hodisalarini ushlash va target qiymatini boshqarish.",
    descriptionEn: "Practice managing keyboard events and input field values inside standard forms."
  },
  {
    id: 105, number: 5, stage: 'frontend',
    titleUz: "Tailwind Moslashuvchan To'r", titleEn: "Tailwind Responsive Grid",
    targetKeys: "col, md, gap, grid",
    textUz: "<div className=\"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto\">",
    textEn: "<div className=\"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto\">",
    altTextUz: "<div className=\"flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0\">",
    altTextEn: "<div className=\"flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0\">",
    descriptionUz: "Mobil va ish stoli moslashuvchan maketlari uchun Tailwind Responsive Grid xossalari.",
    descriptionEn: "Excellent practice for responsive screens layouts planning directly with layouts classes."
  },
  {
    id: 106, number: 6, stage: 'frontend',
    titleUz: "Effekt Hook va Fetch API", titleEn: "React useEffect API Fetching",
    targetKeys: "effect, async, promise",
    textUz: "useEffect(() => { fetch(\"/api/users\").then((res) => res.json()).then((data) => setUsers(data)); }, []);",
    textEn: "useEffect(() => { fetch(\"/api/users\").then((res) => res.json()).then((data) => setUsers(data)); }, []);",
    altTextUz: "useEffect(() => { const timer = setTimeout(() => { setLoaded(true); }, 1500); return () => clearTimeout(timer); }, []);",
    altTextEn: "useEffect(() => { const timer = setTimeout(() => { setLoaded(true); }, 1500); return () => clearTimeout(timer); }, []);",
    descriptionUz: "Komponent ishga tushganda ma'lumot yuklash va tozalash amallarini boshqarish.",
    descriptionEn: "Crucial practice with async data chains, REST calls, promise layers and cleanups."
  },
  {
    id: 107, number: 7, stage: 'frontend',
    titleUz: "Massivni To'plamga Aylantirish", titleEn: "Mapping Array Into Components",
    targetKeys: "map, filter, items",
    textUz: "<ul> {items.map((item) => ( <li key={item.id} className=\"py-1 text-slate-700\"> {item.name} </li> ))} </ul>",
    textEn: "<ul> {items.map((item) => ( <li key={item.id} className=\"py-1 text-slate-700\"> {item.name} </li> ))} </ul>",
    altTextUz: "const activeUsers = users.filter((u) => u.active).map((u) => <UserCard key={u.id} info={u} />);",
    altTextEn: "const activeUsers = users.filter((u) => u.active).map((u) => <UserCard key={u.id} info={u} />);",
    descriptionUz: "Massiv elementlarini JSX qolipiga aylantirish va kalit (key) xossasini kiritish.",
    descriptionEn: "Excellent lesson for mastering nested parenthesis, template mappings, and keys."
  },
  {
    id: 108, number: 8, stage: 'frontend',
    titleUz: "Flex Markazlashtirish", titleEn: "Flexbox Centering Magic",
    targetKeys: "items, justify, flex",
    textUz: "<div className=\"flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50\">",
    textEn: "<div className=\"flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50\">",
    altTextUz: "<div className=\"inline-flex items-center space-x-2 px-3 py-1 bg-cyan-50 border border-cyan-150\">",
    altTextEn: "<div className=\"inline-flex items-center space-x-2 px-3 py-1 bg-cyan-50 border border-cyan-150\">",
    descriptionUz: "Elementlarni ekranning aniq markaziga vertikal va gorizontal joylashtirish.",
    descriptionEn: "Practice centring nested widgets, layouts alignments, and parent borders styling."
  },
  {
    id: 109, number: 9, stage: 'frontend',
    titleUz: "Tailwind Dark Mode qo'llovi", titleEn: "Tailwind Dark Mode Support",
    targetKeys: "dark:, transition, bg",
    textUz: "<div className=\"bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100\">",
    textEn: "<div className=" + '"' + "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100" + '"' + ">",
    altTextUz: "<p className=\"text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors\">",
    altTextEn: "<p className=\"text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors\">",
    descriptionUz: "Ilovalarda tunda ko'zga qulay bo'lgan qorong'u rejim (dark theme) moslashmalarini yozish.",
    descriptionEn: "Practice configuring alternating classes for modern dual-theme support setups."
  },
  {
    id: 110, number: 10, stage: 'frontend',
    titleUz: "Framer Motion Animatsiya", titleEn: "Framer Motion Interactive Layer",
    targetKeys: "motion, animate, opacity",
    textUz: "<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>",
    textEn: "<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>",
    altTextUz: "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className=\"p-3 bg-cyan-400\">",
    altTextEn: "<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className=\"p-3 bg-cyan-400\">",
    descriptionUz: "Veb saytlarga jozibador va mukammal animatsiyalar qo'shadigan motion boshqaruvi.",
    descriptionEn: "Type elegant react motion layers attributes, nesting multiple curly objects."
  },
  {
    id: 111, number: 11, stage: 'frontend',
    titleUz: "CSS Grid Ustunlar Tarifi", titleEn: "CSS Grid Cols Configuration",
    targetKeys: "grid, cols, gap, span",
    textUz: "<div className=\"grid grid-cols-12 gap-4\"> <aside className=\"col-span-3\"> </aside> <main className=\"col-span-9\"> </main> </div>",
    textEn: "<div className=\"grid grid-cols-12 gap-4\"> <aside className=\"col-span-3\"> </aside> <main className=\"col-span-9\"> </main> </div>",
    altTextUz: "<div className=\"grid lg:grid-cols-3 gap-6\"> <div className=\"col-span-2\"> </div> </div>",
    altTextEn: "<div className=\"grid lg:grid-cols-3 gap-6\"> <div className=\"col-span-2\"> </div> </div>",
    descriptionUz: "Murakkab bento-maketi va dashboard tarmoqlarini yaratish uchun Grid ustunlarini taqsimlash.",
    descriptionEn: "Build muscle memory for core Grid column spanning and custom sidebar wireframes."
  },
  {
    id: 112, number: 12, stage: 'frontend',
    titleUz: "React useRef element holati", titleEn: "React useRef Element Focus",
    targetKeys: "useRef, current, focus",
    textUz: "const inputRef = useRef<HTMLInputElement>(null); const handleFocus = () => { inputRef.current?.focus(); };",
    textEn: "const inputRef = useRef<HTMLInputElement>(null); const handleFocus = () => { inputRef.current?.focus(); };",
    altTextUz: "const timerRef = useRef<NodeJS.Timeout | null>(null); useEffect(() => { return () => clearInterval(timerRef.current!); }, []);",
    altTextEn: "const timerRef = useRef<NodeJS.Timeout | null>(null); useEffect(() => { return () => clearInterval(timerRef.current!); }, []);",
    descriptionUz: "Komponent ichidan to'g'ridan-to'g'ri DOM elementiga ulanish va unga fokus qaratish amali.",
    descriptionEn: "Master typing referencing Hooks, current sub-pointers, and TypeScript generic guards."
  },
  {
    id: 113, number: 13, stage: 'frontend',
    titleUz: "Flex-Wrap va Moslashuvchanlik", titleEn: "Flex-Wrap Layout Flow",
    targetKeys: "flex-wrap, space-x-2, bg",
    textUz: "<div className=\"flex flex-wrap items-center justify-start gap-3 p-4 bg-slate-100 rounded-2xl\">",
    textEn: "<div className=\"flex flex-wrap items-center justify-start gap-3 p-4 bg-slate-100 rounded-2xl\">",
    altTextUz: "<div className=\"flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4\">",
    altTextEn: "<div className=\"flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4\">",
    descriptionUz: "Ekran sig'maganida elementlarni yangi qatorga avtomatik ko'chirish va gap boshqaruvi.",
    descriptionEn: "Practice fluid alignments classes, conditional margin sizes, and spacing definitions."
  },
  {
    id: 114, number: 14, stage: 'frontend',
    titleUz: "Custom useLocalStorage Hook", titleEn: "Custom useLocalStorage Implementation",
    targetKeys: "local, value, JSON",
    textUz: "const [value, setValue] = useState(() => { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; });",
    textEn: "const [value, setValue] = useState(() => { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; });",
    altTextUz: "useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);",
    altTextEn: "useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);",
    descriptionUz: "Foydalanuvchi ma'lumotlarini brauzer xotirasiga doimiy saqlaydigan xizmatchi Hook yaratish.",
    descriptionEn: "Type high fidelity lazy initialization callbacks, JSON parsers, and side-effects blocks."
  },
  {
    id: 115, number: 15, stage: 'frontend',
    titleUz: "Web Audio Sintezator Sinovi", titleEn: "Web Audio API Synth Test",
    targetKeys: "AudioContext, oscillator, gain",
    textUz: "const ctx = new AudioContext(); const osc = ctx.createOscillator(); osc.type = 'sine'; osc.start(); osc.stop(ctx.currentTime + 0.1);",
    textEn: "const ctx = new AudioContext(); const osc = ctx.createOscillator(); osc.type = 'sine'; osc.start(); osc.stop(ctx.currentTime + 0.1);",
    altTextUz: "const gainNode = ctx.createGain(); osc.connect(gainNode); gainNode.connect(ctx.destination);",
    altTextEn: "const gainNode = ctx.createGain(); osc.connect(gainNode); gainNode.connect(ctx.destination);",
    descriptionUz: "Brauzerda audio tovushlar hosil qiladigan past chastotali generator qatorini mashq qilish.",
    descriptionEn: "Excellent complex parameters training with Web Audio synthesizer APIs variables."
  },
  {
    id: 116, number: 16, stage: 'frontend',
    titleUz: "Tailwind Animatsiya Kalitlari", titleEn: "Tailwind Custom Keyframes",
    targetKeys: "animate-, pulse, transition",
    textUz: "<div className=\"animate-pulse duration-700 bg-cyan-400/20 border border-cyan-400 text-cyan-500 rounded-full h-3 w-3\"></div>",
    textEn: "<div className=\"animate-pulse duration-700 bg-cyan-400/20 border border-cyan-400 text-cyan-500 rounded-full h-3 w-3\"></div>",
    altTextUz: "<span className=\"animate-bounce inline-flex rounded-full bg-emerald-500 h-2 w-2 mr-1.5\"></span>",
    altTextEn: "<span className=\"animate-bounce inline-flex rounded-full bg-emerald-500 h-2 w-2 mr-1.5\"></span>",
    descriptionUz: "Animatsiyali pulsatsiya yoki sakrash effektlariga ega darsliklar va indikator statuslarini yaratish.",
    descriptionEn: "Master typing beautiful inline indicator badges with dynamic animation classes."
  },
  {
    id: 117, number: 17, stage: 'frontend',
    titleUz: "React useCallback Xotiralash", titleEn: "React useCallback Stabilization",
    targetKeys: "useCallback, depend, function",
    textUz: "const handleTrigger = useCallback(() => { console.log(\"Stable reference triggered:\", value); }, [value]);",
    textEn: "const handleTrigger = useCallback(() => { console.log(\"Stable reference triggered:\", value); }, [value]);",
    altTextUz: "const playSound = useCallback((freq) => { emitSynthesizeAudio(freq); }, []);",
    altTextEn: "const playSound = useCallback((freq) => { emitSynthesizeAudio(freq); }, []);",
    descriptionUz: "Keraksiz qayta render jarayonining oldini oluvchi barqarorlashtirilgan funksiya Hook.",
    descriptionEn: "Excellent exercise for stabilizer callback methods, square brackets array, arrow functions."
  },
  {
    id: 118, number: 18, stage: 'frontend',
    titleUz: "TypeScript Generic interfeysi", titleEn: "TypeScript Generic Interface",
    targetKeys: "interface, <T>, string",
    textUz: "interface APIResponse<T> { success: boolean; message: string; data: T; timestamp: number; }",
    textEn: "interface APIResponse<T> { success: boolean; message: string; data: T; timestamp: number; }",
    altTextUz: "interface KeyStats<T, K> { total: T; errors: K; accuracy: number; label: string; }",
    altTextEn: "interface KeyStats<T, K> { total: T; errors: K; accuracy: number; label: string; }",
    descriptionUz: "Istalgan turdagi ma'lumotlar bilan universal ishlovchi dynamic TypeScript interfeysi.",
    descriptionEn: "Train custom static typing, templates declaration, generic parameters, and strict types."
  },
  {
    id: 119, number: 19, stage: 'frontend',
    titleUz: "React Context Ilova Aloqasi", titleEn: "React Context State Provider",
    targetKeys: "createContext, Provider, value",
    textUz: "const ThemeContext = createContext<ThemeColors | null>(null); return <ThemeContext.Provider value={theme}> {children} </ThemeContext.Provider>;",
    textEn: "const ThemeContext = createContext<ThemeColors | null>(null); return <ThemeContext.Provider value={theme}> {children} </ThemeContext.Provider>;",
    altTextUz: "const useTheme = () => { const ctx = useContext(ThemeContext); if (!ctx) throw new Error(); return ctx; };",
    altTextEn: "const useTheme = () => { const ctx = useContext(ThemeContext); if (!ctx) throw new Error(); return ctx; };",
    descriptionUz: "Butun sahifa bo'ylab ma'lumotlarni oson va qulay ulashuvchi Context tarqatish mantiqi.",
    descriptionEn: "Build muscle memory for core contextual tags, TypeScript validations, context providers."
  },
  {
    id: 120, number: 20, stage: 'frontend',
    titleUz: "SPA Marshrutizator Integratsiyasi", titleEn: "SPA React Router Setup",
    targetKeys: "BrowserRouter, Route, Routes",
    textUz: "<BrowserRouter> <Routes> <Route path=\"/\" element={<Home />} /> <Route path=\"/academy\" element={<Academy />} /> </Routes> </BrowserRouter>",
    textEn: "<BrowserRouter> <Routes> <Route path=\"/\" element={<Home />} /> <Route path=\"/academy\" element={<Academy />} /> </Routes> </BrowserRouter>",
    altTextUz: "<Link to=\"/speedtest\" className=\"px-4 py-2 hover:bg-slate-150 rounded-xl transition-all\"> Sinov </Link>",
    altTextEn: "<Link to=\"/speedtest\" className=\"px-4 py-2 hover:bg-slate-150 rounded-xl transition-all\"> Sinov </Link>",
    descriptionUz: "Veb ilova ichida sahifani yangilamasdan turli qismlar va tablar orasida o'tish.",
    descriptionEn: "Excellent practice typing router layouts, paths setups, and modern inline elements components."
  },

  // --- BACKEND DEVELOPER (121 - 140) ---
  {
    id: 121, number: 1, stage: 'backend',
    titleUz: "Express Serverni Ishga Tushirish", titleEn: "Express Server Setup",
    targetKeys: "require, express, app",
    textUz: "const express = require(\"express\"); const app = express(); const PORT = process.env.PORT || 3000;",
    textEn: "const express = require(\"express\"); const app = express(); const PORT = process.env.PORT || 3000;",
    altTextUz: "import express from \"express\"; const app = express(); const PORT = 3000; app.listen(PORT);",
    altTextEn: "import express from \"express\"; const app = express(); const PORT = 3000; app.listen(PORT);",
    descriptionUz: "Express tarkibidagi asosiy veb-server dasturini yaratish va port yo'lini oqilona tanlash.",
    descriptionEn: "Bootstrap a secure production-grade API server in Express and Node environment."
  },
  {
    id: 122, number: 2, stage: 'backend',
    titleUz: "REST API GET Marshruti", titleEn: "REST API GET Controller",
    targetKeys: "req, res, get, json",
    textUz: "app.get(\"/api/v1/users\", (req, res) => { return res.status(200).json({ success: true, data: [] }); });",
    textEn: "app.get(\"/api/v1/users\", (req, res) => { return res.status(200).json({ success: true, data: [] }); });",
    altTextUz: "app.get(\"/api/health\", (req, res) => { res.send({ status: \"ok\", timestamp: Date.now() }); });",
    altTextEn: "app.get(\"/api/health\", (req, res) => { res.send({ status: \"ok\", timestamp: Date.now() }); });",
    descriptionUz: "API foydalanuvchilariga ma'lumot uzatuvchi asosiy marshrut va javoblarni ulash.",
    descriptionEn: "Generate elegant API response payloads with appropriate status codes and handlers."
  },
  {
    id: 123, number: 3, stage: 'backend',
    titleUz: "Serverni tinglash buyrug'i", titleEn: "Node.js app.listen Setup",
    targetKeys: "listen, console.log",
    textUz: "app.listen(PORT, \"0.0.0.0\", () => { console.log(`Server runs on http://localhost:${PORT}`); });",
    textEn: "app.listen(PORT, \"0.0.0.0\", () => { console.log(`Server runs on http://localhost:${PORT}`); });",
    altTextUz: "app.listen(3000, () => { console.log(\"Node.js server successfully booted in sandbox!\"); });",
    altTextEn: "app.listen(3000, () => { console.log(\"Node.js server successfully booted in sandbox!\"); });",
    descriptionUz: "Kiruvchi HTTPS so'rovlarini qabul qilish uchun serverni maxsus portga ulash va tinglash.",
    descriptionEn: "Host bindings setup, triggering callback functions, and standard shell logs output."
  },
  {
    id: 124, number: 4, stage: 'backend',
    titleUz: "Oraliq Dasturlar (Middleware)", titleEn: "Express Express Middleware",
    targetKeys: "use, cors, json",
    textUz: "app.use(express.json()); app.use(express.urlencoded({ extended: true })); app.use(cors());",
    textEn: "app.use(express.json()); app.use(express.urlencoded({ extended: true })); app.use(cors());",
    altTextUz: "const checkAuth = (req, res, next) => { if (!req.headers.auth) return res.send(401); next(); };",
    altTextEn: "const checkAuth = (req, res, next) => { if (!req.headers.auth) return res.send(401); next(); };",
    descriptionUz: "JSON ma'lumotlarni o'qish, URL tahlili va cross-origin (CORS) ruxsatnomalarini sozlash.",
    descriptionEn: "Excellent practice typing server pipeline request processors and auth barriers."
  },
  {
    id: 125, number: 5, stage: 'backend',
    titleUz: "Python massiv qatlamlari", titleEn: "Python List Comprehensions",
    targetKeys: "[x for x in list]",
    textUz: "numbers = [1, 2, 3, 4, 5, 6] doubled_even = [x * 2 for x in numbers if x % 2 == 0]",
    textEn: "numbers = [1, 2, 3, 4, 5, 6] doubled_even = [x * 2 for x in numbers if x % 2 == 0]",
    altTextUz: "names = [\"Doniyor\", \"Kamolov\", \"Ali\"] clean_names = [n.strip().upper() for n in names]",
    altTextEn: "names = [\"Doniyor\", \"Kamolov\", \"Ali\"] clean_names = [n.strip().upper() for n in names]",
    descriptionUz: "Python tilidagi kuchli, ixcham va tez ishlaydigan massivlarni filtrlash qatori.",
    descriptionEn: "Master typing clean functional python list expressions and filters."
  },
  {
    id: 126, number: 6, stage: 'backend',
    titleUz: "NodeJS fayl tizimi tahlili", titleEn: "NodeJS File System Read",
    targetKeys: "fs, err, content",
    textUz: "fs.readFile(filePath, \"utf8\", (err, data) => { if (err) throw err; const json = JSON.parse(data); });",
    textEn: "fs.readFile(filePath, \"utf8\", (err, data) => { if (err) throw err; const json = JSON.parse(data); });",
    altTextUz: "fs.writeFileSync(outPath, JSON.stringify(profile, null, 2), { encoding: \"utf8\" }, () => {});",
    altTextEn: "fs.writeFileSync(outPath, JSON.stringify(profile, null, 2), { encoding: \"utf8\" }, () => {});",
    descriptionUz: "Tizimdagi fayllarni asinxron o'qish, xatoliklarni tekshirish va JSON formatga keltirish.",
    descriptionEn: "Build muscle memory for backend buffers, custom parser systems, error states."
  },
  {
    id: 127, number: 7, stage: 'backend',
    titleUz: "Python ob'ektlar sinfi", titleEn: "Python Object Oriented Class",
    targetKeys: "class, self, def",
    textUz: "class Developer: def __init__(self, name, exp): self.name = name self.exp = exp; dev = Developer(\"Doniyor\", 5)",
    textEn: "class Developer: def __init__(self, name, exp): self.name = name self.exp = exp; dev = Developer(\"Doniyor\", 5)",
    altTextUz: "class Account: def get_balance(self): return self.balance; acc = Account(); print(acc.get_balance())",
    altTextEn: "class Account: def get_balance(self): return self.balance; acc = Account(); print(acc.get_balance())",
    descriptionUz: "Python OOP (Obyektga yo'naltirilgan dasturlash) asosidagi sinflar va boshlang'ich konstruktor.",
    descriptionEn: "Practice Python syntax conventions, colons, indentation spacing, and parameters."
  },
  {
    id: 128, number: 8, stage: 'backend',
    titleUz: "JWT Token Shifrlash", titleEn: "JWT Token Generation Auth",
    targetKeys: "jwt, sign, expires",
    textUz: "const token = jwt.sign({ id: user.id, role: \"admin\" }, process.env.JWT_SECRET, { expiresIn: \"7d\" });",
    textEn: "const token = jwt.sign({ id: user.id, role: \"admin\" }, process.env.JWT_SECRET, { expiresIn: \"7d\" });",
    altTextUz: "const decoded = jwt.verify(token, process.env.JWT_SECRET); const userId = decoded.id; req.user = userId;",
    altTextEn: "const decoded = jwt.verify(token, process.env.JWT_SECRET); const userId = decoded.id; req.user = userId;",
    descriptionUz: "Foydalanuvchilarni ishonchli autentifikatsiya qilish uchun JWT shifrlarini imzolash.",
    descriptionEn: "Practice critical security APIs typing which requires combinations of variables."
  },
  {
    id: 129, number: 9, stage: 'backend',
    titleUz: "FastAPI REST Controller", titleEn: "FastAPI Python Route Decorator",
    targetKeys: "@app, fastapi, return",
    textUz: "@app.get(\"/api/v1/items/{item_id}\") def fetch_data(item_id: int): return {\"id\": item_id, \"status\": \"success\"}",
    textEn: "@app.get(\"/api/v1/items/{item_id}\") def fetch_data(item_id: int): return {\"id\": item_id, \"status\": \"success\"}",
    altTextUz: "@app.post(\"/api/billing\") def charge_credit(amount: float): return {\"success\": True, \"charged\": amount}",
    altTextEn: "@app.post(\"/api/billing\") def charge_credit(amount: float): return {\"success\": True, \"charged\": amount}",
    descriptionUz: "Python uchun eng tezkor FastAPI tizimidagi GET va POST marshrutlarini yaratish.",
    descriptionEn: "Practice decorators, parameters syntax typing, return dictionaries, and Python types."
  },
  {
    id: 130, number: 10, stage: 'backend',
    titleUz: "Bcrypt Parol Shifrlash", titleEn: "Bcrypt Secure Password Hash",
    targetKeys: "bcrypt, hash, salt",
    textUz: "const salt = await bcrypt.genSalt(10); const hashed = await bcrypt.hash(password, salt);",
    textEn: "const salt = await bcrypt.genSalt(10); const hashed = await bcrypt.hash(password, salt);",
    altTextUz: "const isMatch = await bcrypt.compare(plainPassword, user.passwordHash); if (!isMatch) return false;",
    altTextEn: "const isMatch = await bcrypt.compare(plainPassword, user.passwordHash); if (!isMatch) return false;",
    descriptionUz: "Foydalanuvchilar parolini ma'lumotlar bazasida xavfsiz saqlash uchun shifrlash (hashing).",
    descriptionEn: "Excellent practice typing password-related variables, asynchronous calls, and secure checks."
  },
  {
    id: 131, number: 11, stage: 'backend',
    titleUz: "Express Xatolar Protsessori", titleEn: "Express Global Error Handler",
    targetKeys: "next, status, message",
    textUz: "app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: err.message }); });",
    textEn: "app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: err.message }); });",
    altTextUz: "if (!product) { const e = new Error(\"Not Found\"); e.status = 404; return next(e); }",
    altTextEn: "if (!product) { const e = new Error(\"Not Found\"); e.status = 404; return next(e); }",
    descriptionUz: "Serverda paydo bo'lgan kutilmagan xatolarni markaziy tartibda ushlash va qayta ishlash logikasi.",
    descriptionEn: "Build muscle memory typing global handlers parameters, stack traces, and JSON crash guards."
  },
  {
    id: 132, number: 12, stage: 'backend',
    titleUz: "Axios POST So'rovini Yuborish", titleEn: "Axios API POST Request",
    targetKeys: "axios.post, headers, bearer",
    textUz: "const res = await axios.post(\"/api/v2/items\", { quota: 25 }, { headers: { Authorization: `Bearer ${tok}` } });",
    textEn: "const res = await axios.post(\"/api/v2/items\", { quota: 25 }, { headers: { Authorization: `Bearer ${tok}` } });",
    altTextUz: "const payload = { active: true }; const { data } = await axios.patch(`/users/${id}`, payload);",
    altTextEn: "const payload = { active: true }; const { data } = await axios.patch(`/users/${id}`, payload);",
    descriptionUz: "Tashqi serverlar yoki mikroxizmatlar bilan asinxron ma'lumot almashuvchi HTTP so'rovi.",
    descriptionEn: "Train standard nested brackets structures, string interpolations, headers configurations."
  },
  {
    id: 133, number: 13, stage: 'backend',
    titleUz: "Python Xatolar Bloklash (Try)", titleEn: "Python Try-Except Handler",
    targetKeys: "try, except, Exception",
    textUz: "try: result = db.fetch_user(id) except Exception as e: logger.error(f\"DB error: {e}\") raise e",
    textEn: "try: result = db.fetch_user(id) except Exception as e: logger.error(f\"DB error: {e}\") raise e",
    altTextUz: "try: config = read_env() except FileNotFoundError: config = { 'port': 3000 }",
    altTextEn: "try: config = read_env() except FileNotFoundError: config = { 'port': 3000 }",
    descriptionUz: "Python tizimi ish paytida to'xtab qolmasligi uchun istisnolarni loglash va xavfsiz boshqarish.",
    descriptionEn: "Excellent exercise for Python indentations, formatted error strings, and exception propagation."
  },
  {
    id: 134, number: 14, stage: 'backend',
    titleUz: "Node Tizim Muhitlari (env)", titleEn: "Node.js Environment Loader",
    targetKeys: "process.env, config, dotenv",
    textUz: "require('dotenv').config(); const stripeKey = process.env.STRIPE_SECRET_KEY; if (!stripeKey) throw new Error();",
    textEn: "require('dotenv').config(); const stripeKey = process.env.STRIPE_SECRET_KEY; if (!stripeKey) throw new Error();",
    altTextUz: "const devMode = process.env.NODE_ENV !== 'production'; const apiHost = devMode ? 'localhost' : 'api.com';",
    altTextEn: "const devMode = process.env.NODE_ENV !== 'production'; const apiHost = devMode ? 'localhost' : 'api.com';",
    descriptionUz: "Ilovalarni xavfsizlik kalitlari va aloqa resurslarini configuration orqali yuklash tizimi.",
    descriptionEn: "Master typing secure environment access declarations, nested logic blocks, and strict checks."
  },
  {
    id: 135, number: 15, stage: 'backend',
    titleUz: "Node.js Cluster Klasterlash", titleEn: "Node.js Multiprocess Clustering",
    targetKeys: "cluster, fork, isMaster",
    textUz: "if (cluster.isMaster) { for (let i = 0; i < numCPUs; i++) { cluster.fork(); } } else { app.listen(3000); }",
    textEn: "if (cluster.isMaster) { for (let i = 0; i < numCPUs; i++) { cluster.fork(); } } else { app.listen(3000); }",
    altTextUz: "cluster.on('exit', (worker) => { console.log(`Worker ${worker.process.pid} offline`); cluster.fork(); });",
    altTextEn: "cluster.on('exit', (worker) => { console.log(`Worker ${worker.process.pid} offline`); cluster.fork(); });",
    descriptionUz: "Serverni kuchli yuklamalarda barcha protsessor yadrolarida ruxsat berilgan klasterlarda ishga tushirish.",
    descriptionEn: "Practice typing advanced Node scaling primitives, concurrent event listeners, and parameters."
  },
  {
    id: 136, number: 16, stage: 'backend',
    titleUz: "Python Lambda Anonim Funksiya", titleEn: "Python Lambda & Map Utilities",
    targetKeys: "lambda, map, filter",
    textUz: "items = [{'p': 10}, {'p': 20}] prices = list(map(lambda x: x['p'] * 1.15, items))",
    textEn: "items = [{'p': 10}, {'p': 20}] prices = list(map(lambda x: x['p'] * 1.15, items))",
    altTextUz: "primes = [2, 3, 5, 7, 11] oddsOnly = list(filter(lambda x: x % 2 != 0, primes))",
    altTextEn: "primes = [2, 3, 5, 7, 11] oddsOnly = list(filter(lambda x: x % 2 != 0, primes))",
    descriptionUz: "Python tilidagi bitta qatorda tezkor ishlovchi anonim funksiyalar va massiv operatorlari.",
    descriptionEn: "Build muscle memory for Python arrays mappings, mathematical arguments and dictionaries."
  },
  {
    id: 137, number: 17, stage: 'backend',
    titleUz: "Express Parametrlarini O'qish", titleEn: "Express Route Request Params",
    targetKeys: "req.params, parseInt, isNaN",
    textUz: "app.get('/users/:id', (req, res) => { const userId = parseInt(req.params.id); if (isNaN(userId)) return res.send(400); });",
    textEn: "app.get('/users/:id', (req, res) => { const userId = parseInt(req.params.id); if (isNaN(userId)) return res.send(400); });",
    altTextUz: "const { category, tag } = req.query; const filterData = await getInventory(category, tag);",
    altTextEn: "const { category, tag } = req.query; const filterData = await getInventory(category, tag);",
    descriptionUz: "Marshrut orqali kelayotgan foydalanuvchi ID yoki query parametrlarini xavfsiz ajratib olish va tekshirish.",
    descriptionEn: "Excellent exercise writing route controller parameter validations, parsers, and error guards."
  },
  {
    id: 138, number: 18, stage: 'backend',
    titleUz: "Redis Kesh Aloqasini Sozlash", titleEn: "Redis Client Cache Client",
    targetKeys: "createClient, set, expire",
    textUz: "const rd = createClient(); await rd.connect(); await rd.set('user:key', JSON.stringify(data), { EX: 3600 });",
    textEn: "const rd = createClient(); await rd.connect(); await rd.set('user:key', JSON.stringify(data), { EX: 3600 });",
    altTextUz: "const raw = await rd.get('user:key'); if (raw) { return res.json(JSON.parse(raw)); }",
    altTextEn: "const raw = await rd.get('user:key'); if (raw) { return res.json(JSON.parse(raw)); }",
    descriptionUz: "Ma'lumotlar bazasi yuklamasini kamaytirish uchun tezkor Redis kesh bazasini ulash va saqlash.",
    descriptionEn: "Type high speed asynchronous cache controls, expiry durations, and parsing objects."
  },
  {
    id: 139, number: 19, stage: 'backend',
    titleUz: "Fayllarni AES Shifrlash", titleEn: "Crypto Encypting Block AES-256",
    targetKeys: "createCipheriv, update, final",
    textUz: "const cp = crypto.createCipheriv('aes-256-cbc', key, iv); let enc = cp.update(text, 'utf8', 'hex'); enc += cp.final('hex');",
    textEn: "const cp = crypto.createCipheriv('aes-256-cbc', key, iv); let enc = cp.update(text, 'utf8', 'hex'); enc += cp.final('hex');",
    altTextUz: "const dp = crypto.createDecipheriv('aes-255-cbc', key, iv); let dec = dp.update(cipher, 'hex', 'utf8');",
    altTextEn: "const dp = crypto.createDecipheriv('aes-255-cbc', key, iv); let dec = dp.update(cipher, 'hex', 'utf8');",
    descriptionUz: "NodeJS mukammal kriptografiya kutubxonasi yordamida ma'lumotlarni ishonchli shifrlash va himoyalash.",
    descriptionEn: "Master typing highly sensitive security wrappers, buffers, and hex output configurations."
  },
  {
    id: 140, number: 20, stage: 'backend',
    titleUz: "Python Generator va Yield", titleEn: "Python Generator Yield stream",
    targetKeys: "def, yield, next",
    textUz: "def stream_lines(file_path): with open(file_path) as f: for line in f: yield line.strip()",
    textEn: "def stream_lines(file_path): with open(file_path) as f: for line in f: yield line.strip()",
    altTextUz: "def fibonacci(limit): a, b = 0, 1; while a < limit: yield a; a, b = b, a + b",
    altTextEn: "def fibonacci(limit): a, b = 0, 1; while a < limit: yield a; a, b = b, a + b",
    descriptionUz: "Python-da katta hajmli fayllarni xotirani to'ldirmasdan qismlarga bo'lib o'quvchi strim generatiri.",
    descriptionEn: "Construct Python streaming functions with with-blocks, file pointers, and loops generators."
  },

  // --- DATABASE & SECURITY (141 - 160) ---
  {
    id: 141, number: 1, stage: 'database',
    titleUz: "SQL JOIN Birlashma So'rovi", titleEn: "Relational SQL SELECT JOIN",
    targetKeys: "SELECT, JOIN, ON",
    textUz: "SELECT u.id, u.name, p.title FROM users u INNER JOIN posts p ON u.id = p.author_id WHERE u.active = 1;",
    textEn: "SELECT u.id, u.name, p.title FROM users u INNER JOIN posts p ON u.id = p.author_id WHERE u.active = 1;",
    altTextUz: "SELECT c.category_name, COUNT(p.id) FROM categories c LEFT JOIN products p ON c.id = p.cat_id GROUP BY 1;",
    altTextEn: "SELECT c.category_name, COUNT(p.id) FROM categories c LEFT JOIN products p ON c.id = p.cat_id GROUP BY 1;",
    descriptionUz: "Bir nechta bog'langan relatsion jadvallardagi ma'lumotlarni birlashtirib yuklovchi SQL JOIN so'rovi.",
    descriptionEn: "Relational queries require rigorous SQL commands syntax, capitalize keywords, and variables mapping."
  },
  {
    id: 142, number: 2, stage: 'database',
    titleUz: "SQL Yangi Yozuv Qo'shish", titleEn: "SQL INSERT Records Query",
    targetKeys: "INSERT, VALUES",
    textUz: "INSERT INTO users (name, email, age) VALUES ('Doniyor', 'doniyor@example.com', 24);",
    textEn: "INSERT INTO users (name, email, age) VALUES ('Doniyor', 'doniyor@example.com', 24);",
    altTextUz: "INSERT INTO audit_logs (level, message, created_at) VALUES ('ERROR', 'DB offline', NOW());",
    altTextEn: "INSERT INTO audit_logs (level, message, created_at) VALUES ('ERROR', 'DB offline', NOW());",
    descriptionUz: "Jadvalga yangi qator ma'lumot joylashtiradigan klassik SQL buyrug'i.",
    descriptionEn: "Train standard database rows insert execution commands, single quotes, values parentheses."
  },
  {
    id: 143, number: 3, stage: 'database',
    titleUz: "Drizzle Shartli Jadvallar", titleEn: "Drizzle Schema Definition",
    targetKeys: "pgTable, serial, varchar",
    textUz: "export const users = pgTable(\"users\", { id: serial(\"id\").primaryKey(), email: varchar(\"email\", { length: 255 }).unique() });",
    textEn: "export const users = pgTable(\"users\", { id: serial(\"id\").primaryKey(), email: varchar(\"email\", { length: 255 }).unique() });",
    altTextUz: "export const profiles = pgTable(\"profiles\", { userId: integer(\"user_id\").references(() => users.id), bio: text(\"bio\") });",
    altTextEn: "export const profiles = pgTable(\"profiles\", { userId: integer(\"user_id\").references(() => users.id), bio: text(\"bio\") });",
    descriptionUz: "TypeScript ORM (Drizzle) yordamida PostgreSQL jadvallari va ustunlarini dasturlash.",
    descriptionEn: "Excellent exercise writing direct database schemas object variables paired with strict types."
  },
  {
    id: 144, number: 4, stage: 'database',
    titleUz: "Firestore Xavfsizlik Qoidasi", titleEn: "Firestore Database Security Rules",
    targetKeys: "rules, match, service",
    textUz: "rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read: if true; } } }",
    textEn: "rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read: if true; } } }",
    altTextUz: "service cloud.firestore { match /databases/{database}/documents { match /posts/{post} { allow write: if request.auth != null; } } }",
    altTextEn: "service cloud.firestore { match /databases/{database}/documents { match /posts/{post} { allow write: if request.auth != null; } } }",
    descriptionUz: "Bulutli Firestore bazasini to'liq himoya qilish uchun yoziladigan xavfsizlik va kirish ruxsatnomasi qoidalari.",
    descriptionEn: "Practice writing cloud production database permissions and constraints rules correctly."
  },
  {
    id: 145, number: 5, stage: 'database',
    titleUz: "Firestore Shartli Ruxsatlar", titleEn: "Firestore Conditional Permissions",
    targetKeys: "auth, request, resource",
    textUz: "match /users/{userId} { allow read, write: if request.auth != null && request.auth.uid == userId; }",
    textEn: "match /users/{userId} { allow read, write: if request.auth != null && request.auth.uid == userId; }",
    altTextUz: "match /chats/{chatId} { allow create: if request.resource.data.creator == request.auth.uid && request.auth != null; }",
    altTextEn: "match /chats/{chatId} { allow create: if request.resource.data.creator == request.auth.uid && request.auth != null; }",
    descriptionUz: "Har bir foydalanuvchi faqatgina o'ziga taalluqli ma'lumotlarni o'zgartira olishini ta'minlovchi xavfsiz qoida.",
    descriptionEn: "Master custom matching declarations, equality assertions, and auth token structures."
  },
  {
    id: 146, number: 6, stage: 'database',
    titleUz: "Maxfiy Muhit Sozlamalari (.env)", titleEn: "Environment Variables Configuration",
    targetKeys: "DATABASE_URL, SECRET",
    textUz: "DATABASE_URL=\"postgresql://doniyor:kamolov_sec@localhost:5432/dk_database?sslmode=require\" JWT_SECRET=\"super_secret_tok_key\"",
    textEn: "DATABASE_URL=\"postgresql://doniyor:kamolov_sec@localhost:5432/dk_database?sslmode=require\" JWT_SECRET=\"super_secret_tok_key\"",
    altTextUz: "FIREBASE_PROJECT_ID=\"firebase-main-sandbox\" GOOGLE_APPLICATION_CREDENTIALS=\"./credentials.json\" PORT=3000",
    altTextEn: "FIREBASE_PROJECT_ID=\"firebase-main-sandbox\" GOOGLE_APPLICATION_CREDENTIALS=\"./credentials.json\" PORT=3000",
    descriptionUz: "Kodlar ichiga maxfiy kalitlar va aloqa yo'llarini qo'shib yubormaslik uchun maxsus (.env) konfiguratsiyasi.",
    descriptionEn: "Type modern variables files configurations, parameters setups, single and double quotes."
  },
  {
    id: 147, number: 7, stage: 'database',
    titleUz: "SQL Keraksiz Ma'lumotlarni O'chirish", titleEn: "SQL DELETE Old Logs Safely",
    targetKeys: "DELETE, FROM, WHERE",
    textUz: "DELETE FROM session_logs WHERE created_at < NOW() - INTERVAL '30 days' AND is_persisted = false;",
    textEn: "DELETE FROM session_logs WHERE created_at < NOW() - INTERVAL '30 days' AND is_persisted = false;",
    altTextUz: "DELETE FROM carts WHERE status = 'abandoned' AND updated_at < CURRENT_DATE - 7 AND total_items = 0;",
    altTextEn: "DELETE FROM carts WHERE status = 'abandoned' AND updated_at < CURRENT_DATE - 7 AND total_items = 0;",
    descriptionUz: "Bazani ortiqcha hajmdan tozalash uchun eskirgan jadvallardagi qatorlarni xavfsiz o'chirib yuborish.",
    descriptionEn: "Database cleanliness queries formatting, interval expressions, and conditions sequence."
  },
  {
    id: 148, number: 8, stage: 'database',
    titleUz: "SQL Qiymatni Yangilash (UPDATE)", titleEn: "SQL UPDATE Row Attributes",
    targetKeys: "UPDATE, SET, WHERE",
    textUz: "UPDATE user_profiles SET designation = 'Senior Architect', rating = 4.9 WHERE user_id = 1102;",
    textEn: "UPDATE user_profiles SET designation = 'Senior Architect', rating = 4.9 WHERE user_id = 1102;",
    altTextUz: "UPDATE accounts SET frozen_balance = 0.0, status = 'ACTIVE' WHERE id = 771 AND outstanding_debt <= 0.5 BOUND;",
    altTextEn: "UPDATE accounts SET frozen_balance = 0.0, status = 'ACTIVE' WHERE id = 771 AND outstanding_debt <= 0.5 BOUND;",
    descriptionUz: "Mavjud ma'lumotlar bazasining muayyan jadvalidagi ma'lum bir foydalanuvchi ma'lumotini yangilash so'rovi.",
    descriptionEn: "Train standard UPDATE query keywords, SET attributes mappings, and precise filter criteria."
  },
  {
    id: 149, number: 9, stage: 'database',
    titleUz: "NoSQL MongoDB Hujjat Qo'shish", titleEn: "NoSQL MongoDB Insert Document",
    targetKeys: "insertOne, collection",
    textUz: "db.collection(\"users\").insertOne({ id: 105, fullName: \"Doniyor Kamolov\", skills: [\"React\", \"Node\", \"Postgres\"] });",
    textEn: "db.collection(\"users\").insertOne({ id: 105, fullName: \"Doniyor Kamolov\", skills: [\"React\", \"Node\", \"Postgres\"] });",
    altTextUz: "db.collection(\"logs\").insertMany([{ level: \"info\", msg: \"boot\" }, { level: \"error\", msg: \"network failed\" }]);",
    altTextEn: "db.collection(\"logs\").insertMany([{ level: \"info\", msg: \"boot\" }, { level: \"error\", msg: \"network failed\" }]);",
    descriptionUz: "MongoDB relyatsiyasiz bazasida yangi JSON ko'rinishidagi hujjatlarni kolleksiyaga qo'shish.",
    descriptionEn: "Build muscle memory typing document arrays, nested arrays, and curly brace JSON layouts."
  },
  {
    id: 150, number: 10, stage: 'database',
    titleUz: "Firebase Admin Bo'lim Tekshiruvi", titleEn: "Firebase Auth Admin Claim Role check",
    targetKeys: "auth.token.admin",
    textUz: "match /system/config { allow write: if request.auth != null && request.auth.token.admin == true; }",
    textEn: "match /system/config { allow write: if request.auth != null && request.auth.token.admin == true; }",
    altTextUz: "match /billing/{invoiceId} { allow delete: if request.auth != null && request.auth.token.role == \"finance\"; }",
    altTextEn: "match /billing/{invoiceId} { allow delete: if request.auth != null && request.auth.token.role == \"finance\"; }",
    descriptionUz: "Tizim sozlamalari va ma'muriy jadvallarni faqatgina admin huquqi bor foydalanuvchilarga ochish.",
    descriptionEn: "Outstanding exercise for logic security assertions, nested matches, and boolean claims."
  },
  {
    id: 151, number: 11, stage: 'database',
    titleUz: "SQL GROUP BY Aggregatlar tahlili", titleEn: "SQL GROUP BY Aggregate Functions",
    targetKeys: "GROUP BY, COUNT, HAVING",
    textUz: "SELECT category_id, COUNT(*), SUM(price) FROM products GROUP BY category_id HAVING COUNT(*) > 5;",
    textEn: "SELECT category_id, COUNT(*), SUM(price) FROM products GROUP BY category_id HAVING COUNT(*) > 5;",
    altTextUz: "SELECT team_id, AVG(salary) FROM employees WHERE active = true GROUP BY team_id HAVING AVG(salary) > 4000;",
    altTextEn: "SELECT team_id, AVG(salary) FROM employees WHERE active = true GROUP BY team_id HAVING AVG(salary) > 4000;",
    descriptionUz: "Ma'lumotlarni guruhlash ssenariysi, guruhlar sonini darslar bilan filter qilish HAVING so'rovi.",
    descriptionEn: "Practice typing complex SQL aggregate expressions, GROUP BY constraints and aggregation logic."
  },
  {
    id: 152, number: 12, stage: 'database',
    titleUz: "SQL Tranzaksiya Boshqarish", titleEn: "SQL Transaction BEGIN COMMIT",
    targetKeys: "BEGIN, COMMIT, ROLLBACK",
    textUz: "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 12; COMMIT;",
    textEn: "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 12; COMMIT;",
    altTextUz: "ROLLBACK; -- Agar biron bir operatsiyada xatolik bo'lsa tranzaksiyani to'liq rad etish",
    altTextEn: "ROLLBACK; -- Rollback database state completely if queries fail in the middle pipeline",
    descriptionUz: "Ma'lumotlar butunligini ta'minlaydigan atomic tranzaktsiyalar zanjirini mashq qilish.",
    descriptionEn: "Type foundational ACID database control blocks, COMMIT actions, and error rollbacks."
  },
  {
    id: 153, number: 13, stage: 'database',
    titleUz: "SQL Indeks Yaratish So'rovi", titleEn: "SQL CREATE INDEX Performance",
    targetKeys: "CREATE INDEX, UNIQUE",
    textUz: "CREATE UNIQUE INDEX idx_users_email ON users(email); -- Tezkor qidiruvni ta'minlovchi indeks",
    textEn: "CREATE UNIQUE INDEX idx_users_email ON users(email); -- Create unique constraints structure",
    altTextUz: "CREATE INDEX idx_products_cat_price ON products(category_id, price DESC);",
    altTextEn: "CREATE INDEX idx_products_cat_price ON products(category_id, price DESC);",
    descriptionUz: "Katta ma'lumotlarda qidiruvni yuzlab barobargacha tezlashtiradigan indekslar qurish buyrug'i.",
    descriptionEn: "Excellent exercise writing physical indexes definitions on database schemas."
  },
  {
    id: 154, number: 14, stage: 'database',
    titleUz: "Firestore Maxsus Tekshiruvchi Funksiya", titleEn: "Firestore Rules Custom Function",
    targetKeys: "function, return, request",
    textUz: "function isOwner(userId) { return request.auth != null && request.auth.uid == userId; }",
    textEn: "function isOwner(userId) { return request.auth != null && request.auth.uid == userId; }",
    altTextUz: "function isAdmin() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true; }",
    altTextEn: "function isAdmin() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true; }",
    descriptionUz: "Firestore qoidalari ichida takrorlanishlarni kamaytirish uchun yoziladigan xavfsizlik funksiyalari.",
    descriptionEn: "Excellent complex security rules exercise, writing variables pathways, maps, and booleans."
  },
  {
    id: 155, number: 15, stage: 'database',
    titleUz: "SQL Ichma-Ich Subquery So'rovi", titleEn: "SQL Subquery Nested Selection",
    targetKeys: "SELECT, WHERE, IN",
    textUz: "SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;",
    textEn: "SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;",
    altTextUz: "SELECT name FROM employees WHERE id IN (SELECT manager_id FROM departments WHERE id = 7);",
    altTextEn: "SELECT name FROM employees WHERE id IN (SELECT manager_id FROM departments WHERE id = 7);",
    descriptionUz: "Boshqa bir SQL so'rovining natijasini shart sifatida ishlatadigan murakkab ichki so'rovlar.",
    descriptionEn: "Practice nested select parenthesis structures, ordering declarations, and mathematical conditions."
  },
  {
    id: 156, number: 16, stage: 'database',
    titleUz: "Firestore Kolleksiya-Guruh Qoidalari", titleEn: "Firestore Collection Group Rules",
    targetKeys: "match, /databases/, rules",
    textUz: "match /databases/{database}/documents { match /{path=**}/comments/{commentId} { allow read: if true; } }",
    textEn: "match /databases/{database}/documents { match /{path=**}/comments/{commentId} { allow read: if true; } }",
    altTextUz: "match /{path=**}/reviews/{reviewId} { allow write: if request.auth != null; }",
    altTextEn: "match /{path=**}/reviews/{reviewId} { allow write: if request.auth != null; }",
    descriptionUz: "Butun baza bo'ylab istalgan joyda joylashgan kichik kolleksiyalar uchun global ruxsat qoidalari.",
    descriptionEn: "Train hierarchy path configurations, deep nested variables mapping, and authorization checks."
  },
  {
    id: 157, number: 17, stage: 'database',
    titleUz: "SQL Jadval Ustunini O'zgartirish", titleEn: "SQL ALTER TABLE Column constraint",
    targetKeys: "ALTER TABLE, ADD COLUMN",
    textUz: "ALTER TABLE user_profiles ADD COLUMN secondary_email VARCHAR(255) DEFAULT NULL UNIQUE;",
    textEn: "ALTER TABLE user_profiles ADD COLUMN secondary_email VARCHAR(255) DEFAULT NULL UNIQUE;",
    altTextUz: "ALTER TABLE active_sessions DROP COLUMN temp_token; -- Zararsiz tizim ustunini yo'qotish",
    altTextEn: "ALTER TABLE active_sessions DROP COLUMN temp_token; -- Drop temporary auth headers safely",
    descriptionUz: "Mavjud jadval tarkibini buzmasdan yangi ustun, xossalarni mukammal qo'shish buyrug'i.",
    descriptionEn: "Construct high fidelity DDL commands structures, column types, and unique keys constraints."
  },
  {
    id: 158, number: 18, stage: 'database',
    titleUz: "SQL Virtual Ko'rinish (VIEW) Yaratish", titleEn: "SQL CREATE VIEW Virtual Table",
    targetKeys: "CREATE VIEW, AS, SELECT",
    textUz: "CREATE VIEW active_admin_users AS SELECT id, name, email FROM users WHERE role = 'admin' AND is_active = true;",
    textEn: "CREATE VIEW active_admin_users AS SELECT id, name, email FROM users WHERE role = 'admin' AND is_active = true;",
    altTextUz: "CREATE VIEW sales_summary AS SELECT product_id, SUM(quantity) FROM orders GROUP BY product_id;",
    altTextEn: "CREATE VIEW sales_summary AS SELECT product_id, SUM(quantity) FROM orders GROUP BY product_id;",
    descriptionUz: "Xavfsizlik yuzasidan foydalanuvchilarga faqat ma'lum ustunlarni ko'rsatuvchi virtual SQL jadvallari.",
    descriptionEn: "Master typing virtual relational schemas, filter limits keywords, aliases, and selects."
  },
  {
    id: 159, number: 19, stage: 'database',
    titleUz: "Firestore Sarlavhali Tekshiruvlar", titleEn: "Firestore Auth Token Headers Match",
    targetKeys: "request.auth.token",
    textUz: "match /billing/{id} { allow read: if request.auth.token.email.endsWith('@company.com'); }",
    textEn: "match /billing/{id} { allow read: if request.auth.token.email.endsWith('@company.com'); }",
    altTextUz: "match /internal/{id} { allow read: if request.auth.token.email_verified == true; }",
    altTextEn: "match /internal/{id} { allow read: if request.auth.token.email_verified == true; }",
    descriptionUz: "Faqatgina ma'lum bir domendagi yoki tasdiqlangan elektron pochtali foydalanuvchilar ruxsatnomasi.",
    descriptionEn: "Excellent security-centric exercise, string methods call, logical and statements compilation."
  },
  {
    id: 160, number: 20, stage: 'database',
    titleUz: "SQL Matnli Qidiruv Indeksi", titleEn: "SQL Full-Text Search TS_VECTOR",
    targetKeys: "to_tsvector, @@, tsquery",
    textUz: "SELECT title, body FROM reports WHERE to_tsvector('english', body) @@ to_tsquery('english', 'security & threat');",
    textEn: "SELECT title, body FROM reports WHERE to_tsvector('english', body) @@ to_tsquery('english', 'security & threat');",
    altTextUz: "SELECT name FROM items WHERE to_tsvector('uzbec', description) @@ to_tsquery('uzbec', 'dastur & xavfsizlik');",
    altTextEn: "SELECT name FROM items WHERE to_tsvector('uzbec', description) @@ to_tsquery('uzbec', 'dastur & xavfsizlik');",
    descriptionUz: "Kalit so'zlar bo'yicha relatsion jadvallardan yuzlab barobar tezroq to'liq matnli qidirish algoritmi.",
    descriptionEn: "Construct advanced text indexing vector queries, boolean search syntax and tsquery operators."
  }
];

// --- DYNAMIC GENERATOR FOR PROGRAMMING EXTRA STAGES (161-250) ---
const aiSnippets = [
  "const ai = new GoogleGenAI({ apiKey }); const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Hello' });",
  "const chat = ai.chats.create({ model: 'gemini-2.5-flash' }); let response = await chat.sendMessage({ message: 'What is climate change?' });",
  "const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [ { text: 'Describe image:' }, { inlineData: { data: base64, mimeType } } ] });",
  "const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: text, config: { responseMimeType: 'application/json', responseSchema } });",
  "for await (const chunk of await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: 'Write a poem about typing' })) { process.stdout.write(chunk.text); }",
  "const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction: 'Strict typing tutor.' } });",
  "const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Uzbekistan capitals', config: { tools: [{ googleSearch: {} }] } });",
  "const embeddings = await ai.models.embedContent({ model: 'text-embedding-004', contents: { parts: [{ text: 'Typing master database' }] } });",
  "const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Search query', config: { tools: [{ functionDeclarations: [myFunc] }] } });",
  "const file = await ai.files.upload({ file: 'path/to/source.js', mimeType: 'text/plain' }); const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [file, 'Review this code'] });"
];

const dsaSnippets = [
  "class ListNode<T> { value: T; next: ListNode<T> | null = null; constructor(value: T) { this.value = value; } }",
  "class BinaryTreeNode<T> { val: T; left: BinaryTreeNode<T> | null = null; right: BinaryTreeNode<T> | null = null; constructor(val: T) { this.val = val; } }",
  "function binarySearch(arr: number[], target: number): number { let l = 0, r = arr.length - 1; while (l <= r) { const m = Math.floor((l+r)/2); if (arr[m] === target) return m; if (arr[m] < target) l = m + 1; else r = m - 1; } return -1; }",
  "function quickSort(arr: number[]): number[] { if (arr.length <= 1) return arr; const p = arr[0]; const left = arr.slice(1).filter(x => x <= p); const right = arr.slice(1).filter(x => x > p); return [...quickSort(left), p, ...quickSort(right)]; }",
  "class Stack<T> { private items: T[] = []; push(item: T) { this.items.push(item); } pop(): T | undefined { return this.items.pop(); } isEmpty() { return this.items.length === 0; } }",
  "class Queue<T> { private items: Record<number, T> = {}; private head = 0; private tail = 0; enqueue(item: T) { this.items[this.tail++] = item; } dequeue() { const val = this.items[this.head]; delete this.items[this.head++]; return val; } }",
  "function bubbleSort(arr: number[]): number[] { const n = arr.length; for (let i = 0; i < n; i++) { for (let j = 0; j < n - i - 1; j++) { if (arr[j] > arr[j+1]) { [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; } } } return arr; }",
  "class Graph { private adjList: Map<any, any[]> = new Map(); addVertex(v: any) { this.adjList.set(v, []); } addEdge(u: any, v: any) { this.adjList.get(u)?.push(v); this.adjList.get(v)?.push(u); } }",
  "function fibonacciMemo(n: number, memo: Record<number, number> = {}): number { if (n <= 1) return n; if (n in memo) return memo[n]; memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo); return memo[n]; }",
  "function hasCycle(head: ListNode<any> | null): boolean { let slow = head, fast = head; while (fast && fast.next) { slow = slow!.next; fast = fast.next.next; if (slow === fast) return true; } return false; }"
];

const sysSnippets = [
  "FROM node:20-alpine AS builder WORKDIR /app COPY package*.json ./ RUN npm ci COPY . . RUN npm run build",
  "server { listen 80; server_name app.dk-typing.uz; location / { proxy_pass http://localhost:3000; proxy_set_header Host $host; } }",
  "apiVersion: apps/v1 kind: Deployment metadata: name: node-app spec: replicas: 3 selector: matchLabels: app: web template: metadata: labels: app: web",
  "version: '3.8' services: web: build: . ports: - '3000:3000' environment: - REDIS_URL=redis://redis:6379 dependency: - redis redis: image: redis:alpine",
  "git checkout -b feature/realtime-sync && git add . && git commit -m 'feat: live multiplayer sync via fullstack' && git push origin feature/realtime-sync",
  "const ipLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests from this IP' }); app.use('/api/', ipLimit);",
  "const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000 });",
  "const secureRouter = express.Router(); secureRouter.use(helmet()); secureRouter.use(cors({ origin: 'https://dk-typing.uz', credentials: true }));",
  "const winston = require('winston'); const logger = winston.createLogger({ level: 'info', format: winston.format.json(), transports: [new winston.transports.Console()] });",
  "const monitor = (req, res, next) => { const start = process.hrtime(); res.on('finish', () => { const diff = process.hrtime(start); logger.info(`${req.method} ${req.url}`); }); next(); };"
];

// 4. `ai_integration` (161 - 190, 30 exercises)
for (let i = 1; i <= 30; i++) {
  const code = aiSnippets[(i - 1) % aiSnippets.length];
  PROGRAMMING_LESSONS.push({
    id: 160 + i,
    number: i,
    stage: 'ai_integration',
    titleUz: `AI Integratsiya: Mashq ${i}`,
    titleEn: `Gemini AI Integration: Lesson ${i}`,
    targetKeys: "models, generateContent",
    textUz: code,
    textEn: code,
    altTextUz: code,
    altTextEn: code,
    descriptionUz: "Gemini TypeScript SDK va neyron tarmoqlar integratsiyasi modullarini dasturlash mantiqi darslari.",
    descriptionEn: "Surgical practice writing Google GenAI model interfaces, streams, and functional configs."
  });
}

// 5. `data_structures` (191 - 220, 30 exercises)
for (let i = 1; i <= 30; i++) {
  const code = dsaSnippets[(i - 1) % dsaSnippets.length];
  PROGRAMMING_LESSONS.push({
    id: 190 + i,
    number: i,
    stage: 'data_structures',
    titleUz: `Algoritm va Tuzilma: Mashq ${i}`,
    titleEn: `Algorithms & DSA: Lesson ${i}`,
    targetKeys: "class, node, search",
    textUz: code,
    textEn: code,
    altTextUz: code,
    altTextEn: code,
    descriptionUz: "Klassik Linked List, Daraxt shoxlari va sorting algoritmlarini yozish mahorati darslari.",
    descriptionEn: "Refine your programming speed typing data structure node models, linked lists and queries."
  });
}

// 6. `system_design` (221 - 250, 30 exercises)
for (let i = 1; i <= 30; i++) {
  const code = sysSnippets[(i - 1) % sysSnippets.length];
  PROGRAMMING_LESSONS.push({
    id: 220 + i,
    number: i,
    stage: 'system_design',
    titleUz: `Tizim va DevOps: Mashq ${i}`,
    titleEn: `System Design & DevOps: Lesson ${i}`,
    targetKeys: "server, docker, proxy",
    textUz: code,
    textEn: code,
    altTextUz: code,
    altTextEn: code,
    descriptionUz: "Docker files, Docker Compose, Nginx konfiguratsiya va routing protokollarini sozlash darslari.",
    descriptionEn: "Cement expert DevOps capability typing physical servers wireframes, gateways, and Git pipelines."
  });
}


