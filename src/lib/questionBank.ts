import { Question } from '@/types';
import { PHYSICS_QUESTIONS } from './questions/physics';
import { CHEMISTRY_QUESTIONS } from './questions/chemistry';
import { BIOLOGY_QUESTIONS } from './questions/biology';
import { MAT_QUESTIONS } from './questions/mat';

export const INITIAL_QUESTION_BANK: Question[] = [
  ...PHYSICS_QUESTIONS,
  ...CHEMISTRY_QUESTIONS,
  ...BIOLOGY_QUESTIONS,
  ...MAT_QUESTIONS
];
