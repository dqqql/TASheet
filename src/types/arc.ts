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

export interface CharacterFormState {
  characterName: string;
  pronouns: string;
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
  };
}
