import { reactive, computed } from "vue";

type Validator = (value: any) => string | null;
type ValidationRules = Record<string, Validator[]>;

export function useFormValidation(rules: ValidationRules, initialData: Record<string, any>) {
  const errors = reactive<Record<string, string | null>>({});

  const validateAllFields = () => {
    Object.entries(initialData).forEach(([field, value]) => {
      errors[field] = null;
      for (const validator of rules[field] || []) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    });
  };

  validateAllFields();

  const validateField = (field: string, value: any) => {
    errors[field] = null;
    for (const validator of rules[field]) {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  };

  const validateForm = () => {
    Object.entries(initialData).forEach(([field, value]) => {
      validateField(field, value);
    });
    return isValid.value;
  };

  const isValid = computed(() => !Object.values(errors).some((error) => error !== null));

  return {
    errors,
    isValid,
    validateForm,
    validateField,
  };
}
