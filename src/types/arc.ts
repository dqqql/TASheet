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
