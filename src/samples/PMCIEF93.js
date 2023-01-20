const { Profile, Mappings } = require("../Profile");
const GMIT93 = require("./GMIT93");
const RIASEC93 = require("./RIASEC93");
const _16PF = require("./16PF93");

class PMCIEF93 extends Profile {
  // Number of pages
  static pages = 1;

  // Labels of the sample
  labels = {
    L1: { eng: "axis_2_raw", fr: "نمره کل" },
    L2: { eng: "axis_2_percentage", fr: "درصد" },

    L3: { eng: "axis_3_selection_demographic_raw", fr: "جمعیت شناختی" },
    L4: { eng: "axis_3_selection_partner_family_raw", fr: "خانواده مقابل" },
    L5: { eng: "axis_3_selection_belief_raw", fr: "شناختی - اعتقادی" },
    L6: { eng: "axis_3_selection_personality_raw", fr: "شخصیتی - اخلاقی" },
    L7: { eng: "axis_3_selection_negative_raw", fr: "سلبی" },
    L8: { eng: "axis_3_selection_raw", fr: "نمره کل (معیار انتخاب)" },
    L9: { eng: "axis_3_selection_percentage", fr: "(معیار انتخاب) درصد" },
    L10: { eng: "axis_3_intention_raw", fr: "نمره کل (قصد و نیت)" },
    L11: { eng: "axis_3_intention_percentage", fr: "درصد (قصد و نیت)" },
    L12: { eng: "axis_3_raw", fr: "نمره کل محور ۳" },
    L13: { eng: "axis_3_percentage", fr: "درصد محور ۳" },

    L14: { eng: "mibq_raw", fr: "نمره کل" },
    L15: { eng: "mibq_percentage", fr: "درصد" },
    L16: { eng: "mibq_negativity", fr: "منفی‌بافی" },
    L17: { eng: "mibq_unrealistic_expectations", fr: "توقعات\nنامعقول" },
    L18: { eng: "mibq_extreme_optimism", fr: "خوش‌بینی\nافراطی" },
    L19: { eng: "mibq_negative_self_belief", fr: "خودباوری\nمنفی" },
    L20: { eng: "mibq_perfectionism", fr: "کامل‌\nخواهی" },

    L21: { eng: "axis_5_raw", fr: "نمره کل" },
    L22: { eng: "axis_5_percentage", fr: "درصد" },
    L23: { eng: "axis_5_social_status", fr: "منزلت اجتماعی" },
    L24: { eng: "axis_5_safety", fr: "امنیت" },
    L25: { eng: "axis_5_pleasure", fr: "لذت" },
    L26: { eng: "axis_5_control", fr: "کنترل" },
    L27: { eng: "axis_5_spirituality", fr: "معنویت" },

    L28: { eng: "faces_cohesion", fr: "انسجام" },
    L29: { eng: "faces_flexibility", fr: "انعطاف‌پذیری" },
    L30: { eng: "faces_interpretation", fr: "تفسیر" },
    L31: { eng: "faces_a", fr: "منسجم متعادل" },
    L32: { eng: "faces_d", fr: "در هم تنیده" },
    L33: { eng: "faces_c", fr: "از هم گسسته" },
    L34: { eng: "faces_e", fr: "خشک" },
    L35: { eng: "faces_f", fr: "آشفته" },
    L36: { eng: "faces_b", fr: "انعطاف‌پذیر متعادل" },
    L37: { eng: "faces_communication", fr: "برقراری ارتباط در خانواده" },
    L38: { eng: "faces_satisfaction", fr: "رضایت خانواده" },

    L39: { eng: "pastq_raw", fr: "نمره کل" },
    L40: { eng: "pastq_authoritarian_family", fr: "خانواده مقتدر" },
    L41: { eng: "pastq_family_structure", fr: "شاخص ساخت\nخانوادگی" },
    L42: { eng: "pastq_authoritative_family", fr: "خانواده سخت‌گیر" },
    L43: { eng: "pastq_permissive_family", fr: "خانواده سهل‌گیر" },
    L44: { eng: "pastq_neglectful_family", fr: "خانواده بی‌تفاوت" },

    L45: { eng: "jpfq_identity", fr: "هویت" },
    L46: { eng: "jpfq_intimacy", fr: "صمیمیت" },
    L47: { eng: "jpfq_empathy", fr: "همدلی" },
    L48: { eng: "jpfq_self_direction", fr: "خودراهبری" },
    L49: { eng: "jpfq_psychoticism", fr: "سایکوزگرایی" },
    L50: { eng: "jpfq_detachment", fr: "دل‌بریدگی" },
    L51: { eng: "jpfq_disinhibition", fr: "مهارگسیختگی" },
    L52: { eng: "jpfq_negative_affectivity", fr: "عاطفه‌پذیری منفی" },
    L53: { eng: "jpfq_antagonism", fr: "تضادورزی" },

    L54: { eng: "axis_7_axis7_2_raw", fr: "نمره کل" },
    L55: { eng: "axis_7_axis7_2_percentage", fr: "درصد" },
    L56: { eng: "axis_7_axis7_2_hope", fr: "امید" },
    L57: { eng: "axis_7_axis7_2_foresight", fr: "آینده‌نگری" },
    L58: { eng: "axis_7_axis7_2_proposing", fr: "نقشه زندگی" },
    L59: { eng: "axis_7_axis7_2_competency", fr: "شایستگی" },
    L60: { eng: "axis_7_axis7_2_identity", fr: "هویت" },
    L61: { eng: "axis_7_axis7_2_intimacy", fr: "صمیمیت" },

    L62: { eng: "axis_8_axis8_1_raw", fr: "نمره کل" },
    L63: { eng: "axis_8_axis8_1_percentage", fr: "درصد" },
    L64: { eng: "axis_8_axis8_1_physical_problem", fr: "مشکل جسمانی" },
    L65: { eng: "axis_8_axis8_1_neurotic_problem", fr: "مشکل نوروتیک" },
    L66: { eng: "axis_8_axis8_1_personality_disorder", fr: "اختلال شخصیت" },
    L67: { eng: "dswls_raw", fr: "نمره کل" },

    L68: { eng: "alvvct_theoretical", fr: "نظری" },
    L69: { eng: "alvvct_economic", fr: "اقتصادی" },
    L70: { eng: "alvvct_aesthetic", fr: "هنری" },
    L71: { eng: "alvvct_religious", fr: "اجتماعی" },
    L72: { eng: "alvvct_social", fr: "سیاسی" },
    L73: { eng: "alvvct_political", fr: "مذهبی" },
  };

  profileSpec = {
    /* "sample" determines some important info about the sample and profile */
    /* Default prerequisites: 1. gender, 2. age, 3. education */
    /* "prerequisites" is synonym to "fields" in our program */
    sample: {
      name: "پرسشنامه مشاوره پیش از ازدواج - فرم الف" /* Name of the sample */,
      multiProfile: false /* Whether the sample has multiple profiles or not */,
      questions: false /* Determines whether to get questions from inital dataset or not */,
      defaultFields: true /* Determines whether to have default prerequisites in the profile or not */,
      fields: ["marital_status"] /* In case you want to get some additional fields and show in the profile */,
    },
    /* "profile" determines the dimensions of the drawn profile (to be used in svg tag viewbox) */
    /* calculating its dimensions carefully is of great importance */
    profile: {
      get dimensions() {
        return {
          width: 903 + 2 * this.padding.x,
          height: 714 + 2 * this.padding.y,
        };
      },
      padding: {
        x: 0,
        y: 0,
      },
    },
    ravenItem: {},
    /* "labels" part which has to be provided for each profile */
    labels: Object.values(this.labels),
  };

  constructor(dataset, options, config = {}) {
    super();
    this._init(dataset, options, config);
  }

  _calcContext() {
    const {
      spec: { parameters: spec },
      dataset,
    } = this;

    const {} = spec;

    console.log(dataset.score)

    const [GMIT_Context] = new GMIT93(
      { score: Object.fromEntries(dataset.score.slice(11, 19).map((s) => [s.label.eng, s.mark])) },
      {},
      {
        items: {
          offsetY: 7,
          offsetX: 55,
          ticks: {
            heightOffset: 10,
            numberOffset: { x: 3, y: 0 },
          },
          rect: { height: 10 },
          widthCoeff: 7,
          label: { offsetX: 5 },
        },
        labelsPrefix: "gmit",
      }
    ).getTemplateEngineParams();

    const [_16PF_Context] = new _16PF(
      {
        score: Object.fromEntries(dataset.score.slice(25).map((s) => [s.label.eng, s.mark])),
        fields: dataset.info.fields,
      },
      {},
      {
        items: {
          offsetY: 19,
          widthCoeff: 9,
          label: {
            offsetX: 9,
          },
        },
        gaugeItems: {
          offsetX: 46,
          circle: {
            R: 16.5,
            r: 12,
          },
        },
        labelsPrefix: "16pf",
      }
    ).getTemplateEngineParams();

    return [{}];
  }
}

module.exports = PMCIEF93;
