import { type TValidationRule } from 'types/form';
import { REQUIRED_ERR_TEXT, VALIDATION_CHECKS } from 'constants/validation';

export const validateField = (rule: TValidationRule, value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return REQUIRED_ERR_TEXT;
  }

  const failedCheck = VALIDATION_CHECKS[rule].find(
    ({ pattern }) => !pattern.test(trimmedValue)
  );

  return failedCheck?.message ?? '';
};
