export type RecitersID = "mohamed_muktali_ibrahimi"

export const Reciters = {
  mohamed_muktali_ibrahimi: {
    enabled: true,
    id: "mohamed_muktali_ibrahimi",
    mushaf: "imamMalik",
    ext: "mp3",
    url: "https://etymodb.com/rsc/mqatli",
    local: "recitations/mohamed_muktali_ibrahimi",
    getAudioAnnotations: () => require("./audioAnnotations/mohamed_muktali_ibrahimi.json"),
    meta: {
      name: {
        ar: "محمد مقاتلي الإبراهيمي",
        en: "Mohamed Moktali El Ibrahimi",
        fr: "Mohamed Moktali El Ibrahimi",
      },
      riwaya: {
        ar: "رواية ورش عن الإمام نافع من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      riwayaShort: {
        ar: "رواية ورش من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      edition: {
        ar: "تسجيل رسمي",
        en: "Official Recording",
        fr: "Enregistrement officiel",
      },
    },
  },
  warsh_yassin_al_jazaery: {
    enabled: true,
    id: "warsh_yassin_al_jazaery",
    mushaf: "imamMalik",
    ext: "mp3",
    url: "https://ia800301.us.archive.org/8/items/Yassine_El-Jazaery",
    local: "recitations/warsh_yassin_al_jazaery",
    getAudioAnnotations: () => require("./audioAnnotations/warsh_yassin_al_jazaery.json"),
    meta: {
      name: {
        ar: "ياسين الجزائري",
        en: "Yassine El Jazairi",
        fr: "Yassine El Jazairi",
      },
      riwaya: {
        ar: "رواية ورش عن الإمام نافع من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      riwayaShort: {
        ar: "رواية ورش من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      edition: {
        ar: "أرشيف",
        en: "Archive",
        fr: "Archives",
      },
    },
  },
  riyadh_ayet_hamou: {
    enabled: true,
    id: "riyadh_ayet_hamou",
    mushaf: "imamMalik",
    ext: "mp3",
    url: "https://etymodb.com/rsc/hammu",
    local: "recitations/riyadh_ayet_hamou",
    getAudioAnnotations: () => require("./audioAnnotations/riyadh_ayet_hamou.json"),
    meta: {
      name: {
        ar: "رياض آيت حمو",
        en: "Riyadh Ait Hamou",
        fr: "Riyadh Ait Hamou",
      },
      riwaya: {
        ar: "رواية ورش عن الإمام نافع من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      riwayaShort: {
        ar: "رواية ورش من طريق الأزرق",
        en: "Warsh from Imam Nafi' via Azraq",
        fr: "Warsh de l'Imam Nafi' via Azraq",
      },
      edition: {
        ar: "تسجيل رسمي",
        en: "Official Recording",
        fr: "Enregistrement officiel",
      },
    },
  },
}
