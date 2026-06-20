/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number; // 1 to 60
  stage: 'boshlangich' | 'orta' | 'mukammal';
  number: number; // 1 to 20
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


// Map stages
export const LESSONS: Lesson[] = rawLessons.map(lesson => {
  let stage: 'boshlangich' | 'orta' | 'mukammal' = 'boshlangich';
  if (lesson.id > 40) {
    stage = 'mukammal';
  } else if (lesson.id > 20) {
    stage = 'orta';
  }
  return {
    ...lesson,
    stage
  };
});

export function getLessonsByStage(stage: 'boshlangich' | 'orta' | 'mukammal'): Lesson[] {
  return LESSONS.filter(l => l.stage === stage);
}
