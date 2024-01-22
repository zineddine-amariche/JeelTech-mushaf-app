/*
  @TODO:
  - Add multilingual to the page details
*/

type CountingType = "kufi" | "madani2"

export type Mushaf = string

interface Annotation {
  start: number
  end: number
}

export interface QuranDataType {
  [key: string]: Annotation[]
}

type CountingTypes = {
  [key in CountingType]: {
    suwarAyat: number[][]
    eighths: number[]
    sojood: number[]
  }
}

export type Masahif = {
  [key: string]: {
    countingType: CountingType
    extraStartPages: number
    pagesByVerse: number[]
    enabled: boolean
    id: string
    name: string
    ext: string
    url: string
    local: string
    pages: number
    meta: {
      name: {
        ar: string
        en: string
        fr: string
      }
      riwaya: {
        ar: string
        en: string
        fr: string
      }
      edition: {
        ar: string
        en: string
        fr: string
      }
    }
    getAyatShadows: () => any
  }
}

export type SurahDetails = {
  number: number
  start: number
  ayahs: number
  arabic_name: string
  english_name: string
  english_meaning: string
  type: string
  name: {
    ar: string
    en: string
    fr: string
    audio: {
      ar: string
    }
  }
}

export type EighthDetails = {
  juz: number
  hizb: number
  eighth: number
  page: number
  surah: number
  ayah: number
  verseNo: number
}

type QuranData = {
  _const: {
    countingTypes: CountingTypes
    masahif: Masahif
    suwar: string[][]
  }
  getVerseNoByDuplet: (surah: number, ayah: number, mushaf: Mushaf) => number
  getVerseNoByPage: (page: number, mushaf: Mushaf) => number
  getVerseNoByEighthNo: (eighthNo: number, mushaf: Mushaf) => number
  getEighthNoByVerseNo: (verseNo: number, mushaf: Mushaf) => number
  getEighthDetails: (eighthNo: number, mushaf: Mushaf) => EighthDetails
  getDupletByVerseNo: (verseNo: number, mushaf: Mushaf) => { surah: number; ayah: number }
  getPageByDuplet: (surah: number, ayah: number, mushaf: Mushaf) => number
  getPageByVerse: (varseNo: number, mushaf: Mushaf) => number
  getPageDetails: (
    page: number,
    mushaf: Mushaf,
  ) => {
    verseNo: number
    surah: number
    surahDetails: SurahDetails
    ayah: number
    eighthNo: number
    juz: number
    hizb: number
    eighth: number
    hasNewEighthNo: boolean
  }
  getSurahDetails: (surah: number, mushaf: Mushaf) => SurahDetails
  getNextDuplet: (surah: number, ayah: number, mushaf: Mushaf) => { surah: number; ayah: number }
  getPrevDuplet: (surah: number, ayah: number, mushaf: Mushaf) => { surah: number; ayah: number }
  getNumberOfPages: (mushaf: Mushaf) => number
  getCountingType: (mushaf: Mushaf) => CountingType
  getPrintPageNumber: (page: number, mushaf: Mushaf) => number
  getSuwarDetails: (mushaf: Mushaf) => SurahDetails[]
  _arraySearch: (theArray: number[], item: number) => number
  _dupletSearch: (theArray: number[][], item: number) => { surah: number; ayah: number } | false
}

export const Quran: QuranData = {
  _const: {
    /* prettier-ignore */
    countingTypes: {
        kufi: {
            suwarAyat: [[],[0,7],[7,286],[293,200],[493,176],[669,120],[789,165],[954,206],[1160,75],[1235,129],[1364,109],[1473,123],[1596,111],[1707,43],[1750,52],[1802,99],[1901,128],[2029,111],[2140,110],[2250,98],[2348,135],[2483,112],[2595,78],[2673,118],[2791,64],[2855,77],[2932,227],[3159,93],[3252,88],[3340,69],[3409,60],[3469,34],[3503,30],[3533,73],[3606,54],[3660,45],[3705,83],[3788,182],[3970,88],[4058,75],[4133,85],[4218,54],[4272,53],[4325,89],[4414,59],[4473,37],[4510,35],[4545,38],[4583,29],[4612,18],[4630,45],[4675,60],[4735,49],[4784,62],[4846,55],[4901,78],[4979,96],[5075,29],[5104,22],[5126,24],[5150,13],[5163,14],[5177,11],[5188,11],[5199,18],[5217,12],[5229,12],[5241,30],[5271,52],[5323,52],[5375,44],[5419,28],[5447,28],[5475,20],[5495,56],[5551,40],[5591,31],[5622,50],[5672,40],[5712,46],[5758,42],[5800,29],[5829,19],[5848,36],[5884,25],[5909,22],[5931,17],[5948,19],[5967,26],[5993,30],[6023,20],[6043,15],[6058,21],[6079,11],[6090,8],[6098,8],[6106,19],[6125,5],[6130,8],[6138,8],[6146,11],[6157,11],[6168,8],[6176,3],[6179,9],[6188,5],[6193,4],[6197,7],[6204,3],[6207,6],[6213,3],[6216,5],[6221,4],[6225,5],[6230,6]],
            eighths: [0,23,32,40,48,60,66,73,82,92,98,107,112,120,130,139,148,154,164,172,183,191,195,203,209,219,225,233,239,242,249,254,259,264,269,273,278,286,289,297,307,315,325,334,344,356,367,374,384,395,405,413,425,436,445,452,463,473,478,488,498,503,505,512,516,521,528,538,550,557,566,571,579,585,592,597,606,616,622,632,640,650,658,666,671,674,680,685,691,701,709,713,717,726,735,741,750,758,765,774,779,789,801,814,824,836,847,858,868,879,883,891,899,908,915,923,928,933,939,946,958,974,985,992,1000,1010,1022,1030,1041,1053,1070,1085,1095,1102,1109,1116,1124,1132,1141,1152,1164,1174,1181,1190,1200,1207,1219,1230,1239,1246,1253,1262,1268,1274,1280,1289,1295,1304,1309,1319,1327,1335,1345,1351,1357,1366,1374,1382,1389,1400,1412,1424,1434,1446,1456,1467,1478,1487,1496,1504,1513,1525,1534,1545,1556,1565,1577,1590,1605,1618,1628,1637,1648,1661,1672,1683,1696,1706,1711,1720,1725,1736,1741,1750,1759,1768,1777,1788,1802,1823,1850,1879,1901,1915,1930,1938,1951,1963,1971,1979,1990,1998,2011,2020,2029,2039,2051,2064,2078,2089,2098,2113,2127,2140,2156,2162,2169,2181,2189,2198,2214,2226,2241,2256,2271,2290,2308,2324,2348,2383,2402,2419,2430,2444,2458,2473,2483,2497,2512,2524,2533,2555,2569,2583,2595,2605,2613,2624,2632,2643,2654,2666,2673,2696,2711,2729,2747,2765,2787,2801,2811,2820,2825,2833,2843,2850,2853,2864,2875,2889,2899,2915,2932,2956,2981,3013,3042,3077,3112,3141,3164,3175,3185,3199,3214,3224,3240,3252,3263,3273,3280,3290,3302,3314,3327,3334,3347,3356,3365,3375,3385,3399,3417,3430,3438,3449,3462,3480,3490,3501,3513,3525,3538,3545,3550,3557,3563,3570,3581,3585,3592,3606,3615,3623,3629,3642,3651,3667,3674,3690,3700,3711,3732,3750,3764,3784,3809,3838,3870,3901,3932,3970,3990,4000,4021,4053,4065,4078,4089,4099,4111,4124,4133,4143,4153,4162,4173,4185,4198,4211,4226,4234,4242,4255,4264,4276,4284,4291,4298,4313,4322,4335,4348,4367,4387,4409,4438,4473,4486,4497,4510,4524,4530,4542,4554,4564,4577,4590,4600,4609,4612,4620,4625,4638,4656,4675,4705,4730,4758,4778,4809,4830,4855,4882,4901,4941,4979,5027,5053,5081,5090,5096,5104,5111,5117,5128,5136,5150,5156,5163,5177,5188,5196,5205,5217,5223,5229,5236,5241,5259,5289,5318,5341,5375,5414,5433,5447,5470,5494,5525,5551,5591,5609,5637,5672,5712,5753,5800,5829,5861,5899,5920,5948,5983,6023,6058,6090,6130,6154,6193],
            sojood: [1160,1722,1951,2138,2308,2613,2915,3185,3518,3994,4255],
        },
        madani2: {
            suwarAyat: [[],[0,7],[7,285],[292,200],[492,175],[667,122],[789,167],[956,206],[1162,76],[1238,130],[1368,109],[1477,121],[1598,111],[1709,44],[1753,54],[1807,99],[1906,128],[2034,110],[2144,105],[2249,99],[2348,134],[2482,111],[2593,76],[2669,119],[2788,62],[2850,77],[2927,226],[3153,95],[3248,88],[3336,69],[3405,59],[3464,33],[3497,30],[3527,73],[3600,54],[3654,46],[3700,82],[3782,182],[3964,86],[4050,72],[4122,84],[4206,53],[4259,50],[4309,89],[4398,56],[4454,36],[4490,34],[4524,39],[4563,29],[4592,18],[4610,45],[4655,60],[4715,47],[4762,61],[4823,55],[4878,77],[4955,99],[5054,28],[5082,21],[5103,24],[5127,13],[5140,14],[5154,11],[5165,11],[5176,18],[5194,12],[5206,12],[5218,31],[5249,52],[5301,52],[5353,44],[5397,30],[5427,28],[5455,18],[5473,55],[5528,39],[5567,31],[5598,50],[5648,40],[5688,45],[5733,42],[5775,29],[5804,19],[5823,36],[5859,25],[5884,22],[5906,17],[5923,19],[5942,26],[5968,32],[6000,20],[6020,15],[6035,21],[6056,11],[6067,8],[6075,8],[6083,20],[6103,5],[6108,8],[6116,9],[6125,11],[6136,10],[6146,8],[6154,3],[6157,9],[6166,5],[6171,5],[6176,6],[6182,3],[6185,6],[6191,3],[6194,5],[6199,4],[6203,5],[6208,6]],
            eighths: [0,22,31,39,47,59,65,72,81,91,97,106,111,119,129,138,147,153,163,171,182,190,194,202,207,217,223,231,237,240,247,252,257,263,268,272,277,285,288,296,306,314,324,333,342,354,365,372,382,394,404,412,424,435,444,451,462,472,477,487,497,502,504,511,515,520,527,536,548,555,564,569,577,583,590,595,604,614,620,630,638,647,656,664,670,673,679,685,691,701,709,713,717,726,735,741,750,758,765,774,779,789,802,815,825,837,848,858,869,880,884,892,900,909,916,924,929,934,940,947,959,975,985,993,1001,1011,1023,1031,1042,1054,1071,1086,1097,1104,1111,1118,1126,1134,1143,1154,1166,1176,1183,1192,1202,1210,1222,1233,1242,1249,1256,1265,1271,1277,1283,1292,1298,1307,1313,1323,1331,1339,1349,1355,1361,1370,1378,1386,1393,1404,1416,1428,1438,1450,1460,1471,1482,1491,1500,1508,1517,1529,1537,1548,1559,1569,1581,1594,1607,1620,1630,1639,1650,1663,1674,1685,1698,1708,1713,1723,1729,1739,1744,1753,1765,1774,1782,1793,1807,1828,1855,1884,1906,1920,1935,1943,1956,1968,1976,1984,1995,2003,2016,2025,2034,2044,2056,2069,2083,2094,2103,2118,2132,2144,2160,2166,2173,2184,2192,2201,2217,2228,2241,2254,2269,2288,2307,2323,2348,2382,2401,2418,2428,2442,2455,2471,2482,2496,2511,2523,2532,2553,2567,2581,2593,2603,2611,2620,2628,2639,2650,2662,2669,2692,2707,2726,2744,2762,2784,2798,2808,2817,2822,2829,2838,2845,2848,2859,2870,2884,2894,2910,2927,2950,2976,3008,3037,3072,3107,3136,3158,3169,3179,3194,3210,3220,3236,3248,3258,3268,3276,3286,3298,3310,3323,3330,3342,3351,3360,3371,3381,3395,3412,3425,3433,3444,3457,3474,3484,3495,3507,3519,3532,3539,3544,3551,3557,3564,3575,3579,3586,3600,3609,3617,3623,3636,3645,3661,3668,3684,3694,3705,3726,3744,3758,3778,3803,3832,3864,3895,3926,3964,3983,3993,4014,4046,4058,4069,4080,4088,4100,4113,4122,4131,4142,4151,4162,4174,4187,4199,4213,4221,4229,4242,4251,4261,4269,4276,4283,4297,4306,4318,4331,4350,4371,4393,4421,4454,4466,4477,4490,4503,4509,4521,4534,4544,4557,4570,4580,4589,4592,4600,4605,4618,4636,4655,4685,4710,4736,4756,4787,4807,4832,4859,4878,4917,4955,5006,5032,5060,5068,5074,5082,5089,5095,5105,5113,5127,5133,5140,5154,5165,5173,5182,5194,5200,5206,5213,5218,5236,5267,5296,5318,5353,5392,5411,5427,5450,5472,5503,5528,5567,5585,5613,5648,5688,5728,5775,5804,5836,5874,5895,5923,5958,6000,6035,6067,6108,6133,6171],
            sojood: [1162,1725,1956,2142,2307,2611,2910,3179,3512,3987,4242],
        }
    },
    /* prettier-ignore */
    suwar: [[],["الفاتحة","Al-Faatiha","The Opening","MK"],["البقرة","Al-Baqara","The Cow","MD"],["آل عمران","Aal-i-Imraan","The Family of Imraan","MD"],["النساء","An-Nisaa","The Women","MD"],["المائدة","Al-Maaida","The Table","MD"],["الأنعام","Al-An'aam","The Cattle","MK"],["الأعراف","Al-A'raaf","The Heights","MK"],["الأنفال","Al-Anfaal","The Spoils of War","MD"],["التوبة","At-Tawba","The Repentance","MD"],["يونس","Yunus","Jonas","MK"],["هود","Hud","Hud","MK"],["يوسف","Yusuf","Joseph","MK"],["الرعد","Ar-Ra'd","The Thunder","MD"],["ابراهيم","Ibrahim","Abraham","MK"],["الحجر","Al-Hijr","The Rock","MK"],["النحل","An-Nahl","The Bee","MK"],["الإسراء","Al-Israa","The Night Journey","MK"],["الكهف","Al-Kahf","The Cave","MK"],["مريم","Maryam","Mary","MK"],["طه","Taa-Haa","Taa-Haa","MK"],["الأنبياء","Al-Anbiyaa","The Prophets","MK"],["الحج","Al-Hajj","The Pilgrimage","MD"],["المؤمنون","Al-Muminoon","The Believers","MK"],["النور","An-Noor","The Light","MD"],["الفرقان","Al-Furqaan","The Criterion","MK"],["الشعراء","Ash-Shu'araa","The Poets","MK"],["النمل","An-Naml","The Ant","MK"],["القصص","Al-Qasas","The Stories","MK"],["العنكبوت","Al-Ankaboot","The Spider","MK"],["الروم","Ar-Room","The Romans","MK"],["لقمان","Luqman","Luqman","MK"],["السجدة","As-Sajda","The Prostration","MK"],["الأحزاب","Al-Ahzaab","The Clans","MD"],["سبإ","Saba","Sheba","MK"],["فاطر","Faatir","The Originator","MK"],["يس","Yaseen","Yaseen","MK"],["الصافات","As-Saaffaat","Those drawn up in Ranks","MK"],["ص","Saad","The letter Saad","MK"],["الزمر","Az-Zumar","The Groups","MK"],["غافر","Al-Ghaafir","The Forgiver","MK"],["فصلت","Fussilat","Explained in detail","MK"],["الشورى","Ash-Shura","Consultation","MK"],["الزخرف","Az-Zukhruf","Ornaments of gold","MK"],["الدخان","Ad-Dukhaan","The Smoke","MK"],["الجاثية","Al-Jaathiya","Crouching","MK"],["الأحقاف","Al-Ahqaf","The Dunes","MK"],["محمد","Muhammad","Muhammad","MD"],["الفتح","Al-Fath","The Victory","MD"],["الحجرات","Al-Hujuraat","The Inner Apartments","MD"],["ق","Qaaf","The letter Qaaf","MK"],["الذاريات","Adh-Dhaariyat","The Winnowing Winds","MK"],["الطور","At-Tur","The Mount","MK"],["النجم","An-Najm","The Star","MK"],["القمر","Al-Qamar","The Moon","MK"],["الرحمن","Ar-Rahmaan","The Beneficent","MD"],["الواقعة","Al-Waaqia","The Inevitable","MK"],["الحديد","Al-Hadid","The Iron","MD"],["المجادلة","Al-Mujaadila","The Pleading Woman","MD"],["الحشر","Al-Hashr","The Exile","MD"],["الممتحنة","Al-Mumtahana","She that is to be examined","MD"],["الصف","As-Saff","The Ranks","MD"],["الجمعة","Al-Jumu'a","Friday","MD"],["المنافقون","Al-Munaafiqoon","The Hypocrites","MD"],["التغابن","At-Taghaabun","Mutual Disillusion","MD"],["الطلاق","At-Talaaq","Divorce","MD"],["التحريم","At-Tahrim","The Prohibition","MD"],["الملك","Al-Mulk","The Sovereignty","MK"],["القلم","Al-Qalam","The Pen","MK"],["الحاقة","Al-Haaqqa","The Reality","MK"],["المعارج","Al-Ma'aarij","The Ascending Stairways","MK"],["نوح","Nooh","Noah","MK"],["الجن","Al-Jinn","The Jinn","MK"],["المزمل","Al-Muzzammil","The Enshrouded One","MK"],["المدثر","Al-Muddaththir","The Cloaked One","MK"],["القيامة","Al-Qiyaama","The Resurrection","MK"],["الانسان","Al-Insaan","Man","MD"],["المرسلات","Al-Mursalaat","The Emissaries","MK"],["النبإ","An-Naba","The Announcement","MK"],["النازعات","An-Naazi'aat","Those who drag forth","MK"],["عبس","Abasa","He frowned","MK"],["التكوير","At-Takwir","The Overthrowing","MK"],["الإنفطار","Al-Infitaar","The Cleaving","MK"],["المطففين","Al-Mutaffifin","Defrauding","MK"],["الإنشقاق","Al-Inshiqaaq","The Splitting Open","MK"],["البروج","Al-Burooj","The Constellations","MK"],["الطارق","At-Taariq","The Morning Star","MK"],["الأعلى","Al-A'laa","The Most High","MK"],["الغاشية","Al-Ghaashiya","The Overwhelming","MK"],["الفجر","Al-Fajr","The Dawn","MK"],["البلد","Al-Balad","The City","MK"],["الشمس","Ash-Shams","The Sun","MK"],["الليل","Al-Lail","The Night","MK"],["الضحى","Ad-Dhuhaa","The Morning Hours","MK"],["الشرح","Ash-Sharh","The Consolation","MK"],["التين","At-Tin","The Fig","MK"],["العلق","Al-Alaq","The Clot","MK"],["القدر","Al-Qadr","The Power, Fate","MK"],["البينة","Al-Bayyina","The Evidence","MD"],["الزلزلة","Az-Zalzala","The Earthquake","MD"],["العاديات","Al-Aadiyaat","The Chargers","MK"],["القارعة","Al-Qaari'a","The Calamity","MK"],["التكاثر","At-Takaathur","Competition","MK"],["العصر","Al-Asr","The Declining Day, Epoch","MK"],["الهمزة","Al-Humaza","The Traducer","MK"],["الفيل","Al-Fil","The Elephant","MK"],["قريش","Quraish","Quraysh","MK"],["الماعون","Al-Maa'un","Almsgiving","MK"],["الكوثر","Al-Kawthar","Abundance","MK"],["الكافرون","Al-Kaafiroon","The Disbelievers","MK"],["النصر","An-Nasr","Divine Support","MD"],["المسد","Al-Masad","The Palm Fibre","MK"],["الإخلاص","Al-Ikhlaas","Sincerity","MK"],["الفلق","Al-Falaq","The Dawn","MK"],["الناس","An-Naas","Mankind","MK"]],
    masahif: {},
  },

  /**
   * gets the verse number by surah & ayah
   * @param integer surah
   * @param integer ayah (optional)
   */
  getVerseNoByDuplet: function (surah, ayah = 1, mushaf) {
    return (
      Quran._const.countingTypes[Quran._const.masahif[mushaf].countingType].suwarAyat[surah][0] +
      ayah
    )
  },

  /**
   * gets the verse number by page
   * @param integer page
   */
  getVerseNoByPage: function (page, mushaf) {
    return Quran._const.masahif[mushaf].pagesByVerse[page - 1]
  },

  /**
   * gets the verse number by hizbEighth
   * @param integer hizbEighth
   */
  getVerseNoByEighthNo: function (eighthNo, mushaf) {
    return (
      Quran._const.countingTypes[Quran._const.masahif[mushaf].countingType].eighths[eighthNo - 1] +
      1
    )
  },

  /**
   * gets the eighthNo from verseNo
   * @param integer verseNo
   */
  getEighthNoByVerseNo: function (verseNo, mushaf) {
    return Quran._arraySearch(
      Quran._const.countingTypes[Quran._const.masahif[mushaf].countingType].eighths,
      verseNo - 1,
    )
  },

  /**
   * gets the eighth details from eighthNo
   * @param integer eighthNo
   */
  getEighthDetails: function (eighthNo, mushaf) {
    const verseNo = Quran.getVerseNoByEighthNo(eighthNo, mushaf)
    const duplet = Quran.getDupletByVerseNo(verseNo, mushaf)

    return {
      juz: Math.trunc(eighthNo / 16) + 1,
      hizb: Math.trunc(eighthNo / 8) + 1,
      eighth: (eighthNo % 8) + 1,
      verseNo,
      surah: duplet.surah,
      ayah: duplet.ayah,
      page: Quran.getPageByDuplet(duplet.surah, duplet.ayah, mushaf),
    }
  },

  /**
   * gets the duplet {surah:i,ayah:j} from verseNo
   * @param integer verseNo
   */
  getDupletByVerseNo: function (verseNo, mushaf) {
    return (
      Quran._dupletSearch(
        Quran._const.countingTypes[Quran._const.masahif[mushaf].countingType].suwarAyat,
        verseNo,
      ) || {
        surah: 1,
        ayah: 1,
      }
    )
  },

  /**
   * gets the page number from surah&ayah
   * @param integer surah
   * @param integer ayah (optional)
   */
  getPageByDuplet: function (surah, ayah, mushaf) {
    return (
      Quran._arraySearch(
        Quran._const.masahif[mushaf].pagesByVerse,
        Quran.getVerseNoByDuplet(surah, ayah, mushaf),
      ) + 1
    )
  },

  /**
   * gets the page number from surah&ayah
   * @param integer surah
   * @param integer ayah (optional)
   */
  getPageByVerse: function (verse, mushaf) {
    if (verse) return Quran._arraySearch(Quran._const.masahif[mushaf].pagesByVerse, verse) + 1
    return -1
  },

  /**
   * gets the page details using page number
   * @param integer page
   */
  getPageDetails: function (page, mushaf) {
    const firstVerse = Quran.getVerseNoByPage(page, mushaf)
    const lastVerse =
      page < Quran._const.masahif[mushaf].pagesByVerse.length
        ? Quran.getVerseNoByPage(page + 1, mushaf) - 1
        : Quran.getVerseNoByDuplet(114, 6, mushaf)

    const firstVerseDuplet = Quran.getDupletByVerseNo(firstVerse, mushaf)

    const currentEighthNo = Quran.getEighthNoByVerseNo(firstVerse - 1, mushaf)
    const currentEighthNoX = Quran.getEighthNoByVerseNo(firstVerse, mushaf)
    const nextVerseEighthNoPosition = Quran.getVerseNoByEighthNo(currentEighthNo + 2, mushaf)
    const nextVerseEighthNoPositionX = Quran.getVerseNoByEighthNo(currentEighthNoX + 2, mushaf)
    const hasNewEighthNo =
      nextVerseEighthNoPosition >= firstVerse && nextVerseEighthNoPosition <= lastVerse
    const currentEighthNoReal = Quran.getEighthNoByVerseNo(nextVerseEighthNoPositionX, mushaf)
    const { juz, hizb } = Quran.getEighthDetails(currentEighthNoReal - 1, mushaf)

    return {
      verseNo: firstVerse,
      surahDetails: Quran.getSurahDetails(firstVerseDuplet.surah, mushaf),
      surah: firstVerseDuplet.surah,
      ayah: firstVerseDuplet.ayah,
      eighthNo: currentEighthNoReal,
      juz,
      hizb,
      eighth: (currentEighthNo % 8) + 1,
      hasNewEighthNo,
      nextVerseEighthNoPosition,
      lastVerse,
      // sujood:null,
    }
  },

  /**
   * gets the surah detail object
   * @param integer surah
   */
  getSurahDetails: function (surah: number, mushaf) {
    const data: SurahDetails = {
      number: 0,
      start: 0,
      ayahs: 0,
      arabic_name: "",
      english_name: "",
      english_meaning: "",
      type: "",
      name: {
        ar: "",
        en: "",
        fr: "",
        audio: {
          ar: "",
        },
      },
    }
    const itemsAyat: string[] = ["start", "ayahs"]
    const itemsSuwar: string[] = ["arabic_name", "english_name", "english_meaning", "type"]
    for (let i = 0; i < itemsAyat.length; i++) {
      data[itemsAyat[i]] = Quran._const.countingTypes[Quran._const.masahif[mushaf].countingType]
        .suwarAyat[surah]?.[i] ?? [0, 7]
    }

    for (let i = 0; i < itemsSuwar.length; i++) {
      data[itemsSuwar[i]] = Quran._const.suwar[surah]?.[i] ?? []
      data.number = surah
    }

    // ADDED BY HOOTCH TO BUILD LANG
    data.name = {
      ar: data.arabic_name,
      en: data.english_name,
      fr: data.english_name,
      audio: { ar: "surah___" + surah },
    }

    return data
  },

  /**
   * gets the next surah & ayah, from current surah & ayah
   * @param integer surah
   * @param integer ayah
   */
  getNextDuplet: function (surah, ayah, mushaf) {
    if (++ayah > Quran.getSurahDetails(surah, mushaf).ayahs) {
      if (surah === 114) {
        ayah = 1
        surah = 1
      } else {
        ayah = 1
        surah++
      }
    }

    return {
      surah,
      ayah,
    }
  },

  /**
   * gets the prev surah & ayah, from current surah & ayah
   * @param integer surah
   * @param integer ayah
   */
  getPrevDuplet: function (surah, ayah, mushaf) {
    --ayah

    if (ayah <= 0) {
      if (surah <= 0) surah = 1

      if (surah <= 1) ayah = 1
      else ayah = Quran.getSurahDetails(--surah, mushaf).ayahs
    }

    return {
      surah,
      ayah,
    }
  },

  /**
   * gets the number of pagesByVerse
   */
  getNumberOfPages: function (mushaf) {
    return Quran._const.masahif[mushaf].pagesByVerse.length
  },

  /**
   * gets the counting type of mushaf
   */
  getCountingType: function (mushaf) {
    return Quran._const.masahif[mushaf].countingType
  },

  /**
   * gets the print page number from page number
   * @param integer page
   */
  getPrintPageNumber: function (page, mushaf) {
    return page - Quran._const.masahif[mushaf].extraStartPages
  },

  /**
   * gets suwar details
   */
  getSuwarDetails: function (mushaf) {
    return Quran._const.suwar.slice(1).map((sura, i) => Quran.getSurahDetails(i + 1, mushaf))
  },

  /**
   * internal method use
   * search the array and returns the required item
   * @param array theArray
   * @param mixed item
   */
  _arraySearch: function (theArray, item) {
    let down = 0
    let mid
    let up = theArray.length
    while (up - down > 1) {
      mid = (down + up) >> 1
      if (theArray[mid] < item) down = mid
      else up = mid
    }
    if (theArray[up] !== item) return up - 1
    return up
  },

  /**
   * internal method use / dichotomy
   * search the array of duplets [sura, length] and returns the required item
   * @param array theArray
   * @param mixed item
   */
  _dupletSearch: function (theArray, item) {
    let start = 1
    let end = theArray.length - 1
    while (start <= end) {
      const mid = Math.floor((start + end) / 2)
      if (item > theArray[mid][0] && item <= theArray[mid][0] + theArray[mid][1])
        return { surah: mid, ayah: item - theArray[mid][0] }
      else if (theArray[mid][0] < item) start = mid + 1
      else end = mid - 1
    }
    return false
  },
}
