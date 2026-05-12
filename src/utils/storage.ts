import type { CharacterFormState } from '../types/arc';
import { emptyForm } from '../types/arc';

const KEY = 'triangle-agency-character';

export function loadForm(): CharacterFormState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyForm();
    const parsed = JSON.parse(raw);
    return { ...emptyForm(), ...parsed };
  } catch {
    return emptyForm();
  }
}

export function saveForm(state: CharacterFormState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearForm(): void {
  localStorage.removeItem(KEY);
}

export function exportJson(state: CharacterFormState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = state.characterName
    ? `${state.characterName}-角色存档.json`
    : 'triangle-agency-character.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importJson(): Promise<CharacterFormState> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error('No file'));
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          resolve({ ...emptyForm(), ...parsed });
        } catch {
          reject(new Error('Invalid JSON'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
