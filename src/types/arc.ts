export type QualityName =
  | '专注' | '欺瞒' | '活力' | '共情' | '主动'
  | '坚毅' | '气场' | '专业' | '诡秘';

export interface AbilityAnswer {
  label: 'a' | 'b';
  text: string;
  code: string;
}

export interface Ability {
  name: string;
  trigger: string;
  quality: QualityName;
  success: string;
  enhancement: string;
  failure: string;
  question: string;
  answers: AbilityAnswer[];
}

export interface Anomaly {
  id: string;
  nameZh: string;
  nameEn: string;
  intro: string;
  abilities: Ability[];
  specialQuestion?: string;
  specialHint?: string;
}

export interface RelationshipPrompt {
  question: string;
  examples: string[];
}

export interface Reality {
  id: string;
  nameZh: string;
  nameEn: string;
  intro: string;
  special?: string;
  triggerName: string;
  triggerEffect: string;
  progressTrackName: string;
  overloadReleaseName: string;
  overloadReleaseEffect: string;
  onboardingQuestions: string[];
  relationshipPrompts: RelationshipPrompt[];
  personalQuestion?: string;
  personalQuestionHint?: string;
}

export interface SelfAssessmentOption {
  label: 'a' | 'b';
  text: string;
  quality: QualityName;
}

export interface SelfAssessmentQuestion {
  question: string;
  options: SelfAssessmentOption[];
}

export interface Career {
  id: string;
  nameZh: string;
  nameEn: string;
  intro: string;
  specialQuestion?: string;
  specialOptions?: string[];
  primeDirective: string;
  primeDirectiveEffect: string;
  authorizedActions: string[];
  initialRequisition: string;
  requisitionEffect: string;
  selfAssessment: SelfAssessmentQuestion[];
}

export interface RelationshipEntry {
  prompt: string;
  name: string;
  player: string;
  description: string;
  bondRewardId: string;
  bondBonus: string;
}

export interface ConnectionReward {
  id: string;
  name: string;
  effect: string;
}

export interface RequisitionEntry {
  name: string;
  effect: string;
  code: string;
}

export const GENERIC_REQUISITIONS: RequisitionEntry[] = [
  {
    name: '常规手提箱',
    effect: '这个毫无趣味、平平无奇的手提箱能够捕获并安全收容任何大小的异常体。要让普通手提箱生效，异常体必须筋疲力尽、被安抚，或是自愿的。小贴士：通常，成功收容异常的关键在于识别其焦点——即导致其诞生的核心思想或情感。',
    code: 'N/a',
  },
  {
    name: '波纹枪',
    effect: '此武器原本是1970年代某美国科幻电视剧的道具，目前已被证实为唯一能够直接干扰异常共振的装置。该武器仅能储存一发能量，只要「波纹枪」能够直接无障碍物阻挡的瞄准一个目标异常，便可释放能量对其进行永久性中和。注意事项：「波纹枪」内置安全机制，无法对共鸣体进行射击。确保自身绝不处于「波纹枪」与目标之间，以免不可预测的后果。出于中和任务目标以外的任何目的发射波纹枪，将被记3次申诫。',
    code: 'N/a',
  },
];

export interface CharacterFormState {
  characterName: string;
  pronouns: string;
  agencyTitle: string;
  agencyRank: string;
  commendations: string;
  reprimands: string;
  extraOverload: string;
  anomalyId: string;
  realityId: string;
  careerId: string;
  abilityAnswers: Record<string, 'a' | 'b'>;
  realitySpecialAnswer: string;
  careerSpecialAnswer: string;
  onboardingAnswers: string[];
  relationships: RelationshipEntry[];
  assessmentChoices: Record<number, 'a' | 'b'>;
  qualityScores: Record<QualityName, number>;
  genericOnboardingAnswers: string[];
  customRequisitions: RequisitionEntry[];
}

export const QUALITIES: QualityName[] = [
  '专注', '欺瞒', '活力', '共情', '主动',
  '坚毅', '气场', '专业', '诡秘',
];

export const GENERIC_ONBOARDING = [
  '你是如何与你的异常接触的？',
  '机构是如何找到你的？',
  '你的能力有独特的外在视觉表现吗？',
  '你喝咖啡有什么偏好？',
  '请描述你过往的工作经历。',
  '你对办公软件的熟悉程度如何？',
  '在协作型工作环境中，你能做出什么贡献？',
];

export const CONNECTION_REWARDS: ConnectionReward[] = [
  {
    id: 'custom',
    name: '自定义',
    effect: '',
  },
  {
    id: '1',
    name: '聪慧',
    effect: '此人总是走在前沿。在你下一次任务中，你可以随时召唤他提前预警潜在的危险或悲剧。',
  },
  {
    id: '2',
    name: '富有同情心',
    effect: '此人极具理解力，善于与人交往。在此奖励生效期间，他们不会变成松散端；如果你请求他们帮助平息一小群人的情绪，他们很可能成功。',
  },
  {
    id: '3',
    name: '人脉广泛',
    effect: '此人认识所有人。如果你需要介绍给除极为隐秘和保密的人之外的所有人，他们都能帮忙安排。如果因此让他们尴尬，你将失去与该关系的一点连结。',
  },
  {
    id: '4',
    name: '诅咒',
    effect: '此人在场时，总是事与愿违。在你的一次任务中，你可以请求他们礼貌地与某人或某事互动，这样诅咒就会传染给他们，为他们的一天制造不便和混乱。',
  },
  {
    id: '5',
    name: '早期采用者',
    effect: '此人拥有各式各样的奇异小工具。在你的一次任务中，你可以展示一款与当前情境高度契合的、他们已允许你借用的独特设备。如果该设备损坏或丢失，你将失去与该关系的一点连结。',
  },
  {
    id: '6',
    name: '激励型',
    effect: '通过与你的这位好友共同进行某项友谊仪式（比如喝饮料、打街头篮球、互相涂指甲油等），你可以在任务中任意时刻为自己恢复 3 点已用的资质保证点。',
  },
  {
    id: '7',
    name: '时尚达人',
    effect: '此人衣橱里拥有你可能需要的一切。如果你需要换装、伪装或一套令人印象深刻的服装，他们会迅速轻松地提供给你。如果你毁坏或丢失了他们的任何物品，你将失去与该关系的一点连结。',
  },
  {
    id: '8',
    name: '有影响力',
    effect: '在每次任务中，你可以向此人传达一个想法、趋势或观点，他们会立即通过自己的网络将其传播出去。之后，除极为隐秘的人外，所有你遇到的人都会知道这个想法并形成看法。',
  },
  {
    id: '9',
    name: '行动力强',
    effect: '此人拥有一种非同寻常的交通方式和充裕的空闲时间。在此奖励生效期间，他们会带你兜风或允许你借用他们的车辆。如果他们的车辆损坏或丢失，你将失去与该关系的一点连结。',
  },
  {
    id: '10',
    name: '坚韧',
    effect: '如果此人近在咫尺，他们可以在自己必须撤退恢复之前，保护平民免遭死亡，或保护你免受一次伤害，共计 3 次。',
  },
  {
    id: '11',
    name: '受人尊敬',
    effect: '在你的一次任务中，你可以请这位人士就任何人际关系问题提供建议。他们会清楚列出所有可能性或最佳选择，而且通常都是正确的。不过，告知他们过多信息仍可能导致松散端的产生。',
  },
  {
    id: '12',
    name: '博学',
    effect: '如果你需要了解某段历史信息或某个机械装置的工作原理，你可以在任务中联系此人，他们会可靠地给出答案。但告知他们过多信息仍可能引发松散端。',
  },
];

export function defaultScores(): Record<QualityName, number> {
  return { 专注: 0, 欺瞒: 0, 活力: 0, 共情: 0, 主动: 0, 坚毅: 0, 气场: 0, 专业: 0, 诡秘: 0 };
}

export function emptyForm(): CharacterFormState {
  return {
    characterName: '',
    pronouns: '',
    agencyTitle: '',
    agencyRank: '',
    commendations: '',
    reprimands: '',
    extraOverload: '',
    anomalyId: '',
    realityId: '',
    careerId: '',
    abilityAnswers: {},
    realitySpecialAnswer: '',
    careerSpecialAnswer: '',
    onboardingAnswers: ['', '', ''],
    relationships: [],
    assessmentChoices: {},
    qualityScores: defaultScores(),
    genericOnboardingAnswers: ['', '', '', '', '', '', ''],
    customRequisitions: [],
  };
}
